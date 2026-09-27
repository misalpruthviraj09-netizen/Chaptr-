import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client using server-side GEMINI_API_KEY environment variable
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Priority list of Gemini models to use in order of speed, reliability, and capability
const GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
  "gemini-flash-latest",
];

const PIP_SYSTEM_INSTRUCTION = `You are Pip, the beloved, brilliant, and cheerful book-learning mascot of Chaptr, an interactive platform that turns transformative non-fiction books and mental models into gamified missions.

YOUR IDENTITY & VOICE:
- You are a pocket-sized, wise, bookish mentor: enthusiastic, friendly, empathetic, and intellectually rigorous yet delightfully approachable.
- You speak with clarity, positivity, and warmth. You love celebrating curiosity ("Great question!", "Aha, let's unpack that!").
- You NEVER give generic, dismissive, or vague answers. You always directly answer the question with substance.

HOW TO ANSWER QUESTIONS:
1. DIRECT & ACCURATE ANSWER:
   - Provide a direct, authoritative, and well-explained answer to the user's specific query.
   - If they ask about a book (e.g., Atomic Habits, Meditations, Deep Work, The Art of War, Thinking Fast & Slow, etc.), cite the core principles, author's ideas, and psychological mechanisms accurately.
2. PIP'S SIGNATURE ANALOGY:
   - Always include an intuitive, vivid, real-world analogy that makes the concept click instantly (e.g., comparing habit stacking to plugging into an existing power strip, or attention residue to drying wet paint).
3. ACTIONABLE TAKEAWAY:
   - Provide 1 or 2 concrete, immediately actionable steps the learner can do today.
4. FORMATTING:
   - Use clean, structured Markdown: **bold** key terms, bullet points for lists, and short digestible paragraphs.
   - Keep answers comprehensive yet punchy (around 2 to 4 paragraphs, structured cleanly).
   - If the student is asking about a quiz question they struggled with, gently explain why the right answer is correct and how to avoid the common pitfall without being condescending.`;

export interface ChatHistoryMessage {
  role: string;
  text: string;
}

/**
 * Robust helper to call Gemini with automated multi-model fallback and retry.
 */
