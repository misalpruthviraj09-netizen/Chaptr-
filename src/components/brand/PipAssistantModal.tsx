import React, { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, RotateCcw, Lightbulb } from "lucide-react";
import { Pip, PipMood } from "./Pip";
import { api } from "../../services/api";

interface Message {
  id: string;
  sender: "user" | "pip";
  text: string;
}

interface PipAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  context?: {
    bookTitle?: string;
    missionTitle?: string;
    concept?: string;
  };
}

// Lightweight Markdown formatter component for Pip's structured answers
const FormattedMessage: React.FC<{ text: string; isUser: boolean }> = ({ text, isUser }) => {
  if (isUser) {
    return <span className="whitespace-pre-wrap">{text}</span>;
  }

  // Parse lines for headers, bullet points, quotes, and bold text
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let inList = false;

  const flushList = () => {
    if (inList && currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="my-1.5 space-y-1 pl-4 list-disc marker:text-indigo-400">
          {currentList}
        </ul>
      );
      currentList = [];
      inList = false;
    }
  };

  const renderInlineFormatted = (raw: string) => {
    // Replace **bold**
    const parts = raw.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-indigo-900 dark:text-indigo-200">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return (
          <em key={i} className="italic text-slate-800 dark:text-slate-200">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      flushList();
      continue;
    }

    // Headers
    if (line.startsWith("### ")) {
      flushList();
      elements.push(
        <h4 key={`h3-${i}`} className="font-display font-bold text-slate-900 dark:text-white text-sm mt-2 mb-1 flex items-center gap-1.5">
          {line.replace(/^###\s+/, "")}
        </h4>
      );
      continue;
    }

    if (line.startsWith("#### ")) {
      flushList();
      elements.push(
        <h5 key={`h4-${i}`} className="font-display font-semibold text-slate-800 dark:text-slate-200 text-xs mt-1.5 mb-0.5">
          {line.replace(/^####\s+/, "")}
        </h5>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      flushList();
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="border-l-2 border-indigo-400 dark:border-indigo-500 pl-3 py-1 my-1.5 italic text-slate-600 dark:text-slate-300 text-xs bg-indigo-50/50 dark:bg-indigo-950/20 rounded-r-lg"
        >
          {renderInlineFormatted(line.replace(/^>\s+/, ""))}
        </blockquote>
      );
      continue;
    }

    // Bullet point
    if (line.startsWith("* ") || line.startsWith("- ") || line.startsWith("• ")) {
      inList = true;
      const content = line.replace(/^[\*\-•]\s+/, "");
      currentList.push(
        <li key={`li-${i}`} className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          {renderInlineFormatted(content)}
        </li>
      );
      continue;
    }

    // Numbered list item
    const numberedMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      flushList();
      elements.push(
        <div key={`num-${i}`} className="flex gap-2 my-1 text-xs text-slate-700 dark:text-slate-300">
          <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0">{numberedMatch[1]}.</span>
          <span className="leading-relaxed">{renderInlineFormatted(numberedMatch[2])}</span>
        </div>
      );
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={`p-${i}`} className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 my-1">
        {renderInlineFormatted(line)}
      </p>
    );
  }

  flushList();

  return <div className="space-y-1">{elements}</div>;
};

export const PipAssistantModal: React.FC<PipAssistantModalProps> = ({
  isOpen,
  onClose,
  context,
}) => {
  const getWelcomeMessage = () => {
    if (context?.bookTitle) {
      return `Hi there! I'm Pip, your AI study buddy. Ask me anything about **"${context.bookTitle}"** or any concept you want to master with a simple analogy!`;
    }
    return "Hi there! I'm Pip, your AI study buddy. What book, concept, mental model, or study technique can I help you master today?";
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "pip",
      text: getWelcomeMessage(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pipMood, setPipMood] = useState<PipMood>("happy");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  if (!isOpen) return null;

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setPipMood("thinking");

    try {
      // Build conversation history for multi-turn coherence
      const historyPayload = newMessages
        .filter((m) => m.id !== "welcome")
        .slice(-6)
        .map((m) => ({
          role: m.sender === "user" ? "user" : "model",
          text: m.text,
        }));

      const res = await api.tutor.ask({
        message: textToSend,
        bookTitle: context?.bookTitle,
        missionTitle: context?.missionTitle,
        concept: context?.concept,
        history: historyPayload,
      });

      const pipReply: Message = {
        id: `pip-${Date.now()}`,
        sender: "pip",
        text: res.reply,
      };

      setMessages((prev) => [...prev, pipReply]);
      setPipMood("cheering");
      setTimeout(() => setPipMood("happy"), 2500);
    } catch {
      const fallbackReply: Message = {
        id: `pip-${Date.now()}`,
        sender: "pip",
        text: "I ran into a temporary connection flutter! Here is a core tip: when studying complex ideas, try explaining them out loud in one sentence using the **Feynman Technique**. What specific angle should we explore?",
      };
      setMessages((prev) => [...prev, fallbackReply]);
      setPipMood("happy");
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome",
        sender: "pip",
        text: getWelcomeMessage(),
      },
    ]);
    setPipMood("happy");
  };

  const getSmartSuggestions = () => {
    const book = (context?.bookTitle || "").toLowerCase();
    if (book.includes("habit")) {
      return [
        "Explain the 2-minute rule",
        "Give an analogy for habit loops",
        "How do I break a bad habit?",
        "What is habit stacking?",
      ];
    }
    if (book.includes("meditation") || book.includes("stoic")) {
      return [
        "Explain the dichotomy of control",
        "Give a Stoic analogy for dealing with stress",
        "How did Marcus Aurelius handle frustration?",
        "What is Amor Fati?",
      ];
    }
    if (book.includes("war") || book.includes("strategy")) {
      return [
        "Explain Sun Tzu's concept of winning without fighting",
        "How does positioning beat raw force?",
        "Give a modern analogy for strategy",
      ];
    }
    if (book.includes("thinketh")) {
      return [
        "Explain the garden analogy for the mind",
        "How do thoughts shape character?",
        "How do I build serenity?",
      ];
    }
    return [
      "Explain active recall vs rereading",
      "Give me a memorable analogy for this",
      "How do I apply this to my daily routine?",
      "Summarize the core mental model",
    ];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#131A2E] w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[600px] max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/90 dark:bg-[#0E1526]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0 shadow-sm">
              <Pip mood={pipMood} size="sm" animate={false} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">
                  Pip AI Mentor
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-[#3730A3] dark:text-indigo-300">
                  <Sparkles size={10} />
                  Gemini Flash AI
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[260px] sm:max-w-xs">
                {context?.missionTitle
                  ? `Focusing on: ${context.missionTitle}`
                  : context?.bookTitle
                  ? `Book: ${context.bookTitle}`
                  : "Your personal learning companion"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Reset conversation"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${
                m.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.sender === "pip" && (
                <div className="shrink-0 mt-1">
                  <Pip mood={m.id === messages[messages.length - 1]?.id ? pipMood : "happy"} size="sm" animate={false} />
                </div>
              )}
              <div
                className={`max-w-[88%] sm:max-w-[82%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                  m.sender === "user"
                    ? "bg-[#3730A3] text-white rounded-br-none font-medium"
                    : "bg-slate-100/90 dark:bg-[#1A2238] text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60"
                }`}
              >
                <FormattedMessage text={m.text} isUser={m.sender === "user"} />
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center">
              <Pip mood="thinking" size="sm" animate={true} />
              <div className="bg-slate-100 dark:bg-[#1A2238] px-4 py-3 rounded-2xl text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                <span>Pip is thinking and formulating a clear analogy...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Smart Suggestions Chips */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0E1526]/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <Lightbulb size={13} className="text-amber-500 shrink-0 ml-1" />
          {getSmartSuggestions().map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(prompt)}
              disabled={loading}
              className="whitespace-nowrap text-[11px] font-medium px-3 py-1.5 rounded-lg bg-white dark:bg-[#182138] hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-slate-700/80 shadow-xs transition-colors shrink-0 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-[#131A2E]"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Pip anything about this lesson or book..."
            disabled={loading}
            className="flex-1 bg-slate-100 dark:bg-[#1A2238] px-4 py-2.5 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent focus:border-indigo-500 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="btn-3d px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-colors shrink-0 shadow-sm flex items-center gap-1.5 font-display font-semibold text-xs"
            title="Send"
          >
            <span>Ask</span>
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};
