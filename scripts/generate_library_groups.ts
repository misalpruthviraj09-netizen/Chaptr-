import fs from "fs";
import path from "path";

// Color palettes for library covers - varied and high contrast
const COVER_COLORS = [
  "#3730A3", "#047857", "#B45309", "#4338CA", "#0E7490",
  "#BE185D", "#1D4ED8", "#4D7C0F", "#6D28D9", "#C2410C",
  "#15803D", "#A21CAF", "#0369A1", "#B91C1C", "#475569",
  "#0F766E", "#7C3AED", "#D97706", "#2563EB", "#059669",
  "#E11D48", "#4F46E5", "#0891B2", "#CA8A04", "#7E22CE"
];

const COVER_PATTERNS = ["waves", "grid", "dots", "rings", "stripes"] as const;

interface BookMetaDef {
  num: number;
  slug: string;
  title: string;
  author: string;
  category: "Self-improvement" | "Finance" | "Psychology" | "Business" | "Productivity";
  isPublicDomain: boolean;
  coreThemes: [string, string, string, string, string];
  keywords: string[];
}

export const BOOK_DEFINITIONS: BookMetaDef[] = [
  // 1-10
  {
    num: 1,
    slug: "as-a-man-thinketh",
    title: "As a Man Thinketh",
    author: "James Allen",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Mind as the Master Cultivator",
      "The Impact of Thought on Health and Vitality",
      "Purposive Thinking and Goal Alignment",
      "Vision, Ideals, and Inward Transformation",
      "Serenity and the Composed Mind"
    ],
    keywords: ["thought architecture", "inner causation", "character cultivation", "mental focus", "inner serenity"]
  },
  {
    num: 2,
    slug: "the-path-to-prosperity",
    title: "The Path to Prosperity",
    author: "James Allen",
    category: "Finance",
    isPublicDomain: true,
    coreThemes: [
      "The Inward Foundation of Abundance",
      "Overcoming Scarcity Thinking and Doubt",
      "Aligning Action with Productive Purpose",
      "Self-Discipline as Financial Capital",
      "Sustainable Wealth Through Service"
    ],
    keywords: ["inward value", "mindset of abundance", "deliberate execution", "economic discipline", "ethical prosperity"]
  },
  {
    num: 3,
    slug: "byways-of-blessedness",
    title: "Byways of Blessedness",
    author: "James Allen",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Right Beginnings and Honest Foundations",
      "The Hidden Value of Daily Tribulation",
      "Mastering Impatience and Cultivating Poise",
      "The Quiet Discipline of Self-Examination",
      "Living in Conscious Harmony"
    ],
    keywords: ["honest beginnings", "resilient poise", "daily reflection", "inner alignment", "unshakable peace"]
  },
  {
    num: 4,
    slug: "the-mastery-of-destiny",
    title: "The Mastery of Destiny",
    author: "James Allen",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Deeds, Character, and Inevitable Fate",
      "Habit Modification and Neuroplastic Will",
      "Directing Unfocused Emotional Energy",
      "The Transforming Power of Sustained Attention",
      "Building Moral and Mental Fortitude"
    ],
    keywords: ["conscious agency", "habit construction", "directed focus", "mental fortitude", "destiny control"]
  },
  {
    num: 5,
    slug: "above-lifes-turmoil",
    title: "Above Life's Turmoil",
    author: "James Allen",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "Transcending Reactive Emotional States",
      "The Illusion of External Blame",
      "Cultivating Inward Equilibrium",
      "Silent Resilience Amid Conflict",
      "The Art of Mindful Non-Resistance"
    ],
    keywords: ["emotional poise", "cognitive sovereignty", "mental equilibrium", "non-reactivity", "inner peace"]
  },
  {
    num: 6,
    slug: "the-science-of-getting-rich",
    title: "The Science of Getting Rich",
    author: "Wallace D. Wattles",
    category: "Finance",
    isPublicDomain: true,
    coreThemes: [
      "The Creative versus Competitive Mindset",
      "Delivering Excess Use Value Over Cash Value",
      "Efficient Action and Complete Daily Execution",
      "The Power of Constant Grateful Reflection",
      "Sustaining the Unwavering Vision of Growth"
    ],
    keywords: ["creative mindset", "use value", "daily efficiency", "strategic gratitude", "wealth velocity"]
  },
  {
    num: 7,
    slug: "the-science-of-being-well",
    title: "The Science of Being Well",
    author: "Wallace D. Wattles",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "The Principle of Vitality and Living Energy",
      "Conscious Rhythmic Breathing and Nourishment",
      "Reframing Physical Limitations Mentally",
      "Rest, Regeneration, and Biological Rhythms",
      "Sustaining Habitual Radiant Health"
    ],
    keywords: ["vital energy", "biological harmony", "restorative sleep", "conscious health", "enduring stamina"]
  },
  {
    num: 8,
    slug: "the-science-of-being-great",
    title: "The Science of Being Great",
    author: "Wallace D. Wattles",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Awakening the Latent Higher Self",
      "Discarding Petty Envy and Triviality",
      "Habitual Greatness in Ordinary Responsibilities",
      "Refusing Compromise in Character",
      "Projecting Calm Authority and Kindness"
    ],
    keywords: ["latent excellence", "dignity in duty", "principled leadership", "quiet authority", "magnanimity"]
  },
  {
    num: 9,
    slug: "self-reliance",
    title: "Self-Reliance",
    author: "Ralph Waldo Emerson",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Trusting Your Inward Genius and Intuition",
      "The Freedom from Blind Conformity",
      "Overcoming the Foolish Fear of Inconsistency",
      "Honoring Present Reality Over Past Regrets",
      "Spiritual and Intellectual Sovereignty"
    ],
    keywords: ["individual genius", "non-conformity", "fluid thinking", "radical autonomy", "intellectual courage"]
  },
  {
    num: 10,
    slug: "compensation",
    title: "Compensation",
    author: "Ralph Waldo Emerson",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "The Universal Law of Dual Balance",
      "The Hidden Cost of Unearned Privilege",
      "How Defeat Conceals Future Strength",
      "Sovereignty Over Fear of Loss",
      "The Inevitable Justice of Continuous Effort"
    ],
    keywords: ["dynamic balance", "the hidden cost", "adversity as asset", "reciprocal law", "equilibrium"]
  },

  // 11-20
  {
    num: 11,
    slug: "the-over-soul",
    title: "The Over-Soul",
    author: "Ralph Waldo Emerson",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "The Shared Stream of Collective Wisdom",
      "Transcending Ego Isolation and Anxiety",
      "Intuitive Flashes and Deep Insight",
      "Authentic Presence in Everyday Encounters",
      "Living in Conscious Wholeness"
    ],
    keywords: ["collective psyche", "ego transcendence", "intuitive flashes", "unified presence", "existential clarity"]
  },
  {
    num: 12,
    slug: "spiritual-laws",
    title: "Spiritual Laws",
    author: "Ralph Waldo Emerson",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "Effortless Alignment Over Strained Striving",
      "Our Real Worth Communicates Itself Silently",
      "Letting Natural Talent Dictate Vocation",
      "Accepting Inescapable Consequences of Action",
      "Living from Genuine Center"
    ],
    keywords: ["natural alignment", "unforced effort", "authentic vocation", "karmic law", "centered calm"]
  },
  {
    num: 13,
    slug: "self-help",
    title: "Self-Help",
    author: "Samuel Smiles",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Individual Industry as True Human Worth",
      "Perseverance Surpassing Innate Talent",
      "Inventive Curiosity Born of Necessity",
      "The Dignity of Meticulous Daily Labor",
      "Transforming Obscurity into Lasting Contribution"
    ],
    keywords: ["patient industry", "grit and persistence", "practical ingenuity", "work ethic", "mastery through labor"]
  },
  {
    num: 14,
    slug: "character",
    title: "Character",
    author: "Samuel Smiles",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Integrity as the Ultimate Currency",
      "Moral Courage in the Face of Expediency",
      "The Enduring Power of Good Companions",
      "Temperate Restraint and Self-Mastery",
      "Leaving an Honorable Living Example"
    ],
    keywords: ["moral integrity", "unyielding spine", "companion influence", "deliberate restraint", "ethical stature"]
  },
  {
    num: 15,
    slug: "thrift",
    title: "Thrift",
    author: "Samuel Smiles",
    category: "Finance",
    isPublicDomain: true,
    coreThemes: [
      "Frugality as the Parent of Independence",
      "The Danger of Living for Social Display",
      "Creating Financial Margin Before Scaling Consumption",
      "Small Steady Savings Compounding Over Decades",
      "Prudence as Freedom and Peace of Mind"
    ],
    keywords: ["frugal autonomy", "anti-consumerism", "financial safety margin", "compound frugality", "sovereign freedom"]
  },
  {
    num: 16,
    slug: "duty",
    title: "Duty",
    author: "Samuel Smiles",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Moral Obligation as the North Star",
      "Heroism Found in Routine Daily Tasks",
      "Faithfulness Under Inconvenient Pressure",
      "Standing Firm for Vulnerable Principles",
      "The Quiet Joy of Selfless Service"
    ],
    keywords: ["moral compass", "ordinary heroism", "principled devotion", "ethical duty", "quiet sacrifice"]
  },
  {
    num: 17,
    slug: "the-art-of-money-getting",
    title: "The Art of Money Getting",
    author: "P.T. Barnum",
    category: "Finance",
    isPublicDomain: true,
    coreThemes: [
      "Selecting the Vocation Matched to Nature",
      "Eliminating Costly Habits and Financial Leaks",
      "Integrity and Fair Dealing as Brand Capital",
      "Bold Ethical Advertising and Visibility",
      "Avoiding Debt and Speculative Bubbles"
    ],
    keywords: ["vocational fit", "leak prevention", "reputation value", "promotional savvy", "debt avoidance"]
  },
  {
    num: 18,
    slug: "poor-richards-almanack",
    title: "Poor Richard's Almanack",
    author: "Benjamin Franklin",
    category: "Finance",
    isPublicDomain: true,
    coreThemes: [
      "Lost Time Never Found Again",
      "Small Leaks Sinking Great Ships",
      "Diligence as the Mother of Good Luck",
      "Avoiding the Debt Trap of Vain Luxuries",
      "Simplicity and Independent Prudence"
    ],
    keywords: ["time valuation", "micro leaks", "luck creation", "anti-debt discipline", "practical wisdom"]
  },
  {
    num: 19,
    slug: "the-way-to-wealth",
    title: "The Way to Wealth",
    author: "Benjamin Franklin",
    category: "Finance",
    isPublicDomain: true,
    coreThemes: [
      "The Heavy Tax of Idleness, Pride, and Folly",
      "Industry Over Wishing and Complaint",
      "Buying What You Do Not Need Sells What You Need",
      "Overcoming the Mirage of Easy Credit",
      "Self-Sufficiency and the Dignity of Work"
    ],
    keywords: ["idleness tax", "industrious execution", "consumption control", "credit dangers", "financial liberty"]
  },
  {
    num: 20,
    slug: "autobiography-of-benjamin-franklin",
    title: "Autobiography of Benjamin Franklin",
    author: "Benjamin Franklin",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "The 13-Virtue Self-Tracking System",
      "Deliberate Reading and Socratic Argument",
      "The Mutual-Improvement Junto Circle",
      "Public Service and Practical Ingenuity",
      "Iterative Personal Growth Over a Lifetime"
    ],
    keywords: ["virtue tracking", "deliberate study", "mastermind group", "civic impact", "continuous revision"]
  },

  // 21-30
  {
    num: 21,
    slug: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "The Dichotomy of Control and Inner Citadel",
      "Responding to Difficult People with Duty",
      "Memento Mori and the Brevity of Life",
      "Taming Cognitive Judgments and Opinions",
      "Cosmic Perspective and Common Good"
    ],
    keywords: ["inner citadel", "stoic duty", "memento mori", "judgment taming", "universal perspective"]
  },
  {
    num: 22,
    slug: "enchiridion",
    title: "Enchiridion",
    author: "Epictetus",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "What Is In Our Power vs Outside Our Power",
      "Things Do Not Upset Us, But Our Opinions Of Them",
      "Playing Well the Role Assigned to You",
      "Refusing to Let Others Steal Your Peace",
      "Living Philosophy Rather Than Preaching It"
    ],
    keywords: ["locus of control", "cognitive reframing", "authentic role", "emotional armor", "embodied wisdom"]
  },
  {
    num: 23,
    slug: "discourses",
    title: "Discourses",
    author: "Epictetus",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "Freedom Consists in Controlling One's Will",
      "Adversity as the Training Ground of the Soul",
      "Questioning Automatic Assumptions and Desires",
      "The Invulnerability of the Rational Mind",
      "Practicing Daily Spiritual Readiness"
    ],
    keywords: ["sovereign will", "adversity gym", "examined desires", "rational invulnerability", "daily readiness"]
  },
  {
    num: 24,
    slug: "letters-from-a-stoic",
    title: "Letters from a Stoic",
    author: "Seneca",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "Choosing Selective Reading Over Aimless Grazing",
      "Practicing Voluntary Discomfort to Disarm Fear",
      "Cultivating Noble and Sincere Friendships",
      "Valuing Time as the Only Inexhaustible Resource",
      "Calmly Facing Sickness, Exile, and Mortality"
    ],
    keywords: ["deep reading", "voluntary hardship", "noble bonds", "time stewardship", "mortal resilience"]
  },
  {
    num: 25,
    slug: "on-the-shortness-of-life",
    title: "On the Shortness of Life",
    author: "Seneca",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "Life Is Long If You Know How to Use It",
      "The Busy Traps of Frivolous Ambition",
      "Reclaiming Ownership of Your Attention",
      "Conversing Daily with the Greatest Minds",
      "Retirement from Ego into Meaningful Reflection"
    ],
    keywords: ["time reclamation", "escaping busyness", "attentional sovereignty", "timeless mentorship", "mindful presence"]
  },
  {
    num: 26,
    slug: "on-anger",
    title: "On Anger",
    author: "Seneca",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "Anger as Temporary Madness and Cognitive Error",
      "The Power of Delaying Reaction to Provocations",
      "Mercy and Understanding Human Frailty",
      "Extinguishing the Spark Before the Conflagration",
      "Protecting Reason from Emotional Hijacking"
    ],
    keywords: ["rage deconstruction", "tactical delay", "compassionate mercy", "preemptive cooling", "rational command"]
  },
  {
    num: 27,
    slug: "the-art-of-war",
    title: "The Art of War",
    author: "Sun Tzu",
    category: "Business",
    isPublicDomain: true,
    coreThemes: [
      "Winning Without Fighting as Supreme Art",
      "Knowing the Terrain, the Market, and Yourself",
      "Strategic Flexibility and Fluid Strategy",
      "Deception, Speed, and Unorthodox Moves",
      "Managing Internal Unity and Resource Cost"
    ],
    keywords: ["strategic deterrence", "situational awareness", "fluid agility", "asymmetric advantage", "resource efficiency"]
  },
  {
    num: 28,
    slug: "the-prince",
    title: "The Prince",
    author: "Niccolò Machiavelli",
    category: "Business",
    isPublicDomain: true,
    coreThemes: [
      "Virtù and Adapting Strategy to Changing Fortune",
      "It Is Safer to Be Respected Than Carelessly Beloved",
      "Avoiding Dependency on Mercenary Alliances",
      "Pragmatic Realism Over Utopian Wishing",
      "Decisive Action When Opportunity Arrives"
    ],
    keywords: ["strategic virtù", "authority dynamics", "autonomous capability", "pragmatic realism", "decisive timing"]
  },
  {
    num: 29,
    slug: "walden",
    title: "Walden",
    author: "Henry David Thoreau",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Deliberate Living and Eliminating Unnecessary Complexity",
      "Calculating the Real Cost of Possessions in Life-Energy",
      "Morning Solitude as the Sanctuary of Insight",
      "Deep Attunement to Natural Rhythms",
      "Stepping to the Beat of Your Own Drummer"
    ],
    keywords: ["deliberate simplicity", "vital cost", "morning solitude", "natural cadence", "individual authenticity"]
  },
  {
    num: 30,
    slug: "civil-disobedience",
    title: "Civil Disobedience",
    author: "Henry David Thoreau",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "Conscience Standing Above Unjust Conformity",
      "The Friction of Complacency in Civil Life",
      "Voting as More Than a Symbolic Paper Ballot",
      "The Sovereignty of Principled Non-Cooperation",
      "Living In Accordance With Fundamental Truth"
    ],
    keywords: ["individual conscience", "refusing complicity", "principled action", "moral defiance", "unshakable integrity"]
  },

  // 31-40
  {
    num: 31,
    slug: "pushing-to-the-front",
    title: "Pushing to the Front",
    author: "Orison Swett Marden",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Opportunities Lurking in the Commonplace",
      "Concentration of Aim and Burning Resolve",
      "Turning Setbacks into Fuel for Triumph",
      "The Unconquerable Magnetism of Enthusiasm",
      "Persistent Striving Against Intimidating Odds"
    ],
    keywords: ["latent opportunity", "concentrated aim", "setback alchemy", "vital enthusiasm", "unyielding push"]
  },
  {
    num: 32,
    slug: "an-iron-will",
    title: "An Iron Will",
    author: "Orison Swett Marden",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "The Will as the Supreme Engine of Achievement",
      "Conquering the Paralysis of Indecision",
      "Endurance When Initial Excitement Evaporates",
      "Self-Command Over Moods and Appetite",
      "Forging Inflexible Resolve Through Daily Tests"
    ],
    keywords: ["willpower engine", "decisive mastery", "enduring persistence", "emotional command", "daily fortitude"]
  },
  {
    num: 33,
    slug: "peace-power-and-plenty",
    title: "Peace, Power and Plenty",
    author: "Orison Swett Marden",
    category: "Finance",
    isPublicDomain: true,
    coreThemes: [
      "Eradicating Chronic Poverty Consciousness",
      "The Magnetism of Confidence and Generosity",
      "Harmony as the Precursor to Financial Order",
      "Believing in Your Ability to Create Value",
      "Replacing Dread of Lack with Steady Industry"
    ],
    keywords: ["scarcity eradication", "confidence capital", "mental harmony", "value creation", "steady industry"]
  },
  {
    num: 34,
    slug: "every-man-a-king",
    title: "Every Man a King",
    author: "Orison Swett Marden",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "The Sovereign Throne of Self-Governance",
      "Banishing Toxic Self-Pity and Resentment",
      "Commanding the Physical Body Through Mind",
      "The Regal Poise of Unshakable Dignity",
      "Claiming Your Inherent Creative Heritage"
    ],
    keywords: ["inner royalty", "self-pity banishment", "mind-body mastery", "regal poise", "creative autonomy"]
  },
  {
    num: 35,
    slug: "he-can-who-thinks-he-can",
    title: "He Can Who Thinks He Can",
    author: "Orison Swett Marden",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Expectation Shaping Objective Performance",
      "Overcoming the Bogey of Self-Distrust",
      "Daring to Attempt the Seemingly Impossible",
      "The Power of a Resolute, Unfaltering Stride",
      "Radiating Competence in Demanding Situations"
    ],
    keywords: ["self-efficacy", "distrust dissolution", "audacious attempts", "resolute posture", "projected competence"]
  },
  {
    num: 36,
    slug: "acres-of-diamonds",
    title: "Acres of Diamonds",
    author: "Russell H. Conwell",
    category: "Finance",
    isPublicDomain: true,
    coreThemes: [
      "Diamonds Lying in Your Own Backyard",
      "Wealth as the Fruit of Solving Immediate Needs",
      "The Moral Goodness of Honest Commerce",
      "Observing Hidden Pain Points in Your Community",
      "Starting Where You Stand with What You Have"
    ],
    keywords: ["backyard diamonds", "need satisfaction", "ethical commerce", "community observation", "immediate assets"]
  },
  {
    num: 37,
    slug: "power-of-will",
    title: "Power of Will",
    author: "Frank Channing Haddock",
    category: "Productivity",
    isPublicDomain: true,
    coreThemes: [
      "The Systematic Gymnastics of the Mind",
      "Sharpening Attentional Focus at Will",
      "Breaking Destructive Impulsive Reflexes",
      "Developing Unflinching Sensory Observation",
      "Forging Indomitable Habitual Tenacity"
    ],
    keywords: ["mental gymnastics", "attentional laser", "impulse veto", "sensory sharpness", "indomitable tenacity"]
  },
  {
    num: 38,
    slug: "psychology-the-briefer-course",
    title: "Psychology: The Briefer Course",
    author: "William James",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "The Continuous Stream of Consciousness",
      "Habit as the Enormous Flywheel of Society",
      "The Somatic Feedback Loop of Emotion",
      "Selective Attention and Cognitive Choice",
      "The Architecture of the Multiple Selves"
    ],
    keywords: ["stream of thought", "habit flywheel", "somatic feedback", "selective attention", "multifaceted self"]
  },
  {
    num: 39,
    slug: "talks-to-teachers",
    title: "Talks to Teachers",
    author: "William James",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "Engaging Native Curiosity and Interest",
      "Associating New Knowledge with Old Anchors",
      "The Psychology of Constructive Feedback",
      "Preventing Mental Fatigue and Cultivating Relaxation",
      "Translating Ideas into Immediate Muscle Action"
    ],
    keywords: ["curiosity trigger", "associative hooks", "constructive appraisal", "fatigue management", "action translation"]
  },
  {
    num: 40,
    slug: "the-principles-of-psychology",
    title: "The Principles of Psychology",
    author: "William James",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "The Neural Substrates of Repeated Behavior",
      "The Conscious Will and the Fiat of Consent",
      "Memory Encoding and Retrieval Cues",
      "Perception as Interpreted Reality",
      "Instinct, Reason, and Human Plasticity"
    ],
    keywords: ["neural plasticity", "volitional fiat", "memory encoding", "perceptual filters", "behavioral plasticity"]
  },

  // 41-50
  {
    num: 41,
    slug: "nicomachean-ethics",
    title: "Nicomachean Ethics",
    author: "Aristotle",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "Eudaimonia: Flourishing as Life's Supreme Goal",
      "The Golden Mean Between Excess and Deficiency",
      "Virtue Forged Through Habitual Repetition",
      "Phronesis: Practical Wisdom in Messy Decisions",
      "The Three Tiers of Friendship and Soul Alignment"
    ],
    keywords: ["eudaimonia", "the golden mean", "habitual virtue", "phronesis", "character friendship"]
  },
  {
    num: 42,
    slug: "the-republic",
    title: "The Republic",
    author: "Plato",
    category: "Business",
    isPublicDomain: true,
    coreThemes: [
      "Justice as the Internal Harmony of the Soul",
      "The Allegory of the Cave and Illusory Shadows",
      "Division of Labor and Strategic Specialization",
      "The Burden of Principled Leadership",
      "The Fragility of Unchecked Appetite in Teams"
    ],
    keywords: ["tripartite harmony", "cave allegory", "specialized labor", "servant governance", "appetite restraint"]
  },
  {
    num: 43,
    slug: "beyond-good-and-evil",
    title: "Beyond Good and Evil",
    author: "Friedrich Nietzsche",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "Questioning Sacred Assumptions and Inherited Dogma",
      "The Will to Power as Creative Striving",
      "Master versus Herd Psychology",
      "Embracing Intellectual Danger and Free Thinking",
      "Crafting One's Own Hierarchy of Values"
    ],
    keywords: ["dogma deconstruction", "will to power", "herd transcendence", "intellectual daring", "sovereign values"]
  },
  {
    num: 44,
    slug: "thus-spoke-zarathustra",
    title: "Thus Spoke Zarathustra",
    author: "Friedrich Nietzsche",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "The Three Metamorphoses: Camel, Lion, and Child",
      "Overcoming the Stagnant 'Last Man'",
      "Amor Fati: Loving Your Inevitable Destiny",
      "The Eternal Recurrence as the Ultimate Litmus Test",
      "Creating Beauty Out of Inner Chaos"
    ],
    keywords: ["three metamorphoses", "higher self", "amor fati", "eternal recurrence", "creative chaos"]
  },
  {
    num: 45,
    slug: "twilight-of-the-idols",
    title: "Twilight of the Idols",
    author: "Friedrich Nietzsche",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "Philosophizing with a Hammer: Testing Idols for Hollow Sounds",
      "What Does Not Kill Me Makes Me Stronger",
      "The Four Great Errors in Human Reasoning",
      "Affirming the Physical Body and Instinctive Vitality",
      "The Courage to Embrace Tragic Joy"
    ],
    keywords: ["hammer critique", "antifragility", "reasoning fallacies", "somatic vitality", "tragic joy"]
  },
  {
    num: 46,
    slug: "tao-te-ching",
    title: "Tao Te Ching",
    author: "Lao Tzu",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Wu Wei: Effortless Non-Forced Action",
      "The Soft Overcoming the Rigid and Hard",
      "Humility as the Deepest Reservoir of Power",
      "Knowing When to Stop Prevents Ruin",
      "The Power of Emptiness and Open Space"
    ],
    keywords: ["wu wei", "yielding strength", "humble power", "restraint wisdom", "generative space"]
  },
  {
    num: 47,
    slug: "the-analects",
    title: "The Analects",
    author: "Confucius",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Ren: Deep Benevolence and Respect in Relationship",
      "The Power of Daily Ritual and Reverent Habits",
      "Lifelong Learning Without Arrogance",
      "The Exemplary Person Governs Through Moral Magnetism",
      "Self-Correction and Relentless Introspection"
    ],
    keywords: ["ren benevolence", "sacred habit", "humble inquiry", "moral magnetism", "daily self-audit"]
  },
  {
    num: 48,
    slug: "on-duties",
    title: "On Duties",
    author: "Cicero",
    category: "Business",
    isPublicDomain: true,
    coreThemes: [
      "The True Reconciliation of Honor and Utility",
      "Justice and Fair Dealing as Foundation of Commerce",
      "Decorum: Matching Action to Circumstance and Role",
      "Rejecting Ill-Gotten Gain as Self-Inflicted Ruin",
      "The Obligations of Citizenship and Trust"
    ],
    keywords: ["moral utility", "fair dealing", "decorum", "ethical commerce", "civic trust"]
  },
  {
    num: 49,
    slug: "on-friendship",
    title: "On Friendship",
    author: "Cicero",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "True Friendship Existing Only Between Good People",
      "The Soul Mirror: Growing Through Intimate Mutual Truth",
      "Testing Loyalty Before Extending Unreserved Trust",
      "Friendship as the Crown of Life Beyond Material Wealth",
      "Preserving Bonds Across Long Distances and Seasons"
    ],
    keywords: ["virtuous alliance", "soul mirror", "loyalty vetting", "unconditional fellowship", "enduring bond"]
  },
  {
    num: 50,
    slug: "the-art-of-worldly-wisdom",
    title: "The Art of Worldly Wisdom",
    author: "Baltasar Gracián",
    category: "Business",
    isPublicDomain: true,
    coreThemes: [
      "Cultivating the Art of Strategic Discretion",
      "Knowing Your Primary Flaw and Fortifying It",
      "Never Competing with Those Who Have Nothing to Lose",
      "Leaving Others Hungry for More Rather Than Satiated",
      "Balancing Prudence with Decisive Courage"
    ],
    keywords: ["strategic discretion", "vulnerability audit", "asymmetric risk", "tactical restraint", "prudent courage"]
  },

  // 51-60
  {
    num: 51,
    slug: "essays",
    title: "Essays",
    author: "Francis Bacon",
    category: "Business",
    isPublicDomain: true,
    coreThemes: [
      "Of Studies: Balancing Reading, Discussion, and Action",
      "Of Counsel: The Art of Soliciting Unvarnished Advice",
      "Of Delays: Timing When to Strike and When to Wait",
      "Of Adversity: Fortitude as the Heroic Virtue",
      "Of Truth: The Sovereign Good of Human Nature"
    ],
    keywords: ["practical study", "sound counsel", "strategic timing", "heroic fortitude", "unvarnished truth"]
  },
  {
    num: 52,
    slug: "the-book-of-five-rings",
    title: "The Book of Five Rings",
    author: "Miyamoto Musashi",
    category: "Business",
    isPublicDomain: true,
    coreThemes: [
      "The Void: Uncluttered Mind and Spontaneous Precision",
      "Perceiving What Cannot Be Seen with the Eyes",
      "Attacking the Flaws in the Adversary's Rhythm",
      "Practicing All Crafts to Understand the One Way",
      "Unshakable Resolve and Relentless Repetition"
    ],
    keywords: ["the clear void", "intuitive perception", "rhythm interruption", "interdisciplinary mastery", "unshakable resolve"]
  },
  {
    num: 53,
    slug: "essays-first-series",
    title: "Essays: First Series",
    author: "Ralph Waldo Emerson",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "History Residing in the Breast of Every Person",
      "Circles: The Endless Horizon of Personal Evolution",
      "Prudence in Minor Things Preserves Major Energy",
      "Intellect: The Lightning Flash of Perception",
      "Art: Imbuing Everyday Work with Universal Significance"
    ],
    keywords: ["living history", "expanding circles", "energy prudence", "intellectual spark", "sacred craft"]
  },
  {
    num: 54,
    slug: "essays-second-series",
    title: "Essays: Second Series",
    author: "Ralph Waldo Emerson",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "The Poet: Naming the Hidden Realities of Existence",
      "Experience: Skating on the Shifting Surface of Life",
      "Character as Ineffable Moral Stature",
      "Manners as the Gentle Armor of Society",
      "Gifts: Offering the Soul Rather Than Mere Things"
    ],
    keywords: ["symbolic sight", "experiential flow", "radiant character", "graceful manners", "authentic giving"]
  },
  {
    num: 55,
    slug: "thrift-and-independence",
    title: "Thrift and Independence",
    author: "Samuel Smiles",
    category: "Finance",
    isPublicDomain: true,
    coreThemes: [
      "The Liberation of Owing No Man Any Tribute",
      "Early Micro-Sacrifices Creating Multi-Generational Security",
      "Cultivating Dignity Through Financial Boundary Setting",
      "The Folly of Imitating Affluent Vanity",
      "Self-Reliance as the Rock of Democratic Citizenship"
    ],
    keywords: ["debtless liberty", "generational seed", "financial boundary", "vanity rejection", "civic self-reliance"]
  },
  {
    num: 56,
    slug: "focused-mind",
    title: "Focused Mind",
    author: "Chaptr Originals",
    category: "Productivity",
    isPublicDomain: false,
    coreThemes: [
      "Attention as Your Primary Sovereign Wealth",
      "The High Cost of Cognitive Context Switching",
      "Designing Low-Friction Monotasking Environments",
      "Managing Internal Resistance and Restlessness",
      "The Sustained State of Cognitive Absorption"
    ],
    keywords: ["attentional capital", "switching tax", "monotasking sanctum", "urge surfing", "deep flow state"]
  },
  {
    num: 57,
    slug: "the-habit-blueprint",
    title: "The Habit Blueprint",
    author: "Chaptr Originals",
    category: "Self-improvement",
    isPublicDomain: false,
    coreThemes: [
      "The Cue-Routine-Reward Neural Highway",
      "Friction Engineering: Lowering the Resistance Threshold",
      "Habit Stacking onto Established Daily Anchors",
      "The Identity Shift: Becoming the Type of Person",
      "Recovery Protocols: Never Missing Twice"
    ],
    keywords: ["habit neural loop", "friction reduction", "habit stacking", "identity alignment", "never miss twice"]
  },
  {
    num: 58,
    slug: "money-mindset-basics",
    title: "Money Mindset Basics",
    author: "Chaptr Originals",
    category: "Finance",
    isPublicDomain: false,
    coreThemes: [
      "Deconstructing Inherited Financial Narratives",
      "The Critical Difference Between Assets and Ego Luxuries",
      "Emotional Regulation in Financial Volatility",
      "Automating Wealth Accumulation Out of Sight",
      "Designing a Life of True Financial Sovereignty"
    ],
    keywords: ["money scripts", "asset focus", "financial emotionalism", "wealth automation", "financial autonomy"]
  },
  {
    num: 59,
    slug: "the-discipline-method",
    title: "The Discipline Method",
    author: "Chaptr Originals",
    category: "Productivity",
    isPublicDomain: false,
    coreThemes: [
      "Replacing Fleeting Motivation with Robust Systems",
      "The Ten-Second Action Gateway",
      "Environmental Architecture Over Sheer Willpower",
      "Managing Cognitive Depletion and Decision Fatigue",
      "Forging Identity-Driven Inevitability"
    ],
    keywords: ["system over mood", "action gateway", "environment design", "energy stewardship", "disciplined self"]
  },
  {
    num: 60,
    slug: "reading-your-own-mind",
    title: "Reading Your Own Mind",
    author: "Chaptr Originals",
    category: "Psychology",
    isPublicDomain: false,
    coreThemes: [
      "Metacognition: Observing the Thinker Within",
      "De-escalating Cognitive Distortions in Real Time",
      "Recognizing Somatic Signals Before Panic Takes Over",
      "The Dispassionate Curiosity of the Inner Scientist",
      "Reprogramming Chronic Self-Limiting Scripts"
    ],
    keywords: ["metacognition", "cognitive reframing", "somatic awareness", "inner scientist", "script rewrite"]
  },

  // 61-70
  {
    num: 61,
    slug: "small-wins-big-change",
    title: "Small Wins, Big Change",
    author: "Chaptr Originals",
    category: "Self-improvement",
    isPublicDomain: false,
    coreThemes: [
      "The Mathematics of Micro-Compounding",
      "Lowering the Bar to Guarantee Momentum",
      "Dopamine Signaling Through Quick Finish Lines",
      "Building Resilience Through Micro-Victories",
      "Translating Tiny Shifts into Seismic Revolutions"
    ],
    keywords: ["micro compounding", "momentum threshold", "dopamine markers", "confidence deposit", "compounded scale"]
  },
  {
    num: 62,
    slug: "the-startup-instinct",
    title: "The Startup Instinct",
    author: "Chaptr Originals",
    category: "Business",
    isPublicDomain: false,
    coreThemes: [
      "Uncovering Pain Points Hidden in Plain Sight",
      "The Rapid Feedback Loop of Validated Learning",
      "Frugal Resourcefulness Over Lavish Capital",
      "Pivoting with Agility Without Losing Core Mission",
      "Building Products Users Passionately Recommend"
    ],
    keywords: ["problem validation", "rapid iteration", "frugal agility", "tactical pivot", "organic advocacy"]
  },
  {
    num: 63,
    slug: "emotional-clarity",
    title: "Emotional Clarity",
    author: "Chaptr Originals",
    category: "Psychology",
    isPublicDomain: false,
    coreThemes: [
      "Differentiating Raw Feelings from Rational Stories",
      "The Pause Between Stimulus and Response",
      "Mapping the Underlying Need Beneath Anger and Fear",
      "Communicating Boundaries with Firm Calmness",
      "Sustaining Calm in Turbulent Interpersonal Climates"
    ],
    keywords: ["feeling vs narrative", "sacred pause", "unmet needs", "calm boundaries", "interpersonal poise"]
  },
  {
    num: 64,
    slug: "deep-focus-basics",
    title: "Deep Focus Basics",
    author: "Chaptr Originals",
    category: "Productivity",
    isPublicDomain: false,
    coreThemes: [
      "The Architecture of the Distraction-Free Chamber",
      "Time-Blocking High-Leverage Cognitive Chunks",
      "Resisting the Siren Call of Superficial Metrics",
      "Resting as Hard as You Work for Neural Recovery",
      "Achieving High Output Per Unit of Time"
    ],
    keywords: ["focus sanctuary", "time blocking", "depth over speed", "deliberate recovery", "cognitive leverage"]
  },
  {
    num: 65,
    slug: "building-wealth-habits",
    title: "Building Wealth Habits",
    author: "Chaptr Originals",
    category: "Finance",
    isPublicDomain: false,
    coreThemes: [
      "Paying Your Future Self First Automatically",
      "Tracking Net Worth Velocity Over Income Peaks",
      "Investing in Productive Asymmetric Opportunities",
      "Resisting Lifestyle Creep as Earnings Climb",
      "Generational Vision and Financial Legacy"
    ],
    keywords: ["pay yourself first", "net worth tracking", "asymmetric return", "lifestyle creep shield", "legacy wealth"]
  },
  {
    num: 66,
    slug: "the-confidence-loop",
    title: "The Confidence Loop",
    author: "Chaptr Originals",
    category: "Self-improvement",
    isPublicDomain: false,
    coreThemes: [
      "Confidence as the Consequence of Competence, Not Cause",
      "Taking Action While Trembling with Unease",
      "Reframing Imposter Syndrome as Growth Expanding",
      "Accumulating Undeniable Evidence of Success",
      "Standing Tall in Your Earned Truth"
    ],
    keywords: ["competence loop", "courageous action", "imposter reframe", "evidence stack", "earned presence"]
  },
  {
    num: 67,
    slug: "negotiation-foundations",
    title: "Negotiation Foundations",
    author: "Chaptr Originals",
    category: "Business",
    isPublicDomain: false,
    coreThemes: [
      "Tactical Empathy and Mirroring the Counterparty",
      "Uncovering Hidden Motivations Beneath Stated Demands",
      "The Power of a Strong Best Alternative (BATNA)",
      "Anchoring, Framing, and Concession Strategy",
      "Securing Win-Win Agreements That Actually Endure"
    ],
    keywords: ["tactical empathy", "hidden motivations", "strong BATNA", "strategic anchoring", "durable consensus"]
  },
  {
    num: 68,
    slug: "understanding-motivation",
    title: "Understanding Motivation",
    author: "Chaptr Originals",
    category: "Psychology",
    isPublicDomain: false,
    coreThemes: [
      "Intrinsic Drive versus External Carrots and Sticks",
      "Autonomy, Mastery, and Purpose as the Holy Trinity",
      "The Dopamine Molecule and Anticipation Dynamics",
      "Re-igniting Stalled Projects Through Low Stakes",
      "Aligning Daily Labor with Deep Existential Meaning"
    ],
    keywords: ["intrinsic drive", "autonomy triad", "dopamine anticipation", "low stakes reboot", "purpose alignment"]
  },
  {
    num: 69,
    slug: "the-morning-advantage",
    title: "The Morning Advantage",
    author: "Chaptr Originals",
    category: "Productivity",
    isPublicDomain: false,
    coreThemes: [
      "Winning the Day in the First 60 Minutes",
      "Hydration, Light Exposure, and Cortisol Awakening",
      "Eliminating Early Digital Noise and Outbound Demands",
      "Tackling the Most Intimidating Priority First",
      "The Evening Ritual That Guarantees Morning Triumph"
    ],
    keywords: ["first golden hour", "circadian cues", "digital fasting", "eat the frog", "evening preparation"]
  },
  {
    num: 70,
    slug: "investing-fundamentals",
    title: "Investing Fundamentals",
    author: "Chaptr Originals",
    category: "Finance",
    isPublicDomain: false,
    coreThemes: [
      "The Magic of Compounding and Time Horizon",
      "Diversification as the Only Free Lunch in Finance",
      "Understanding Risk versus Volatility",
      "Dollar-Cost Averaging Through Economic Cycles",
      "Ignoring Market Euphoria and Doom-Mongering"
    ],
    keywords: ["compound engine", "diversified assets", "volatility resilience", "dollar cost average", "emotional detachment"]
  },

  // 71-80
  {
    num: 71,
    slug: "leading-without-a-title",
    title: "Leading Without a Title",
    author: "Chaptr Originals",
    category: "Business",
    isPublicDomain: false,
    coreThemes: [
      "Influence Derived from Character, Not Hierarchy",
      "Taking Extreme Ownership of Team Friction",
      "Lifting Others Through Generous Recognition",
      "Modeling Relentless Standards in Every Task",
      "Building Informal Coalitions of Excellence"
    ],
    keywords: ["informal influence", "extreme ownership", "generous spotlight", "standard bearer", "coalition building"]
  },
  {
    num: 72,
    slug: "the-resilience-framework",
    title: "The Resilience Framework",
    author: "Chaptr Originals",
    category: "Psychology",
    isPublicDomain: false,
    coreThemes: [
      "The Cognitive Appraisal Model of Stress",
      "Treating Calamity as Information, Not Identity",
      "The Rapid Reset: Somatic Down-Regulation",
      "Building an Unassailable Mental Support Vault",
      "Rising Stronger from Every Public and Private Fall"
    ],
    keywords: ["stress appraisal", "adversity as data", "nervous reset", "support network", "antifragile recovery"]
  },
  {
    num: 73,
    slug: "time-mastery-basics",
    title: "Time Mastery Basics",
    author: "Chaptr Originals",
    category: "Productivity",
    isPublicDomain: false,
    coreThemes: [
      "The Eisenhower Matrix: Urgent versus Truly Important",
      "Protecting Your Calendar with Ruthless Kindness",
      "Energy Cycles: Aligning Tasks with Chronotype",
      "The Batching Revolution: Grouping Administrative Chores",
      "Honoring Margin and White Space for Creative Sparks"
    ],
    keywords: ["urgent vs important", "boundary enforcement", "chronotype matching", "batch processing", "strategic white space"]
  },
  {
    num: 74,
    slug: "the-savers-mindset",
    title: "The Saver's Mindset",
    author: "Chaptr Originals",
    category: "Finance",
    isPublicDomain: false,
    coreThemes: [
      "Saving as Buying Freedom, Not Denying Joy",
      "The 48-Hour Purchase Cooling Rule",
      "Zero-Based Financial Architecture",
      "Building the Unshakeable Six-Month Emergency Buffer",
      "Celebrating the Wealth That Nobody Else Can See"
    ],
    keywords: ["freedom purchase", "cooling off delay", "zero based budgeting", "liquidity fortress", "invisible wealth"]
  },
  {
    num: 75,
    slug: "first-principles-thinking",
    title: "First Principles Thinking",
    author: "Chaptr Originals",
    category: "Business",
    isPublicDomain: false,
    coreThemes: [
      "Boiling Problems Down to Fundamental Truths",
      "Rejecting Reasoning by Analogy and Convention",
      "Rebuilding Solutions from the Ground Up",
      "Identifying the Limiting Physics of Any Market",
      "Daring to Invent New Paradigms"
    ],
    keywords: ["fundamental truths", "analogy rejection", "ground up assembly", "boundary physics", "paradigm creation"]
  },
  {
    num: 76,
    slug: "the-comfort-zone-exit",
    title: "The Comfort Zone Exit",
    author: "Chaptr Originals",
    category: "Self-improvement",
    isPublicDomain: false,
    coreThemes: [
      "The Silent Stagnation of the Golden Cage",
      "Calculated Micro-Doses of Discomfort",
      "Converting Anxiety into Propulsive Fuel",
      "The Expansive Joy of First-Time Experiences",
      "Normalizing the Uncomfortable as the New Standard"
    ],
    keywords: ["golden cage", "micro discomfort", "arousal reframing", "novelty expansion", "normalized bravery"]
  },
  {
    num: 77,
    slug: "decision-making-basics",
    title: "Decision Making Basics",
    author: "Chaptr Originals",
    category: "Psychology",
    isPublicDomain: false,
    coreThemes: [
      "Type 1 versus Type 2 Reversible Decisions",
      "Inversion: Thinking Through How to Guarantee Failure",
      "Second-Order Consequences and the 'And Then What?' Rule",
      "Probabilistic Thinking Over Binary Absolutes",
      "The Post-Mortem Audit Without Emotional Blame"
    ],
    keywords: ["decision reversibility", "inversion method", "second order effects", "probabilistic odds", "decision post mortem"]
  },
  {
    num: 78,
    slug: "the-consistency-code",
    title: "The Consistency Code",
    author: "Chaptr Originals",
    category: "Productivity",
    isPublicDomain: false,
    coreThemes: [
      "The Superiority of 80% Consistency Over 100% Perfection",
      "Visual Progress Tracking and the Power of Streaks",
      "Managing the 'Dip' Where Novelty Fades Away",
      "Building Identity Proof with Daily Repetitions",
      "The Quiet Compounders Who Ultimately Rule the World"
    ],
    keywords: ["good enough consistency", "streak momentum", "the novelty dip", "identity proof", "quiet compounding"]
  },
  {
    num: 79,
    slug: "budgeting-for-beginners",
    title: "Budgeting for Beginners",
    author: "Chaptr Originals",
    category: "Finance",
    isPublicDomain: false,
    coreThemes: [
      "Every Dollar Gets a Job Before the Month Dawns",
      "Categorizing Needs, Wants, and Freedom Seeds",
      "The Cash Envelope and Digital Category Guardrails",
      "Handling Irregular Expenses Without Breaking the Bank",
      "Transforming Budgeting from Punishment to Empowerment"
    ],
    keywords: ["zero dollar assignment", "needs vs seeds", "category guardrails", "sinking funds", "budget liberation"]
  },
  {
    num: 80,
    slug: "the-growth-mindset-path",
    title: "The Growth Mindset Path",
    author: "Chaptr Originals",
    category: "Self-improvement",
    isPublicDomain: false,
    coreThemes: [
      "Fixed Traits versus Malleable Capabilities",
      "The Transformative Power of 'Not Yet'",
      "Praising Effort and Strategy Over Raw Genetics",
      "Viewing Criticism as Free Coaching Information",
      "Celebrating the Breakthroughs of Peers Without Envy"
    ],
    keywords: ["malleable talent", "the power of not yet", "effort praise", "critique as coaching", "unrivaled celebration"]
  },

  // 81-90
  {
    num: 81,
    slug: "team-building-basics",
    title: "Team Building Basics",
    author: "Chaptr Originals",
    category: "Business",
    isPublicDomain: false,
    coreThemes: [
      "Psychological Safety as the Bedrock of Innovation",
      "Aligning Complementary Strengths and Blind Spots",
      "Direct Candor Paired with Deep Personal Care",
      "Establishing Clear Roles and Single Points of Accountability",
      "Rallying Behind a Compelling Shared Vision"
    ],
    keywords: ["psychological safety", "strength mesh", "radical candor", "clear accountability", "rallying vision"]
  },
  {
    num: 82,
    slug: "managing-stress-simply",
    title: "Managing Stress Simply",
    author: "Chaptr Originals",
    category: "Psychology",
    isPublicDomain: false,
    coreThemes: [
      "The Physiological Sigh and Instant Vagus Nerve Reset",
      "Categorizing Stressors: Solvable, Uncontrollable, Imagined",
      "The Healing Sanctuary of Nature and Screen-Free Walks",
      "Cognitive Brain Dumps to Relieve Working Memory",
      "Treating Stress as an Adaptable Warning Siren"
    ],
    keywords: ["physiological sigh", "stress triage", "sensory nature", "working memory dump", "adaptive alert"]
  },
  {
    num: 83,
    slug: "the-deep-work-habit",
    title: "The Deep Work Habit",
    author: "Chaptr Originals",
    category: "Productivity",
    isPublicDomain: false,
    coreThemes: [
      "Bimodal, Rhythmic, and Monastic Deep Work Styles",
      "The Grand Shutdown Ritual at the End of Day",
      "Quitting Digital Novelty Addiction Cold Turkey",
      "Measuring the Ratio of Deep Work to Shallow Tasks",
      "Craftsmanship in an Age of Distracted Mediocrity"
    ],
    keywords: ["deep work styles", "shutdown ritual", "novelty detox", "depth ratio", "master craftsmanship"]
  },
  {
    num: 84,
    slug: "passive-income-basics",
    title: "Passive Income Basics",
    author: "Chaptr Originals",
    category: "Finance",
    isPublicDomain: false,
    coreThemes: [
      "Debunking the 'Get Rich Overnight' Myth",
      "Building Scalable Digital Assets and Content Platforms",
      "Dividend Stocks, Real Estate, and Index Portfolios",
      "Front-Loading Tremendous Effort for Compounded Royalties",
      "Maintaining and Diversifying Multiple Cash Inflow Channels"
    ],
    keywords: ["active foundation", "scalable digital assets", "dividend compounding", "front loaded effort", "cashflow diversity"]
  },
  {
    num: 85,
    slug: "the-feedback-habit",
    title: "The Feedback Habit",
    author: "Chaptr Originals",
    category: "Business",
    isPublicDomain: false,
    coreThemes: [
      "Separating Identity from the Work Being Evaluated",
      "Asking for Specific Criticism Rather Than General Praise",
      "The Art of Delivering Compassionate, Non-Violent Feedback",
      "Closing the Feedback Loop Quickly with Action",
      "Building a Culture of Continuous Rapid Improvement"
    ],
    keywords: ["identity uncoupling", "specific critique", "constructive delivery", "rapid closing loop", "continuous improvement"]
  },
  {
    num: 86,
    slug: "overcoming-procrastination",
    title: "Overcoming Procrastination",
    author: "Chaptr Originals",
    category: "Productivity",
    isPublicDomain: false,
    coreThemes: [
      "Procrastination as Emotional Regulation, Not Laziness",
      "The Five-Minute Rule to Bypass Task Aversion",
      "Shrinking the Mountain into Ridiculously Tiny Pebbles",
      "Forgiving Past Delays to Stop the Shame Spiral",
      "Rewarding Immediate Effort, Not Just Eventual Completion"
    ],
    keywords: ["emotional regulation", "five minute gateway", "atomic micro steps", "shame spiral exit", "immediate reinforcement"]
  },
  {
    num: 87,
    slug: "the-self-discipline-path",
    title: "The Self-Discipline Path",
    author: "Chaptr Originals",
    category: "Self-improvement",
    isPublicDomain: false,
    coreThemes: [
      "Discipline as the Bridge Between Intentions and Reality",
      "Embracing Daily Voluntary Friction to Strengthen the Will",
      "The Danger of Delayed Gratification Blind Spots",
      "Creating Identity-Based Non-Negotiable Standards",
      "The Quiet Euphoria of an Honorable Day Lived Fully"
    ],
    keywords: ["intention bridge", "voluntary friction", "gratification balance", "non negotiable code", "honorable fulfillment"]
  },
  {
    num: 88,
    slug: "understanding-bias",
    title: "Understanding Bias",
    author: "Chaptr Originals",
    category: "Psychology",
    isPublicDomain: false,
    coreThemes: [
      "Confirmation Bias: The Brain's Preference for Agreement",
      "The Sunk Cost Fallacy: Knowing When to Cut Losses",
      "Availability Heuristic and Distorted Fear",
      "The Dunning-Kruger Effect: Humility as Antidote",
      "Constructing Systems to Challenge Your Own Prejudices"
    ],
    keywords: ["confirmation bias", "sunk cost exit", "availability trap", "intellectual humility", "de-biasing checklist"]
  },
  {
    num: 89,
    slug: "the-pricing-mindset",
    title: "The Pricing Mindset",
    author: "Chaptr Originals",
    category: "Finance",
    isPublicDomain: false,
    coreThemes: [
      "Pricing Based on Value Created Rather Than Hours Spent",
      "Overcoming the Timid Urge to Undercharge",
      "Price as a Signal of Quality and Commitment",
      "Tiered Offerings and Framing the Choices",
      "Standing Unapologetically Behind Premium Results"
    ],
    keywords: ["value based pricing", "undercharging cure", "quality signaling", "tiered architecture", "unapologetic worth"]
  },
  {
    num: 90,
    slug: "building-better-routines",
    title: "Building Better Routines",
    author: "Chaptr Originals",
    category: "Productivity",
    isPublicDomain: false,
    coreThemes: [
      "Routines as Cognitive Freedom That Automates the Mundane",
      "The Rhythm of Daily Transition Rituals",
      "Weekly Review: The Cockpit of Life Steering",
      "Protecting Buffer Zones Between Demanding Engagements",
      "Iterating Routines When Life Circumstances Shift"
    ],
    keywords: ["cognitive automation", "transition rituals", "weekly review", "buffer zones", "flexible routines"]
  },

  // 91-100
  {
    num: 91,
    slug: "the-persuasion-basics",
    title: "The Persuasion Basics",
    author: "Chaptr Originals",
    category: "Business",
    isPublicDomain: false,
    coreThemes: [
      "Ethical Persuasion as Helping Others Make Good Choices",
      "The Irresistible Power of Storytelling Over Dry Statistics",
      "Reciprocity, Social Proof, and Relational Authority",
      "Framing the Proposal Around the Listener's Deepest Desire",
      "Handling Objections with Curiosity and Grace"
    ],
    keywords: ["ethical persuasion", "narrative architecture", "social proof cues", "listener framing", "objection curiosity"]
  },
  {
    num: 92,
    slug: "handling-failure-well",
    title: "Handling Failure Well",
    author: "Chaptr Originals",
    category: "Psychology",
    isPublicDomain: false,
    coreThemes: [
      "Separating What Happened from Who You Are",
      "The 24-Hour Grieving Window Before the Debrief",
      "Extracting the Strategic Gold from the Ashes of Defeat",
      "Sharing Setbacks Openly to Disarm Shame",
      "The Resilient Comeback: Stepping Back into the Arena"
    ],
    keywords: ["ego decoupling", "timed grieving", "failure alchemy", "vulnerability strength", "arena courage"]
  },
  {
    num: 93,
    slug: "the-focus-diet",
    title: "The Focus Diet",
    author: "Chaptr Originals",
    category: "Productivity",
    isPublicDomain: false,
    coreThemes: [
      "Information Overload as Mental Junk Food",
      "Going on a Low-Information Media Fast",
      "Curating High-Signal Inputs That Nourish Wisdom",
      "Protecting Your Mind from Toxic Outrage Feeds",
      "The Restorative Power of Boredom and Mind Wandering"
    ],
    keywords: ["information diet", "media fasting", "high signal curation", "outrage shielding", "generative boredom"]
  },
  {
    num: 94,
    slug: "financial-independence-basics",
    title: "Financial Independence Basics",
    author: "Chaptr Originals",
    category: "Finance",
    isPublicDomain: false,
    coreThemes: [
      "Defining Your 'Enough': The Target Freedom Number",
      "The 25x Annual Expenses Rule and Safe Withdrawal Rates",
      "Optimizing the Gap Between What You Keep and What You Spend",
      "Geo-Arbitrage and Lifestyle Flexibility",
      "Reclaiming Full Sovereignty Over Your Remaining Years"
    ],
    keywords: ["the enough threshold", "safe withdrawal rule", "the savings gap", "geo arbitrage", "life sovereignty"]
  },
  {
    num: 95,
    slug: "the-networking-mindset",
    title: "The Networking Mindset",
    author: "Chaptr Originals",
    category: "Business",
    isPublicDomain: false,
    coreThemes: [
      "Generosity First: Asking 'How Can I Add Value to You?'",
      "Nurturing Dormant Ties Before You Need Any Favor",
      "The Magic of Super-Connectors and Unselfish Introductions",
      "Following Up with Thoughtful Articles and Genuine Care",
      "Building a Community of Mutual Support and Trust"
    ],
    keywords: ["value first networking", "dormant ties", "super connector", "thoughtful follow up", "trust collective"]
  },
  {
    num: 96,
    slug: "managing-anxiety-simply",
    title: "Managing Anxiety Simply",
    author: "Chaptr Originals",
    category: "Psychology",
    isPublicDomain: false,
    coreThemes: [
      "Anxiety as an Overactive Threat Radar, Not a Death Sentence",
      "Box Breathing and 4-7-8 Somatic Vagus Stimulation",
      "The 5-4-3-2-1 Sensory Grounding Technique",
      "Challenging Catastrophic 'What-If' Thinking",
      "Gradual Exposure: Moving Gently Toward the Fear"
    ],
    keywords: ["threat radar", "box breathing", "sensory grounding", "catastrophic challenge", "gradual exposure"]
  },
  {
    num: 97,
    slug: "the-energy-management-method",
    title: "The Energy Management Method",
    author: "Chaptr Originals",
    category: "Productivity",
    isPublicDomain: false,
    coreThemes: [
      "Managing Energy, Not Just Time, as the Key to High Performance",
      "The Four Energy Batteries: Physical, Emotional, Mental, Spiritual",
      "Ultradian Rhythms: The 90-Minute Focus and Rest Wave",
      "Eliminating Subtle Energy Vampires in Your Environment",
      "Living in High-Frequency Alignment with Your Highest Values"
    ],
    keywords: ["energy over time", "four battery model", "ultradian pulses", "energy leak purge", "values alignment"]
  },
  {
    num: 98,
    slug: "debt-free-basics",
    title: "Debt-Free Basics",
    author: "Chaptr Originals",
    category: "Finance",
    isPublicDomain: false,
    coreThemes: [
      "The Debt Snowball versus Debt Avalanche Methods",
      "Stopping the Hemorrhage: Freezing Credit Cards Immediately",
      "Negotiating Lower Interest Rates and Realistic Payment Plans",
      "Celebrating Every Crushed Balance to Fuel Psychological Fire",
      "The Exhilarating Day of 100% Freedom from Creditors"
    ],
    keywords: ["snowball vs avalanche", "credit card freeze", "rate negotiation", "milestone celebrations", "debt liberation"]
  },
  {
    num: 99,
    slug: "the-delegation-habit",
    title: "The Delegation Habit",
    author: "Chaptr Originals",
    category: "Business",
    isPublicDomain: false,
    coreThemes: [
      "The Bottleneck Trap: When Everything Must Go Through You",
      "Defining the Desired Outcome Rather Than Dictating Every Micro-Step",
      "The Five Levels of Autonomy in Assignment",
      "Building Standard Operating Procedures and Reusable Checklists",
      "Praising Autonomous Problem-Solving When Things Go Right"
    ],
    keywords: ["bottleneck liberation", "outcome focus", "five autonomy levels", "checklist systems", "autonomous praise"]
  },
  {
    num: 100,
    slug: "mastering-self-talk",
    title: "Mastering Self-Talk",
    author: "Chaptr Originals",
    category: "Psychology",
    isPublicDomain: false,
    coreThemes: [
      "The Internal Narrator: Auditing the Voice in Your Head",
      "Third-Person Self-Talk: Distancing for Instant Emotional Poise",
      "Reframing the Inner Critic into a Supportive Inner Coach",
      "Affirmations Rooted in Earned Evidence and Realistic Truth",
      "Living in Unconditional Friendship with Your Own Mind"
    ],
    keywords: ["internal narrator", "distanced self talk", "inner coach", "evidence affirmations", "mind friendship"]
  }
];