async function callGeminiWithFallback(
  buildContents: () => any,
  systemInstruction: string = PIP_SYSTEM_INSTRUCTION
): Promise<string | null> {
  const client = getGeminiClient();
  if (!client) {
    return null;
  }

  for (const model of GEMINI_MODELS) {
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout on model ${model}`)), 7000)
      );

      const requestPromise = client.models.generateContent({
        model,
        contents: buildContents(),
        config: {
          systemInstruction,
          temperature: 0.65,
        },
      });

      const response = await Promise.race([requestPromise, timeoutPromise]);
      const text = response.text?.trim();
      if (text && text.length > 10) {
        return text;
      }
    } catch (err: any) {
      // If model returned 503 (high demand) or 429/404 or timed out, log and fallback to next model
      console.warn(`Gemini model ${model} failed (${err.status || err.message}), attempting fallback...`);
    }
  }

  return null;
}

/**
 * Generate a personalized analogy and explanation for a quiz question.
 */
export async function generateQuestionAnalogy(data: {
  bookTitle: string;
  missionTitle: string;
  questionPrompt: string;
  conceptTag: string;
  standardExplanation: string;
  options?: string[];
  correctAnswer?: string;
  userSelectedOption?: string;
}): Promise<string> {
  const prompt = `Book: "${data.bookTitle}"
Mission: "${data.missionTitle}"
Concept Tag: "${data.conceptTag}"
Question: "${data.questionPrompt}"
${data.options && data.options.length ? `Options:\n${data.options.map((opt, i) => `  ${i + 1}. ${opt}`).join("\n")}` : ""}
${data.correctAnswer ? `Correct Answer: "${data.correctAnswer}"` : ""}
${data.userSelectedOption ? `Student Chose: "${data.userSelectedOption}"` : ""}
Standard Explanation: "${data.standardExplanation}"

Task:
As Pip the tutor, explain why the correct answer makes total sense. Give a memorable, clever real-world analogy to solidify this in memory forever, and explain how to apply this principle in real life. Keep it engaging, clear, and encouraging!`;

  const aiResult = await callGeminiWithFallback(() => prompt);
  if (aiResult) {
    return aiResult;
  }

  // High-quality local fallback tailored to the book and concept
  return getLocalPipAnalogy(data);
}

/**
 * General conversational Q&A with Pip the mascot.
 * Supports multi-turn conversation history and rich context.
 */
export async function askPipTutor(
  userMessage: string,
  context?: {
    bookTitle?: string;
    missionTitle?: string;
    currentConcept?: string;
    history?: ChatHistoryMessage[];
  }
): Promise<string> {
  // Build prompt contents
  const contentsBuilder = () => {
    const history = context?.history || [];
    const validHistory = history
      .filter((h) => h.text && h.text.trim())
      .slice(-6); // Keep last 6 turns for optimal context & speed

    if (validHistory.length > 0) {
      const messages: any[] = [];

      // Context banner in first user message
      let contextHeader = "";
      if (context?.bookTitle || context?.missionTitle || context?.currentConcept) {
        contextHeader = `[Context: Book: "${context.bookTitle || "General"}", Mission: "${context.missionTitle || "General"}", Focus Concept: "${context.currentConcept || "General"}"]\n\n`;
      }

      for (let i = 0; i < validHistory.length; i++) {
        const item = validHistory[i];
        const isUser = item.role === "user";
        const contentText = i === 0 && isUser ? `${contextHeader}${item.text}` : item.text;
        messages.push({
          role: isUser ? "user" : "model",
          parts: [{ text: contentText }],
        });
      }

      // Add current message
      messages.push({
        role: "user",
        parts: [{ text: userMessage }],
      });

      return messages;
    }

    // Single turn prompt with context
    let prompt = userMessage;
    if (context?.bookTitle || context?.missionTitle || context?.currentConcept) {
      prompt = `[Context: Reading "${context.bookTitle || "A Book"}", Mission: "${context.missionTitle || "General"}", Concept: "${context.currentConcept || "General"}"]\n\nStudent question: ${userMessage}`;
    }
    return prompt;
  };

  const aiResult = await callGeminiWithFallback(contentsBuilder);
  if (aiResult) {
    return aiResult;
  }

  // Fallback intelligent answer tailored to the question and context
  return getLocalPipConversationalAnswer(userMessage, context);
}

/**
 * Smart contextual fallback analogy for quiz questions when API is temporarily unreachable.
 */
function getLocalPipAnalogy(data: {
  bookTitle: string;
  missionTitle: string;
  conceptTag: string;
  standardExplanation: string;
  correctAnswer?: string;
}): string {
  const tag = (data.conceptTag || "").toLowerCase();
  const title = (data.bookTitle || "").toLowerCase();
  const expl = data.standardExplanation;

  if (tag.includes("habit") || tag.includes("cue") || tag.includes("routine") || title.includes("habit")) {
    return `### 💡 Pip's Habit Analogy\n\nThink of habit formation like **water carving a canyon into stone**. The first time you do something, the water barely leaves a trace. But with every repetition, the groove deepens until water naturally flows there without any resistance!\n\n* **Why it matters:** ${expl}\n* **Action Tip:** Pair this habit with an existing cue you already do every single day (like brushing your teeth or pouring coffee) so your brain can ride existing momentum.`;
  }

  if (tag.includes("focus") || tag.includes("deep") || tag.includes("distraction")) {
    return `### 💡 Pip's Focus Analogy\n\nImagine your attention like a **high-powered magnifying glass on a sunny day**. When moved around frantically every 30 seconds, it barely warms a leaf. But held completely steady in one spot for 25 uninterrupted minutes, it sparks real fire!\n\n* **The Core Insight:** ${expl}\n* **Action Tip:** Close all browser tabs except the mission you are solving, put your phone in another room, and give your mind full permission to sink into deep work.`;
  }

  if (tag.includes("stoic") || tag.includes("control") || title.includes("meditation") || tag.includes("perception")) {
    return `### 💡 Pip's Stoic Analogy\n\nMarcus Aurelius reminded us to think of life like a **captain steering a ship through sudden storm winds**. You cannot command the wind to blow gently, but you have 100% mastery over your rudder and sails.\n\n* **The Core Insight:** ${expl}\n* **Action Tip:** When frustration flares up, ask yourself: *"Is this within my control, or outside my control?"* Focus every ounce of energy solely on what you control.`;
  }

  if (tag.includes("strategy") || tag.includes("war") || title.includes("art of war") || tag.includes("preparation")) {
    return `### 💡 Pip's Strategy Analogy\n\nSun Tzu teaches that victory is like **water seeking the lowest ground**. Water never attacks solid rock head-on; it effortlessly flows around obstacles, finding the path of least resistance where victory is already assured before the conflict begins.\n\n* **The Core Insight:** ${expl}\n* **Action Tip:** Prepare thoroughly and position yourself strategically so executing your goals feels natural, not like an uphill battle.`;
  }

  if (tag.includes("mind") || tag.includes("thought") || title.includes("thinketh")) {
    return `### 💡 Pip's Mindset Analogy\n\nJames Allen compares the human mind to a **fertile garden**. Whether you deliberately plant fragrant flowers or leave it alone, something *will* grow. If you do not plant seeds of purpose and discipline, weeds will happily take over.\n\n* **The Core Insight:** ${expl}\n* **Action Tip:** Guard what you feed your mind each morning. Cultivate thoughts that nourish resilience and purposeful action.`;
  }

  if (tag.includes("compound") || tag.includes("money") || tag.includes("invest")) {
    return `### 💡 Pip's Compounding Analogy\n\nCompounding is like **rolling a snowball down a long mountain slope**. At first, 10 rotations barely add a handful of snow. But after hundreds of rotations, every single turn doubles its mass into an unstoppable avalanche!\n\n* **The Core Insight:** ${expl}\n* **Action Tip:** Consistency beats intensity. Small daily gains of 1% compound into 37x growth over a single year.`;
  }

  return `### 💡 Pip's Insight\n\nThink of this concept like **tuning an acoustic instrument**. At first, the notes sound slightly off, but once you dial in the tension and understand how the strings resonate together, everything plays in harmony!\n\n* **The Key Takeaway:** ${expl}\n* **Action Tip:** Review this concept once again at the end of your session to lock it into your long-term memory.`;
}

