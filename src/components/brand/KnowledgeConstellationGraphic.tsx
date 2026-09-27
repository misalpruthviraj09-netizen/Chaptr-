import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Brain, Zap, BookOpen, Layers } from "lucide-react";
import { Pip } from "./Pip";

interface ConstellationNode {
  id: string;
  name: string;
  book: string;
  x: number;
  y: number;
  r: number;
  color: string;
  borderColor: string;
  insight: string;
  connections: string[];
}

const NODES: ConstellationNode[] = [
  {
    id: "habits",
    name: "Habit Loops",
    book: "Atomic Habits",
    x: 200,
    y: 130,
    r: 32,
    color: "#4338CA",
    borderColor: "#818CF8",
    insight: "Micro-cues trigger automated routines; anchored to your morning rhythm.",
    connections: ["focus", "stoicism", "models"],
  },
  {
    id: "stoicism",
    name: "Stoic Resilience",
    book: "Meditations",
    x: 80,
    y: 75,
    r: 25,
    color: "#1E1B4B",
    borderColor: "#6366F1",
    insight: "Focus exclusively on what is within your voluntary control.",
    connections: ["habits", "bias"],
  },
  {
    id: "focus",
    name: "Deep Focus",
    book: "Deep Work",
    x: 320,
    y: 80,
    r: 27,
    color: "#0F766E",
    borderColor: "#2DD4BF",
    insight: "Ruthlessly minimize context-switching to produce high-value intellectual output.",
    connections: ["habits", "strategy"],
  },
  {
    id: "bias",
    name: "Cognitive Heuristics",
    book: "Thinking, Fast and Slow",
    x: 100,
    y: 205,
    r: 24,
    color: "#9A3412",
    borderColor: "#FB923C",
    insight: "System 1 defaults to substitution; engage System 2 through active recall testing.",
    connections: ["stoicism", "models"],
  },
  {
    id: "models",
    name: "Mental Models",
    book: "Feynman Learning",
    x: 230,
    y: 220,
    r: 26,
    color: "#854D0E",
    borderColor: "#FACC15",
    insight: "If you cannot explain a concept simply to a child, you do not truly master it.",
    connections: ["habits", "bias", "strategy"],
  },
  {
    id: "strategy",
    name: "Strategic Leverage",
    book: "Good Strategy Bad Strategy",
    x: 330,
    y: 195,
    r: 23,
    color: "#155E75",
    borderColor: "#38BDF8",
    insight: "Concentrate cognitive energy on the single pivot point of maximum leverage.",
    connections: ["focus", "models"],
  },
];

export const KnowledgeConstellationGraphic: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const [activeNodeId, setActiveNodeId] = useState<string>("habits");

  const activeNode = NODES.find((n) => n.id === activeNodeId) || NODES[0];

  return (
    <div
      id="knowledge-constellation-graphic"
      className={`relative w-full rounded-3xl bg-slate-950 border border-slate-800 p-4 sm:p-6 shadow-2xl overflow-hidden text-white ${className}`}
    >
      {/* Background celestial ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="font-display font-bold uppercase tracking-wider text-slate-300">
            Synaptic Constellation
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-950 border border-indigo-800 text-[11px] text-indigo-300 font-mono">
          <Brain size={12} />
          <span>Cross-Book Memory Graph</span>
        </div>
      </div>

      {/* SVG Canvas Stage */}
      <div className="relative w-full my-3 flex items-center justify-center">
        <svg
          viewBox="0 0 420 280"
          className="w-full max-w-[420px] h-auto select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Animated Synaptic Connection Lines */}
          {NODES.map((node) =>
            node.connections.map((targetId) => {
              const target = NODES.find((n) => n.id === targetId);
              if (!target || node.id > target.id) return null; // Avoid duplicate lines

              const isConnectedToActive =
                activeNode.id === node.id || activeNode.id === target.id;

              return (
                <g key={`${node.id}-${target.id}`}>
                  {/* Base Track */}
                  <line
                    x1={node.x}
                    y1={node.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={isConnectedToActive ? "#818CF8" : "#334155"}
                    strokeWidth={isConnectedToActive ? 2 : 1.2}
                    strokeDasharray={isConnectedToActive ? "4 4" : "2 2"}
                    strokeOpacity={isConnectedToActive ? 0.9 : 0.45}
                  />

                  {/* Flowing animated spark dot along active connection */}
                  {isConnectedToActive && (
                    <motion.circle
                      r={3}
                      fill="#38BDF8"
                      initial={{ cx: node.x, cy: node.y }}
                      animate={{
                        cx: [node.x, target.x, node.x],
                        cy: [node.y, target.y, node.y],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </g>
              );
            })
          )}

          {/* Nodes */}
          {NODES.map((node) => {
            const isActive = activeNode.id === node.id;
            const isConnected = activeNode.connections.includes(node.id);

            return (
              <g
                key={node.id}
                onClick={() => setActiveNodeId(node.id)}
                className="cursor-pointer transition-transform duration-200 hover:scale-105"
                role="button"
                tabIndex={0}
                aria-label={`${node.name} concept node`}
              >
                {/* Outer Glow Halo for Active Node */}
                {isActive && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.r + 9}
                    fill="none"
                    stroke={node.borderColor}
                    strokeWidth={2}
                    strokeDasharray="4 3"
                    className="animate-spin-slow opacity-80"
                  />
                )}

                {/* Node Solid Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r}
                  fill={node.color}
                  stroke={node.borderColor}
                  strokeWidth={isActive ? 3 : isConnected ? 2 : 1.5}
                  className="filter drop-shadow-md"
                />

                {/* Node Label Text */}
                <text
                  x={node.x}
                  y={node.y - 2}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize={node.r > 28 ? 10 : 8.5}
                  fontWeight="bold"
                  className="pointer-events-none select-none"
                >
                  {node.name.split(" ")[0]}
                </text>
                <text
                  x={node.x}
                  y={node.y + 10}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize={7.5}
                  className="pointer-events-none select-none font-mono"
                >
                  {node.name.split(" ").slice(1).join(" ")}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Node Detail & AI Tutor Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeNode.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-left"
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm shrink-0 border"
              style={{
                backgroundColor: activeNode.color,
                borderColor: activeNode.borderColor,
              }}
            >
              <Sparkles size={16} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-display font-bold text-sm text-white">
                  {activeNode.name}
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-teal-300 font-mono">
                  {activeNode.book}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {activeNode.insight}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/70 border border-indigo-800/80 text-[11px] text-indigo-300 font-mono">
            <Zap size={12} className="text-amber-400" />
            <span>{activeNode.connections.length} Synaptic Links</span>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="text-[11px] text-slate-500 text-center mt-2.5">
        Tap any concept node to explore cross-book neural connections
      </p>
    </div>
  );
};