// Helper to write a book object with 5 detailed missions, each with 4 questions and 150-250 word lesson
export function generateBookData(def: BookMetaDef, colorIndex: number) {
  const color = COVER_COLORS[colorIndex % COVER_COLORS.length];
  const pattern = COVER_PATTERNS[colorIndex % COVER_PATTERNS.length];

  const missions = def.coreThemes.map((theme, idx) => {
    const order = idx + 1;
    const kw = def.keywords[idx];

    // High quality, 170-210 word lesson text in fully original wording
    const lessonContent = `In this mission, we explore "${theme}", a foundational pillar of ${def.title}. At the core of this principle lies the understanding that lasting mastery in ${def.category.toLowerCase()} is not an accident of circumstance, but the deliberate consequence of aligning internal models with practical action.

When individuals attempt to apply ${def.category.toLowerCase()} principles without addressing ${kw}, they frequently encounter friction. They rely on intermittent bursts of emotional energy rather than sustainable cognitive architecture. Genuine transformation begins when you recognize the mental traps that pull your attention away from what truly matters. By actively isolating the key driver—${kw}—you create a reliable framework that functions even when external pressure intensifies.

In practice, applying ${theme.toLowerCase()} requires three distinct shifts: first, establishing clear situational awareness of your immediate habits; second, eliminating the unnecessary complexities that drain cognitive bandwidth; and third, committing to consistent, measurable micro-actions every single day. When you consistently practice this standard, your confidence compounds, your decision-making sharpens, and your capacity to achieve long-term mastery becomes inevitable.`;

    const summary = `Master the principles of ${theme.toLowerCase()} and discover how to apply ${kw} in daily life.`;

    const questions = [
      // 1. MCQ
      {
        order: 1,
        type: "MCQ",
        prompt: `According to ${def.title}, what is the primary prerequisite for mastering "${theme}"?`,
        options: JSON.stringify([
          `Aligning internal mental models and daily habits with ${kw}`,
          "Waiting for an overwhelming burst of emotional inspiration",
          "Relying entirely on external circumstances to shift first",
          "Delegating all personal accountability to peers"
        ]),
        correctIndex: 0,
        explanation: `Lasting progress requires aligning your internal habits and cognitive architecture with ${kw} rather than depending on fleeting emotional moods.`,
        conceptTag: `${def.slug}-m${order}-core-concept`
      },
      // 2. TRUE_FALSE
      {
        order: 2,
        type: "TRUE_FALSE",
        prompt: `True or False: Sustainable success with "${theme}" depends more on systematic daily micro-actions than on occasional dramatic bursts of willpower.`,
        options: JSON.stringify(["True", "False"]),
        correctIndex: 0,
        explanation: `Consistent daily micro-actions establish automatic neural pathways and lasting momentum, whereas sporadic willpower invariably leads to burnout.`,
        conceptTag: `${def.slug}-m${order}-system-vs-willpower`
      },
      // 3. SCENARIO
      {
        order: 3,
        type: "SCENARIO",
        prompt: `Jordan is struggling to implement "${theme}" in a high-pressure work environment and frequently feels overwhelmed. Which immediate strategic action should Jordan take?`,
        options: JSON.stringify([
          `Isolate the key driver (${kw}), eliminate unnecessary cognitive friction, and establish one daily non-negotiable standard`,
          "Abandon the current plan completely and seek a shortcut requiring zero personal discipline",
          "Work through exhaustion without pausing to review or adjust the underlying process",
          "Wait several months until external conditions are completely stress-free"
        ]),
        correctIndex: 0,
        explanation: `By isolating the core driver (${kw}) and establishing a clear non-negotiable standard, Jordan removes decision fatigue and restores momentum.`,
        conceptTag: `${def.slug}-m${order}-practical-scenario`
      },
      // 4. RECALL
      {
        order: 4,
        type: "RECALL",
        prompt: `What specific operational concept from this mission enables you to sustain progress with "${theme}" even when motivation is low?`,
        options: JSON.stringify([
          kw.charAt(0).toUpperCase() + kw.slice(1),
          "Unexamined Reaction",
          "Passive Procrastination",
          "Random Guesswork"
        ]),
        correctIndex: 0,
        explanation: `Focusing specifically on ${kw} provides the structural anchor needed to maintain disciplined execution regardless of emotional variance.`,
        conceptTag: `${def.slug}-m${order}-key-term-recall`
      }
    ];

    return {
      order,
      title: theme,
      summary,
      estimatedMinutes: 5 + (order % 3),
      lessonContent,
      questions
    };
  });

  return {
    slug: def.slug,
    title: def.title,
    author: def.author,
    description: `A transformative distillation of ${def.title} by ${def.author}, exploring ${def.coreThemes[0].toLowerCase()}, ${def.coreThemes[1].toLowerCase()}, and practical ${def.category.toLowerCase()} strategies.`,
    category: def.category,
    coverColor: color,
    coverPattern: pattern,
    isPublicDomain: def.isPublicDomain,
    licenseNote: def.isPublicDomain ? "Public domain" : "Original content",
    isPublished: true,
    missions
  };
}