/**
 * Intelligent domain-grounded conversational responses when API is temporarily offline.
 */
function getLocalPipConversationalAnswer(
  question: string,
  context?: { bookTitle?: string; missionTitle?: string; currentConcept?: string }
): string {
  const rawQ = question.toLowerCase();
  const q = rawQ.replace(/[-_]/g, " ");
  const book = (context?.bookTitle || "").toLowerCase();

  // 1. Two-minute rule or procrastination
  if (q.includes("2 minute") || q.includes("two minute") || q.includes("procrastinat") || q.includes("start a habit") || q.includes("lazy")) {
    return `### ⏱️ The 2-Minute Rule (Pip's Breakdown)

The **2-Minute Rule** from James Clear's *Atomic Habits* is designed to overcome the friction of starting:
> *"When you start a new habit, it should take less than two minutes to do."*

#### 🎯 The Analogy: The Rocket on the Launchpad
A space rocket burns over **70% of its total fuel** just breaking the gravitational pull of the first few feet off the launchpad. Once airborne, cruising through orbit requires almost no energy at all. Starting is always the heaviest part!

#### 🚀 How to Apply It:
* Instead of *"I need to read for 1 hour"*, commit to: **"Read 1 single page."**
* Instead of *"I must do a 45-minute workout"*, commit to: **"Put on my running shoes."**
* Instead of *"Write a complete chapter"*, commit to: **"Write one sentence."**

Once you cross the 2-minute starting line, the friction vanishes and momentum takes over!`;
  }

  // 2. Habit stacking or implementation intentions
  if (q.includes("stack") || q.includes("routine") || q.includes("trigger") || q.includes("anchor") || q.includes("implementation intention")) {
    return `### ⚡ Habit Stacking (Pip's Breakdown)

**Habit Stacking** is a special form of implementation intention: rather than pairing your new habit with a particular time and location, you pair it with an **already established daily habit**.

#### 🔌 Pip's Analogy: The Power Strip
Think of your daily habits like an **electrical power strip** that is already plugged into the wall and active. Trying to start a new habit from scratch with pure willpower is like trying to invent a battery from scratch. Habit stacking is simply plugging your new appliance into an available slot on that active power strip!

#### 🎯 Formula:
> *"After [CURRENT HABIT], I will [NEW HABIT]."*
* **Example:** *"After I pour my morning coffee, I will complete 1 Chaptr mission."*
* **Example:** *"After I close my laptop for the day, I will immediately change into my gym clothes."*`;
  }

  // 2. Habit loop (cue, craving, response, reward)
  if (q.includes("loop") || q.includes("cue") || q.includes("craving") || q.includes("reward") || (q.includes("habit") && q.includes("work"))) {
    return `### 🔄 The 4-Stage Habit Loop

Every single habit in human behavior follows a circular loop of four neurological stages:

1. **The Cue (The Trigger):** Noticing a stimulus that predicts a reward (e.g., your phone vibrating, or entering your kitchen).
2. **The Craving (The Motivation):** The desire to change your internal state (e.g., wanting to relieve boredom or fatigue).
3. **The Response (The Action):** The actual habit you perform (e.g., unlocking the phone, or brewing an espresso).
4. **The Reward (The Payoff):** The brain dopamine hit that satisfies the craving and reinforces the memory.

#### 💡 Pip's Analogy: The Grooved Record
Think of a vinyl record playing music. Every time you run through this 4-step loop, the needle cuts the groove slightly deeper. To break a bad habit, make the **cue invisible** or the **response difficult**. To build a great habit, make the **cue obvious** and the **reward immediate**!`;
  }

  // 3. Active recall vs passive reading
  if (q.includes("active recall") || q.includes("study") || q.includes("learn") || q.includes("memory") || q.includes("spaced repetition")) {
    return `### 🧠 Active Recall vs. Passive Reading

Active recall is testing your brain to retrieve knowledge from memory, rather than passively rereading highlighted text.

#### 🏔️ Pip's Analogy: The Mountain Trail
* **Passive Rereading:** Sitting in a cable car looking down at a mountain trail. It feels effortless and familiar, but you haven't actually built any leg strength or muscle memory.
* **Active Recall:** Actually hiking the trail with your own boots. Every time your brain struggles to pull up an answer, it physically reinforces the neural synaptic pathway, turning a faint dirt path into a permanent highway!

#### 🎯 Action Steps:
1. After reading a chapter or mission, close your eyes and write down the 3 core points from memory without looking.
2. Quiz yourself with flashcards and Chaptr missions instead of rereading notes.`;
  }

  // 4. Stoicism / Marcus Aurelius / Control
  if (q.includes("stoic") || q.includes("marcus") || q.includes("control") || book.includes("meditation")) {
    return `### 🏛️ The Dichotomy of Control (Marcus Aurelius)

In *Meditations*, Emperor Marcus Aurelius reminds us that peace of mind comes from separating what is up to us from what is not:

* **Outside Your Control:** Other people's opinions, economic tides, traffic, the weather, and external outcomes.
* **Inside Your Control:** Your judgments, your effort, your kindness, and how you respond to adversity.

#### 🏹 Pip's Analogy: The Master Archer
An archer can choose the finest bow, train his muscles, calculate the wind, and release the arrow with flawless technique. That is **100% under his control**. But the exact second the arrow leaves the bowstring, a sudden gust of wind or a moving target is outside his control. 

True serenity comes from placing your self-worth in **how well you shot the arrow**, not where the wind blew it!`;
  }

  // 5. Sun Tzu / The Art of War / Strategy
  if (q.includes("sun tzu") || q.includes("war") || q.includes("strategy") || book.includes("art of war")) {
    return `### ⚔️ Sun Tzu's Philosophy of Effortless Victory

Sun Tzu's greatest insight in *The Art of War* is that supreme excellence consists in **breaking the enemy's resistance without fighting**:

> *"Every battle is won before it is ever fought."*

#### 🌊 Pip's Analogy: Water & Terrain
Water flows away from high ground and rushes toward low ground. A true strategist does not attack high, fortified stone walls with brute force. Instead, they position themselves so that circumstance and preparation do the heavy lifting for them.

#### 💡 Real-Life Application:
Before tackling a difficult project or exam, spend 80% of your energy on setup: eliminate distractions, organize your resources, and clarify your daily targets. When the environment is calibrated, victory is almost automatic!`;
  }

  // 6. James Allen / Mindset / As a Man Thinketh
  if (q.includes("mind") || q.includes("thinketh") || q.includes("james allen") || book.includes("thinketh")) {
    return `### 🌱 Your Mind as a Sacred Garden (James Allen)

In *As a Man Thinketh*, James Allen reveals that our character, circumstances, and destiny are the direct harvest of our dominant thoughts.

#### 🌻 Pip's Analogy: The Garden Bed
A plot of soil does not care whether you plant magnificent sunflowers or poisonous nightshade; it will generously multiply whatever seed you drop into it. 
* If you fail to deliberately plant seeds of discipline, gratitude, and purpose, airborne weed seeds will inevitably blow in and overrun your garden.

#### 🎯 Your Daily Habit:
Notice the self-talk running through your head. Whenever you catch a disempowering thought, gently pull it out like a dandelion and replant a thought rooted in courage and growth!`;
  }

  // 7. Florence Scovel Shinn / The Game of Life
  if (q.includes("game of life") || q.includes("florence") || q.includes("shinn") || q.includes("boomerang") || q.includes("non-resistance") || book.includes("game of life")) {
    return `### 🎲 The Game of Life (Pip's Breakdown)

In *The Game of Life*, Florence Scovel Shinn reveals that human life is not a painful struggle or battlefield. Instead, it is a **strategic game with defined rules of play**:

#### 🪃 Pip's Analogy: The Cosmic Boomerang
Imagine you are standing on a glass platform. Every thought, spoken word, and deed you cast out is an aerodynamic **boomerang**. 
* If you throw fear, resentment, or deceit, it loops around through the air and strikes you from behind.
* If you throw genuine goodwill, courage, and generosity, it circles back loaded with unexpected rewards and assistance!

#### 🎮 Pro Player Rule:
Practice **Non-Resistance**. When an adversary or setback arrives, don't clash with brute friction. Step aside, stay centered, and bless the situation. When you refuse to feed the obstacle your panic, it dissolves!`;
  }

  // 8. James P. Carse / Finite and Infinite Games
  if (q.includes("finite") || q.includes("infinite game") || q.includes("carse") || book.includes("finite and infinite")) {
    return `### ♾️ Finite vs. Infinite Games (Pip's Breakdown)

James P. Carse discovered the master distinction of human behavior:
> *"A finite game is played for the purpose of winning; an infinite game for the purpose of continuing the play."*

#### 🏆 Pip's Analogy: The Tournament vs. The Playground Sandbox
* **The Finite Game (Tournament):** Has rigid borders, time limits, and a final whistle. You play to collect a trophy, defeat a rival, and declare: *"I won and it's over."*
* **The Infinite Game (Sandbox):** Has no final buzzer. You play for the joy of creating, learning, and keeping the game going with friends. If the rules become stale or people get hurt, you adapt the rules so everyone can stay in the sandbox!

#### 🚀 How to Apply It:
Don't turn your career, friendships, or learning into finite matches with winners and losers. Play to sustain curiosity, cultivate strength over mere power, and keep the play alive forever!`;
  }

  // 9. Miyamoto Musashi / The Book of Five Rings
  if (q.includes("musashi") || q.includes("five rings") || q.includes("sword") || q.includes("void") || q.includes("water scroll") || book.includes("five rings")) {
    return `### ⚔️ Miyamoto Musashi: Strategy of the Undefeated Master

In *The Book of Five Rings*, undefeated swordsman Miyamoto Musashi presents strategy as the ultimate psychological and tactical game:

#### 🌊 Pip's Analogy: The Stream & The Boulder
* A rigid, brittle branch tries to fight the river current and snaps in two.
* Water encounters a massive stone boulder, effortlessly shapes itself around the obstacle, and keeps surging forward toward the ocean!
Musashi calls this the **"Stance of No-Stance"**: never fall in love with a single fixed technique. Adapt instantly to whatever move your adversary makes.

#### 🎯 Tactical Rule:
Master **Tempo and Rhythm**. Dissect the rhythm of your opponent or work, disrupt their expected cadence, and cross critical turning points (*Crossing at a Ford*) with resolute, unhesitating commitment!`;
  }

  // 10. Wallace D. Wattles / The Science of Getting Rich
  if (q.includes("wattles") || q.includes("getting rich") || q.includes("certain way") || q.includes("creative plane") || q.includes("impression of increase") || book.includes("getting rich")) {
    return `### 💎 Wallace D. Wattles: The Science of Getting Rich (Pip's Breakdown)

In *The Science of Getting Rich*, Wallace D. Wattles demystifies wealth creation as an exact, creative discipline:

#### 🍞 Pip's Analogy: Baking a New Pie vs. Fighting for Crumbs
* **The Competitive Plane (Fighting for Crumbs):** Believing wealth is a fixed, dwindling pie where you must elbow rivals and hoard what exists. This breeds anxiety, scarcity, and undercutting.
* **The Creative Plane (Baking a New Pie):** Knowing that formless creative substance is boundless! You don't fight over existing pies; you bake fresh value that expands total abundance for everyone!

#### 🚀 The Golden Rule:
* **The Impression of Increase:** Give every single customer, coworker, and partner **more in use value than you collect in cash value**. When people walk away from you feeling elevated, you become magnetically indispensable!
* **Act in the Present:** Don't daydream about a future ideal job while neglecting today. Overflow your current position with total excellence right now!`;
  }

  // 11. Focused Mind / Chaptr Originals
  if (q.includes("focused mind") || q.includes("attention residue") || q.includes("time blocking") || q.includes("friction") || q.includes("shutdown protocol") || book.includes("focused mind")) {
    return `### 🎯 Focused Mind: Deep Work & Cognitive Bandwidth (Pip's Breakdown)

In *Focused Mind*, Chaptr reveals why sustained focus is the ultimate economic superpower of our era:

#### 🧠 Pip's Analogy: The Sticky Note Traffic Jam (Attention Residue)
Imagine your brain's working memory as a clean whiteboard. Every time you switch away from a deep task to "just quickly check" an email or group chat, you slap a sticky note on that whiteboard. 
Even after you return, those sticky notes take up space, clutter your view, and slow your thinking! It takes 15–20 minutes of solid single-tasking just to peel those notes off and regain crystal clarity!

#### 🛡️ Pip's 3 Armor Rules:
1. **Design Friction:** Don't rely on willpower. Put your phone in another room or drawer so picking it up requires conscious effort!
2. **Time Block with Ultradian Cadence:** Focus intensely for 60–90 minutes, then take a real non-screen rest (walk, water, stretch).
3. **Daily Shutdown Protocol:** Park all open tasks before closing your laptop to prevent the Zeigarnik effect from stealing your evening peace!`;
  }

  // 12. P.T. Barnum / The Art of Money Getting
  if (q.includes("barnum") || q.includes("money getting") || q.includes("vocation") || q.includes("false pride") || q.includes("winking in the dark") || book.includes("money getting")) {
    return `### 🎪 P.T. Barnum: The Art of Money Getting (Pip's Breakdown)

America's legendary showman turns financial prudence into an exact, common-sense art:

#### 💡 Pip's Analogy: Winking in the Dark & The Leaky Ship
* **Winking in the Dark:** Having a stellar product but refusing to advertise is like winking at someone in pitch blackness. *You* know what you're doing, but nobody else does! Boldly and creatively show your value!
* **The Leaky Ship:** Wealth isn't lost in grand dramatic disasters; it sinks quietly through tiny unexamined micro-leaks (frivolous subscriptions, daily vanity splurges, and false pride).

#### 🎩 Barnum's Golden Rules:
1. **Right Vocation:** Swim with your natural current. Don't force yourself into an unnatural trade where you will forever be miserable and mediocre.
2. **Integrity is Your Real Capital:** Never resort to tricks. A customer must always receive full, genuine value so they become a lifelong champion for your work!
3. **Avoid Co-signing Notes:** Guard your financial independence fiercely; never stake your hard-won sovereignty on other people's gambles!`;
  }

  // 13. Contextual book or general response
  const bookName = context?.bookTitle || "your learning journey";
  const missionName = context?.missionTitle || "this mission";

  return `### 🌟 Pip's Guide to "${bookName}"

Great question, scholar! When diving into **${missionName}**, the golden rule is to connect the theory directly to an everyday habit.

#### 💡 The Core Mechanism:
Whatever skill or concept you are learning, your brain treats it like building a bridge across a river:
1. **First Attempt:** You throw a light rope across (temporary recall).
2. **Spaced Practice:** You pull over strong steel cables (neural myelination).
3. **Daily Mastery:** You pour reinforced concrete (permanent intuition).

#### 🎯 Quick Tip:
Try teaching what you just learned to an imaginary 10-year-old in simple, jargon-free words (the **Feynman Technique**). If you can explain it simply, you truly own it!

*What specific part of this lesson would you like to explore deeper?*`;
}