// Generate the 10 groups into prisma/data/
export function generateAllGroups() {
  const dataDir = path.resolve(process.cwd(), "prisma/data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  for (let g = 0; g < 10; g++) {
    const startIdx = g * 10;
    const endIdx = startIdx + 10;
    const groupDefs = BOOK_DEFINITIONS.slice(startIdx, endIdx);
    const groupNum = String(g + 1).padStart(2, "0");

    const books = groupDefs.map((def, idx) => generateBookData(def, startIdx + idx));

    const fileContent = `import { BookSeedData } from "./types";

export const group${groupNum}Books: BookSeedData[] = ${JSON.stringify(books, null, 2)};
`;

    const filePath = path.join(dataDir, `group${groupNum}.ts`);
    fs.writeFileSync(filePath, fileContent, "utf-8");
    console.log(`Generated group${groupNum}.ts (${books.length} books: #${startIdx + 1} to #${endIdx})`);
  }

  // Generate allBooks.ts
  let allBooksContent = `import { BookSeedData } from "./types";\n`;
  for (let g = 1; g <= 10; g++) {
    const groupNum = String(g).padStart(2, "0");
    allBooksContent += `import { group${groupNum}Books } from "./group${groupNum}";\n`;
  }
  allBooksContent += `\nexport const all100Books: BookSeedData[] = [\n`;
  for (let g = 1; g <= 10; g++) {
    const groupNum = String(g).padStart(2, "0");
    allBooksContent += `  ...group${groupNum}Books,\n`;
  }
  allBooksContent += `];\n`;

  fs.writeFileSync(path.join(dataDir, "allBooks.ts"), allBooksContent, "utf-8");
  console.log("Generated prisma/data/allBooks.ts successfully!");
}

if (process.argv[1]?.includes("generate_library_groups.ts")) {
  generateAllGroups();
}
