import fs from "fs";
import path from "path";

// Color palettes for Batch 2 covers - vibrant, distinct, and varied across adjacent books
const COVER_COLORS_BATCH2 = [
  "#1E3A8A", "#065F46", "#92400E", "#3730A3", "#155E75",
  "#9D174D", "#1E40AF", "#3F6212", "#5B21B6", "#9A3412",
  "#166534", "#86198F", "#075985", "#991B1B", "#334155",
  "#115E59", "#6D28D9", "#B45309", "#1D4ED8", "#047857",
  "#BE185D", "#4338CA", "#0E7490", "#A16207", "#701A75"
];

const COVER_PATTERNS = ["waves", "grid", "dots", "rings", "stripes"] as const;

export interface BookMetaDef {
  num: number;
  slug: string;
  title: string;
  author: string;
  category: "Self-improvement" | "Finance" | "Psychology" | "Business" | "Productivity";
  isPublicDomain: boolean;
  coreThemes: [string, string, string, string, string];
  keywords: [string, string, string, string, string];
}

export const BATCH2_BOOK_DEFINITIONS: BookMetaDef[] = [
  // Group 01: Books 1-10
  {
    num: 1,
    slug: "the-way-of-peace",
    title: "The Way of Peace",
    author: "James Allen",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "The Power of Meditation and Stillness",
      "Purging Mental Bitterness and Friction",
      "The Transcendent Healing of Forgiveness",
      "Building the Sanctum of Inward Rest",
      "Living in Undisturbed Universal Harmony"
    ],
    keywords: ["meditative stillness", "bitterness release", "forgiving grace", "inward sanctuary", "universal harmony"]
  },
  {
    num: 2,
    slug: "all-these-things-added",
    title: "All These Things Added",
    author: "James Allen",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Entering the Spiritual Kingdom of Consciousness",
      "Overcoming the Mirage of External Seeking",
      "The Alignment of Moral Law and Daily Reality",
      "Cultivating Inward Purity and Direct Purpose",
      "The Unfailing Harvest of Principled Effort"
    ],
    keywords: ["sovereign consciousness", "internal orientation", "moral alignment", "purity of aim", "principled harvest"]
  },
  {
    num: 3,
    slug: "out-from-the-heart",
    title: "Out from the Heart",
    author: "James Allen",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "The Heart as the Fountain of All Action",
      "Guarding the Threshold of Daily Thoughts",
      "The Transformation of Habitual Desires",
      "Cultivating Benevolent and Noble Affections",
      "Attaining Unshakable Emotional Self-Governance"
    ],
    keywords: ["heart fountain", "mental gatekeeper", "desire sublimation", "noble affections", "emotional sovereignty"]
  },
  {
    num: 4,
    slug: "the-life-triumphant",
    title: "The Life Triumphant",
    author: "James Allen",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Faith and Energy as Pillars of Conquest",
      "Rising Above Self-Imposed Limitations",
      "The Discipline of Continuous Self-Purification",
      "The Mastery of Difficult Circumstances",
      "Radiating Creative Stature and Dignity"
    ],
    keywords: ["vital faith", "boundary expansion", "self-purification", "circumstance mastery", "creative stature"]
  },
  {
    num: 5,
    slug: "morning-and-evening-thoughts",
    title: "Morning and Evening Thoughts",
    author: "James Allen",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Framing the Day with Conscious Morning Intention",
      "Navigating Midday Stress with Tranquil Poise",
      "The Evening Audit: Reviewing Conduct Without Self-Deceit",
      "Releasing Daily Anxiety Before Sleep",
      "The Rhythmic Renewal of Mind and Body"
    ],
    keywords: ["morning framing", "tranquil poise", "evening audit", "anxiety release", "circadian renewal"]
  },
  {
    num: 6,
    slug: "from-passion-to-peace",
    title: "From Passion to Peace",
    author: "James Allen",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "The Restless Hunger of Unbridled Emotion",
      "The Transmutation of Emotional Fire into Focus",
      "Transcending Resentment and Vindictiveness",
      "The Sanctuary of the Rational, Unattached Mind",
      "The Undisturbed Equanimity of the Wise"
    ],
    keywords: ["emotional fire", "focus transmutation", "resentment release", "rational sanctuary", "unshakable equanimity"]
  },
  {
    num: 7,
    slug: "eight-pillars-of-prosperity",
    title: "Eight Pillars of Prosperity",
    author: "James Allen",
    category: "Finance",
    isPublicDomain: true,
    coreThemes: [
      "Energy and Economy as Primary Foundations",
      "Integrity and System in Every Enterprise",
      "Sympathy and Sincerity as Enduring Social Capital",
      "Impartiality and Self-Reliance in Difficult Seasons",
      "The Indestructible Temple of Ethical Wealth"
    ],
    keywords: ["energy economy", "enterprise system", "social sincerity", "impartial reliance", "ethical wealth"]
  },
  {
    num: 8,
    slug: "man-king-of-mind-body-and-circumstance",
    title: "Man: King of Mind, Body and Circumstance",
    author: "James Allen",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "The Sovereign Throne of Inner Command",
      "Directing Bodily Vitality Through Thought Discipline",
      "Refusing to Play the Victim of Environment",
      "The Creative Power of Unflinching Will",
      "Reigning Over Daily Destiny with Dignity"
    ],
    keywords: ["inner command", "vital somatic focus", "anti-victimhood", "unflinching will", "regal self-rule"]
  },
  {
    num: 9,
    slug: "light-on-lifes-difficulties",
    title: "Light on Life's Difficulties",
    author: "James Allen",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "The Purposeful Nature of Friction and Pain",
      "Extinguishing the Flames of Imagined Grief",
      "Cultivating the Gentle Power of Non-Resistance",
      "Finding Inner Solace Amid Public Turmoil",
      "The Universal Light of Tested Wisdom"
    ],
    keywords: ["friction purpose", "grief dissolution", "non-resistance", "inner solace", "tested wisdom"]
  },
  {
    num: 10,
    slug: "foundation-stones-to-happiness-and-success",
    title: "Foundation Stones to Happiness and Success",
    author: "James Allen",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Right Principles as the Bedrock of Progress",
      "Sound Methods in Ordinary Everyday Tasks",
      "True Action Derived from Sincere Conviction",
      "Unselfishness as the True Root of Joy",
      "The Crown of Lasting Personal Fulfillment"
    ],
    keywords: ["right principles", "sound methods", "sincere action", "unselfish joy", "lasting fulfillment"]
  },

  // Group 02: Books 11-20
  {
    num: 11,
    slug: "architects-of-fate",
    title: "Architects of Fate",
    author: "Orison Swett Marden",
    category: "Business",
    isPublicDomain: true,
    coreThemes: [
      "Man as the Master Carver of His Own Destiny",
      "The High Voltage of Concentrated Purpose",
      "Transforming Obstacles into Stepping Stones",
      "The Value of Absolute Thoroughness in Every Detail",
      "Building a Reputation That Endures Pressure"
    ],
    keywords: ["destiny architect", "concentrated purpose", "obstacle transformation", "detail thoroughness", "reputation bedrock"]
  },
  {
    num: 12,
    slug: "cheerfulness-as-a-life-power",
    title: "Cheerfulness as a Life Power",
    author: "Orison Swett Marden",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "Optimism as a Vital Biological Tonic",
      "The Heavy Tax of Chronic Gloom on Brain and Body",
      "Radiating Joy as an Irresistible Social Magnet",
      "Smiling in the Face of Demanding Circumstances",
      "Cultivating the Habit of Grateful Radiance"
    ],
    keywords: ["biological optimism", "gloom tax", "social magnetism", "resilient cheer", "gratitude radiance"]
  },
  {
    num: 13,
    slug: "how-to-succeed",
    title: "How to Succeed",
    author: "Orison Swett Marden",
    category: "Business",
    isPublicDomain: true,
    coreThemes: [
      "Discovering Your One True Natural Bent",
      "The Power of Doing One Thing Superlatively Well",
      "The Untapped Capital of Personal Reliability",
      "Daring to Take Initiative Without Waiting for Permission",
      "The Mastery of Customer Trust Through Excellence"
    ],
    keywords: ["natural bent", "monomaniacal mastery", "reliability capital", "proactive initiative", "trust mastery"]
  },
  {
    num: 14,
    slug: "the-victorious-attitude",
    title: "The Victorious Attitude",
    author: "Orison Swett Marden",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "The Mental Attitude as the Master Blueprint",
      "Banishing the Poison of Self-Deprecation",
      "Expecting Success with Unwavering Certainty",
      "Standing Tall in the Armor of Self-Confidence",
      "Magnetizing Opportunity Through Radiant Expectancy"
    ],
    keywords: ["master blueprint", "self-deprecation cure", "expectant certainty", "armor of confidence", "opportunity magnet"]
  },
  {
    num: 15,
    slug: "ambition-and-success",
    title: "Ambition and Success",
    author: "Orison Swett Marden",
    category: "Business",
    isPublicDomain: true,
    coreThemes: [
      "The Sacred Spark of Noble Ambition",
      "Guarding Against the Complacency of Early Wins",
      "The Discipline of Constant Vocational Upskilling",
      "Aligning Ambition with Uncompromising Honor",
      "The Pinnacle of Meaningful Contribution"
    ],
    keywords: ["noble ambition", "anti-complacency", "continuous upskilling", "honorable drive", "pinnacle contribution"]
  },
  {
    num: 16,
    slug: "self-investment",
    title: "Self-Investment",
    author: "Orison Swett Marden",
    category: "Productivity",
    isPublicDomain: true,
    coreThemes: [
      "You Are Your Own Greatest Capital Asset",
      "Investing Time in Books, Mentors, and Health",
      "The Folly of Starving Your Mental Capabilities",
      "Compounding Vocational Knowledge Over Decades",
      "The Infinite Dividend of Personal Excellence"
    ],
    keywords: ["capital asset self", "strategic investment", "mental nourishment", "knowledge compound", "excellence dividend"]
  },
  {
    num: 17,
    slug: "winning-out",
    title: "Winning Out",
    author: "Orison Swett Marden",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Triumphing Over Defeat and Humble Origins",
      "The Heroic Resilience of the Refusing-to-Quit Mind",
      "Small Daily Victories Accumulating into Legend",
      "Staying True to Your Ideals in Hostile Climates",
      "The Unquenchable Torch of Moral Courage"
    ],
    keywords: ["humble triumph", "refusing to quit", "accumulated victory", "ideals fidelity", "moral courage"]
  },
  {
    num: 18,
    slug: "why-grow-old",
    title: "Why Grow Old?",
    author: "Orison Swett Marden",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "The Mind as the Master Clock of Aging",
      "Sustaining Youthful Curiosity and Wonder",
      "Refusing to Retire into Mental Slumber",
      "Nourishing the Body with Joy, Movement, and Light",
      "The Eternal Freshness of a Purpose-Driven Soul"
    ],
    keywords: ["mind clock", "youthful wonder", "active intellect", "vital nourishment", "eternal vitality"]
  },
  {
    num: 19,
    slug: "the-gospel-of-wealth",
    title: "The Gospel of Wealth",
    author: "Andrew Carnegie",
    category: "Finance",
    isPublicDomain: true,
    coreThemes: [
      "The Moral Burden of Surpluses and Accumulation",
      "Administering Wealth for Community Elevation",
      "Public Libraries and Knowledge as Greatest Equalizers",
      "The Danger of Leaving Vast Unearned Fortunes",
      "Dying Rich as Dying Disgraced"
    ],
    keywords: ["wealth trusteeship", "civic elevation", "knowledge equalizer", "unearned peril", "stewardship honor"]
  },
  {
    num: 20,
    slug: "triumphant-democracy",
    title: "Triumphant Democracy",
    author: "Andrew Carnegie",
    category: "Business",
    isPublicDomain: true,
    coreThemes: [
      "Free Enterprise as the Engine of Broad Progress",
      "The Power of Meritocracy Over Feudal Privilege",
      "The Dynamic Expansion of Infrastructure and Industry",
      "The Dignity of the Autonomous Laborer",
      "Building Systems of Universal Prosperity"
    ],
    keywords: ["free enterprise engine", "meritocratic power", "infrastructure growth", "laborer dignity", "universal prosperity"]
  },

  // Group 03: Books 21-30
  {
    num: 21,
    slug: "unto-this-last",
    title: "Unto This Last",
    author: "John Ruskin",
    category: "Finance",
    isPublicDomain: true,
    coreThemes: [
      "There Is No Wealth but Life",
      "The Moral Relationship Between Employer and Worker",
      "True Value vs Counterfeit Commercial Exchange",
      "The Production of Noble Men as the True Economic Output",
      "Reclaiming Humanity from Mechanistic Greed"
    ],
    keywords: ["vital wealth", "moral employment", "intrinsic value", "noble output", "human economy"]
  },
  {
    num: 22,
    slug: "social-statics",
    title: "Social Statics",
    author: "Herbert Spencer",
    category: "Business",
    isPublicDomain: true,
    coreThemes: [
      "The Law of Equal Freedom for Every Individual",
      "Voluntary Cooperation Over State Coercion",
      "Spontaneous Order in Complex Human Systems",
      "Adaptation and Evolutionary Improvement in Markets",
      "The Sovereignty of Individual Contracts"
    ],
    keywords: ["equal freedom", "voluntary cooperation", "spontaneous order", "market evolution", "contractual sanctity"]
  },
  {
    num: 23,
    slug: "education-intellectual-moral-and-physical",
    title: "Education: Intellectual, Moral, and Physical",
    author: "Herbert Spencer",
    category: "Productivity",
    isPublicDomain: true,
    coreThemes: [
      "What Knowledge Is of Most Worth?",
      "Self-Directed Learning and Natural Consequences",
      "Cultivating Scientific Thinking and Inquiry",
      "The Indispensable Foundation of Physical Health",
      "Training the Mind for Practical Self-Preservation"
    ],
    keywords: ["worthwhile knowledge", "natural consequences", "scientific inquiry", "physical base", "practical mastery"]
  },
  {
    num: 24,
    slug: "a-message-to-garcia",
    title: "A Message to Garcia",
    author: "Elbert Hubbard",
    category: "Productivity",
    isPublicDomain: true,
    coreThemes: [
      "The Rare Virtue of Unprompted Autonomous Action",
      "Carrying Out the Mission Without Asking Idiotic Questions",
      "Eliminating the Cancer of Slipshod Carelessness",
      "Loyalty to the Cause and Tenacious Execution",
      "The Invaluable Man Who Simply Gets the Job Done"
    ],
    keywords: ["autonomous initiative", "silent execution", "anti-carelessness", "unflinching loyalty", "mission completion"]
  },
  {
    num: 25,
    slug: "loyalty-in-business",
    title: "Loyalty in Business",
    author: "Elbert Hubbard",
    category: "Business",
    isPublicDomain: true,
    coreThemes: [
      "Stand by the Organization That Feeds You",
      "The Disastrous Cost of Cynicism and Backbiting",
      "Praise in Public and Align Behind Shared Goals",
      "Personal Integrity as the Ultimate Career Asset",
      "The Mutual Loyalty That Forges Commercial Greatness"
    ],
    keywords: ["organizational fidelity", "anti-cynicism", "shared alignment", "career integrity", "mutual allegiance"]
  },
  {
    num: 26,
    slug: "the-wealth-of-nations",
    title: "The Wealth of Nations",
    author: "Adam Smith",
    category: "Finance",
    isPublicDomain: true,
    coreThemes: [
      "The Tremendous Leverage of Division of Labor",
      "The Invisible Hand and Mutual Benefit in Trade",
      "Self-Interest Aligned with Public Abundance",
      "The Mechanism of Market Prices and Capital Allocation",
      "Prudence and Saving as the Origin of National Wealth"
    ],
    keywords: ["division of labor", "the invisible hand", "mutual trade benefit", "price equilibrium", "prudent capital"]
  },
  {
    num: 27,
    slug: "on-liberty",
    title: "On Liberty",
    author: "John Stuart Mill",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "The Harm Principle: Sovereign Power Over Oneself",
      "The Indispensable Value of Free Speech and Dissent",
      "The Tyranny of the Majority and Social Conformity",
      "Individuality as One of the Elements of Well-Being",
      "Experiments in Living as the Engine of Human Progress"
    ],
    keywords: ["the harm principle", "free expression", "majority tyranny", "sovereign individuality", "experiments in living"]
  },
  {
    num: 28,
    slug: "utilitarianism",
    title: "Utilitarianism",
    author: "John Stuart Mill",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "The Greatest Happiness Principle and Ethical Utility",
      "Higher Intellectual Pleasures vs Lower Sensual Pleasures",
      "Justice as the Natural Protector of Social Utility",
      "Impartiality and the Sympathetic Identification with Others",
      "Cultivating the Noble Character Over Selfish Whim"
    ],
    keywords: ["greatest happiness", "higher pleasures", "justice utility", "impartial empathy", "noble character"]
  },
  {
    num: 29,
    slug: "on-heroes-hero-worship-and-the-heroic-in-history",
    title: "On Heroes, Hero-Worship, and the Heroic in History",
    author: "Thomas Carlyle",
    category: "Business",
    isPublicDomain: true,
    coreThemes: [
      "History as the Biography of Resolute Individuals",
      "Sincerity as the Supreme Characteristic of True Greatness",
      "The Hero as Leader and Beacon in Foggy Eras",
      "Seeing Through Sham Pretense to Living Truth",
      "Reverence for Moral and Creative Excellence"
    ],
    keywords: ["individual agency", "deep sincerity", "heroic leadership", "anti-sham", "excellence reverence"]
  },
  {
    num: 30,
    slug: "the-wisdom-of-life",
    title: "The Wisdom of Life",
    author: "Arthur Schopenhauer",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "What a Man Is Matters More Than What He Has",
      "Cultivating an Inward Wealth That Cannot Be Stolen",
      "The Folly of Overvaluing the Opinions of Others",
      "Solitude as the True Mother of Freedom and Genius",
      "Prudence in Guarding Physical Health Above All Else"
    ],
    keywords: ["inward being", "unassailable wealth", "indifference to opinion", "sanctuary solitude", "health primacy"]
  },

  // Group 04: Books 31-40
  {
    num: 31,
    slug: "the-essays-of-montaigne",
    title: "The Essays of Montaigne",
    author: "Michel de Montaigne",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Que Sais-Je? The Liberating Power of Humble Skepticism",
      "Studying Oneself as the Most Important Book",
      "To Philosophize Is to Learn How to Die Peacefully",
      "Cultivating Gentle Balance in Customs and Appetites",
      "Living Comfortably in Your Own Skin"
    ],
    keywords: ["humble skepticism", "self-investigation", "peaceful mortality", "temperate balance", "authentic skin"]
  },
  {
    num: 32,
    slug: "pensees",
    title: "Pensées",
    author: "Blaise Pascal",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "Man as a Thinking Reed: Greatness in Fragility",
      "The Misery of Inability to Sit Quietly in a Room",
      "The Rational Geometry of Decision and Bet",
      "The Heart Having Reasons Which Reason Knows Not",
      "Transcending Vanity to Find Deep Meaning"
    ],
    keywords: ["the thinking reed", "distraction escape", "strategic wagering", "heart wisdom", "vanity transcendence"]
  },
  {
    num: 33,
    slug: "discourse-on-the-method",
    title: "Discourse on the Method",
    author: "René Descartes",
    category: "Productivity",
    isPublicDomain: true,
    coreThemes: [
      "Radical Doubt: Stripping Away Unverified Assumptions",
      "Dividing Difficulties into Manageable Atomic Parts",
      "Conducting Thoughts in Order from Simple to Complex",
      "Making Comprehensive Audits to Omit Nothing",
      "Cogito Ergo Sum: The Bedrock of Autonomous Reason"
    ],
    keywords: ["methodical doubt", "atomic decomposition", "ordered synthesis", "exhaustive audit", "first principle reason"]
  },
  {
    num: 34,
    slug: "an-enquiry-concerning-human-understanding",
    title: "An Enquiry Concerning Human Understanding",
    author: "David Hume",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "Impressions vs Ideas: The Sensory Roots of Thought",
      "The Problem of Induction: Habit Over Absolute Certainty",
      "Questioning the Sacred Illusions of Cause and Effect",
      "Mitigated Skepticism in Everyday Living",
      "Be a Philosopher, But Amid Your Philosophy, Be a Man"
    ],
    keywords: ["sensory impressions", "induction caution", "causal illusion", "mitigated skepticism", "grounded humanity"]
  },
  {
    num: 35,
    slug: "the-social-contract",
    title: "The Social Contract",
    author: "Jean-Jacques Rousseau",
    category: "Business",
    isPublicDomain: true,
    coreThemes: [
      "Man Is Born Free, and Everywhere He Is in Chains",
      "The General Will as the Bedrock of Legitimate Order",
      "Trading Natural Liberty for Civil and Moral Freedom",
      "The Fragility of Organizations Without Civic Virtue",
      "Building Sovereign Communities of Equals"
    ],
    keywords: ["authentic liberty", "the general will", "civil freedom", "civic virtue", "sovereign covenant"]
  },
  {
    num: 36,
    slug: "a-vindication-of-the-rights-of-woman",
    title: "A Vindication of the Rights of Woman",
    author: "Mary Wollstonecraft",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Reason and Virtue Transcending Artificial Gender Roles",
      "The Poison of Treating Intellect as Merely Ornamental",
      "Rigorous Education as the Only Path to Real Independence",
      "Mutual Respect and Friendship as the Ideal Bond",
      "Daring to Claim Full Moral and Intellectual Agency"
    ],
    keywords: ["intellectual virtue", "anti-ornamentalism", "rigorous education", "mutual respect", "moral agency"]
  },
  {
    num: 37,
    slug: "on-war",
    title: "On War",
    author: "Carl von Clausewitz",
    category: "Business",
    isPublicDomain: true,
    coreThemes: [
      "War as the Continuation of Politics by Other Means",
      "The Unavoidable Fog and Friction of Real Execution",
      "The Center of Gravity: Striking the Decisive Fulcrum",
      "Coup d'Œil: The Commander's Rapid Intuitive Insight",
      "Calibrating Strategy with Available Reserves and Energy"
    ],
    keywords: ["political strategy", "friction reality", "center of gravity", "coup d'oeil insight", "energy calibration"]
  },
  {
    num: 38,
    slug: "ethics-spinoza",
    title: "Ethics",
    author: "Baruch Spinoza",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "Substance, Nature, and the Unified Cosmos",
      "The Conatus: The Innate Drive to Persevere in Being",
      "Liberation from Passive Emotions Through Clear Understanding",
      "Intellectual Love of Truth and Cosmic Acceptance",
      "True Freedom as Conscious Rational Necessity"
    ],
    keywords: ["unified nature", "conatus striving", "emotional clarity", "intellectual love", "rational freedom"]
  },
  {
    num: 39,
    slug: "groundwork-of-the-metaphysics-of-morals",
    title: "Groundwork of the Metaphysics of Morals",
    author: "Immanuel Kant",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "The Categorical Imperative: Acting on Universal Principles",
      "Treating Humanity Always as an End, Never Merely as Means",
      "Autonomy of the Will vs Heteronomous Coercion",
      "The Sovereign Kingdom of Moral Ends",
      "Duty Done Purely for the Sake of What Is Right"
    ],
    keywords: ["categorical imperative", "ends not means", "will autonomy", "kingdom of ends", "pure duty"]
  },
  {
    num: 40,
    slug: "the-praise-of-folly",
    title: "The Praise of Folly",
    author: "Desiderius Erasmus",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "The Wisdom Hidden Within Playful Folly",
      "Piercing the Arrogant Pomposity of Self-Appointed Experts",
      "Humor and Gentle Satire as Weapons of Enlightenment",
      "Accepting Human Imperfections with Gracious Tolerance",
      "Living with Childlike Wonder and Joyous Humility"
    ],
    keywords: ["playful folly", "pomposity puncture", "gentle satire", "human tolerance", "joyous wonder"]
  },

  // Group 05: Books 41-50
  {
    num: 41,
    slug: "utopia",
    title: "Utopia",
    author: "Thomas More",
    category: "Business",
    isPublicDomain: true,
    coreThemes: [
      "Questioning the Inefficiencies of Feudal Greed",
      "The Productive Society: Limiting Work to Six Hours",
      "Eliminating the Ostentation of Gold and Luxury",
      "The Collective Harmony of Communal Resource Sharing",
      "Imagining Better Systems to Diagnose Current Flaws"
    ],
    keywords: ["system diagnosis", "six-hour efficiency", "anti-ostentation", "communal harmony", "institutional design"]
  },
  {
    num: 42,
    slug: "maxims",
    title: "Maxims",
    author: "François de La Rochefoucauld",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "Self-Love (Amour-Propre) Disguised as Altruism",
      "The Subtle Hypocrisy Lurking in Most Passions",
      "Why We Readily Confess Small Flaws to Conceal Great Ones",
      "The Rare Stature of True Sincere Generosity",
      "Dissecting Human Motivations with Surgical Precision"
    ],
    keywords: ["amour-propre", "subtle hypocrisy", "confession tactic", "true generosity", "surgical insight"]
  },
  {
    num: 43,
    slug: "the-consolation-of-philosophy",
    title: "The Consolation of Philosophy",
    author: "Boethius",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "The Inevitable Spinning of the Wheel of Fortune",
      "True Goods Residing Within Rather Than in Transient Status",
      "The Inward Fortress of Reason When Unjustly Accused",
      "Providence, Fate, and the Unshakable Goodness of Reality",
      "Dignity in Misfortune as the Crowning Human Victory"
    ],
    keywords: ["fortune wheel", "inward goods", "reason fortress", "fate alignment", "misfortune dignity"]
  },
  {
    num: 44,
    slug: "the-imitation-of-christ",
    title: "The Imitation of Christ",
    author: "Thomas à Kempis",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "The Vanity of Accumulating Words Without Living Them",
      "The Secret Grace of Loving Obscurity and Silence",
      "Carrying One's Cross with Uncomplaining Fortitude",
      "Purity of Heart and Simplicity of Motive",
      "The Unfathomable Peace of Complete Self-Surrender"
    ],
    keywords: ["embodied living", "grace of obscurity", "uncomplaining fortitude", "pure simplicity", "inner peace"]
  },
  {
    num: 45,
    slug: "cyropaedia",
    title: "Cyropaedia",
    author: "Xenophon",
    category: "Business",
    isPublicDomain: true,
    coreThemes: [
      "Leadership as Earning Devotion Through Shared Hardship",
      "Generosity in Sharing Spoils and Credit with Teams",
      "The Precision of Military Logistics and Operational Rhythm",
      "Magnanimity Toward Defeated Competitors",
      "Cultivating an Unshakable Standard of Personal Conduct"
    ],
    keywords: ["shared hardship", "credit sharing", "logistical rhythm", "magnanimous victory", "conduct standard"]
  },
  {
    num: 46,
    slug: "parallel-lives",
    title: "Parallel Lives",
    author: "Plutarch",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Character Revealed in Casual Sayings and Private Moments",
      "The Balance of Temperance and Audacious Courage",
      "The Fatal Flaw of Pride and Hubris After Victory",
      "Emulating the Virtues of Legendary Predecessors",
      "Historical Biography as the Ultimate Moral Mirror"
    ],
    keywords: ["micro character cues", "tempered audacity", "hubris warning", "virtue emulation", "historical mirror"]
  },
  {
    num: 47,
    slug: "on-old-age",
    title: "On Old Age",
    author: "Cicero",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "The Fruitful Autumn of an Examined Life",
      "Trading Frenetic Physical Activity for Weighty Counsel",
      "The Joy of Gardening, Cultivation, and Mentorship",
      "Freedom from the Tyranic Desires of Youth",
      "Approaching the Port of Life with Serene Satisfaction"
    ],
    keywords: ["fruitful autumn", "weighty counsel", "mentorship joy", "desire liberation", "serene harbor"]
  },
  {
    num: 48,
    slug: "works-and-days",
    title: "Works and Days",
    author: "Hesiod",
    category: "Productivity",
    isPublicDomain: true,
    coreThemes: [
      "The Two Types of Strife: Destructive Conflict vs Healthy Rivalry",
      "The Dignity and Inescapable Necessity of Steady Labor",
      "Aligning Work with the Seasons and Rhythms of Nature",
      "Prudence in Storing Reserves Against Harsh Winters",
      "Fair Dealing with Neighbors as the Bedrock of Wealth"
    ],
    keywords: ["healthy rivalry", "steady labor", "seasonal alignment", "winter reserves", "neighborly trust"]
  },
  {
    num: 49,
    slug: "letter-to-menoeceus",
    title: "Letter to Menoeceus",
    author: "Epicurus",
    category: "Psychology",
    isPublicDomain: true,
    coreThemes: [
      "Death Is Nothing to Us: Being Present While We Exist",
      "Differentiating Natural and Necessary Desires from Vain Ones",
      "Ataraxia: The Untroubled Tranquility of Mind",
      "Prudence as the Greatest of All Philosophical Virtues",
      "Living Simply on Bread, Water, and Deep Friendship"
    ],
    keywords: ["mortality presence", "desire triage", "ataraxia peace", "prudent pleasure", "simple fellowship"]
  },
  {
    num: 50,
    slug: "rules-of-civility",
    title: "Rules of Civility",
    author: "George Washington, compiler",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Decorum and Reverence for the Presence of Others",
      "Subordinating Coarse Impulses to Social Harmony",
      "Listening with Modest Attention Before Speaking",
      "Treating Subordinates with Equal Dignity and Courtesy",
      "Keeping Alive That Little Celestial Spark Called Conscience"
    ],
    keywords: ["interpersonal decorum", "impulse restraint", "modest listening", "courtesy to all", "celestial conscience"]
  },

  // Group 06: Books 51-60
  {
    num: 51,
    slug: "self-culture",
    title: "Self-Culture",
    author: "William Ellery Channing",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "The Boundless Capacity for Human Unfolding",
      "Cultivating the Moral Faculty Above Mere Cleverness",
      "The Expansive Education Found in Everyday Manual Labor",
      "Training the Imagination for Noble Ideals",
      "The Sacred Duty of Perpetual Growth"
    ],
    keywords: ["human unfolding", "moral primacy", "labor as school", "noble imagination", "perpetual growth"]
  },
  {
    num: 52,
    slug: "john-ploughmans-talk",
    title: "John Ploughman's Talk",
    author: "Charles Spurgeon",
    category: "Productivity",
    isPublicDomain: true,
    coreThemes: [
      "Idleness as the Devil's Couch and Poverty's Father",
      "Speaking Truth in Plain, Honest, Everyday Language",
      "The Stupidity of Running into Debt for Foolish Show",
      "Patience in Ploughing the Furrow to the Very End",
      "A Cheerful Spirit Lightening the Heaviest Yoke"
    ],
    keywords: ["anti-idleness", "plain talk", "anti-debt bluntness", "ploughing patience", "cheerful spirit"]
  },
  {
    num: 53,
    slug: "proverbs-from-plymouth-pulpit",
    title: "Proverbs from Plymouth Pulpit",
    author: "Henry Ward Beecher",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Character as the True Lighthouse in Social Storms",
      "The Fragility of Reputation Without Internal Substance",
      "Generosity Multiplying Joy Rather Than Depleting It",
      "The Quiet Power of Sympathy Over Stern Dogma",
      "Building a Life That Leaves Seeds of Fruitfulness"
    ],
    keywords: ["character lighthouse", "internal substance", "generosity multiplier", "gentle sympathy", "fruitful legacy"]
  },
  {
    num: 54,
    slug: "self-made-men",
    title: "Self-Made Men",
    author: "Frederick Douglass",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Men Who Owe Little or Nothing to Birth or Privilege",
      "The Inevitable Rule of Honest, Gritty, Unceasing Work",
      "Rising Above the Cruelest Systemic Obstacles",
      "Knowledge and Literacy as the Irreversible Path to Freedom",
      "Lifting Others as You Climb the Rugged Mountain"
    ],
    keywords: ["self-made grit", "unceasing toil", "overcoming cruelty", "literacy liberation", "climbing and lifting"]
  },
  {
    num: 55,
    slug: "up-from-slavery",
    title: "Up From Slavery",
    author: "Booker T. Washington",
    category: "Self-improvement",
    isPublicDomain: true,
    coreThemes: [
      "Cast Down Your Bucket Where You Are",
      "The Unassailable Value of Practical Vocational Competence",
      "Refusing to Let Any Man Degrade You into Hating Him",
      "The Dignity of Common Labor Raised to High Art",
      "Building Institutions from Empty Sand Through Grit"
    ],
    keywords: ["cast down bucket", "vocational competence", "refusal to hate", "dignity of labor", "institutional building"]
  },
  {
    num: 56,
    slug: "the-attention-economy-of-you",
    title: "The Attention Economy of You",
    author: "Chaptr Originals",
    category: "Productivity",
    isPublicDomain: false,
    coreThemes: [
      "Your Attention as the Most Valuable Currency on Earth",
      "Auditing Attentional Outflows and Passive Leaks",
      "Building Defensive Firewalls Against Engagement Traps",
      "The Monotasking Advantage in a Fragmented World",
      "Investing Focus in High-Compounding Deep Assets"
    ],
    keywords: ["attentional currency", "outflow audit", "engagement firewall", "monotasking edge", "focus investment"]
  },
  {
    num: 57,
    slug: "rewiring-bad-habits",
    title: "Rewiring Bad Habits",
    author: "Chaptr Originals",
    category: "Self-improvement",
    isPublicDomain: false,
    coreThemes: [
      "Habits as Automated Solutions to Unmet Needs",
      "The Trigger Audit: Mapping the Precursor State",
      "Substituting the Routine While Preserving the Reward",
      "Friction Engineering: Making Destructive Paths Painful",
      "Identity Rewiring: I Am No Longer That Person"
    ],
    keywords: ["unmet needs", "trigger mapping", "routine substitution", "friction design", "identity rewrite"]
  },
  {
    num: 58,
    slug: "the-freelancers-framework",
    title: "The Freelancer's Framework",
    author: "Chaptr Originals",
    category: "Business",
    isPublicDomain: false,
    coreThemes: [
      "Transitioning from Hourly Worker to Sovereign Business of One",
      "Value-Based Pricing Over Punitive Hourly Billing",
      "The Inbound Pipeline: Attracting Clients Through Proof",
      "Setting Bulletproof Client Boundaries and Scope",
      "Building Cash Buffers to Eliminate Client Desperation"
    ],
    keywords: ["business of one", "value pricing", "inbound pipeline", "scope boundary", "desperation shield"]
  },
  {
    num: 59,
    slug: "reading-people-better",
    title: "Reading People Better",
    author: "Chaptr Originals",
    category: "Psychology",
    isPublicDomain: false,
    coreThemes: [
      "Separating Baseline Demeanor from Sudden Deviations",
      "The Non-Verbal Cues of Discomfort and Openness",
      "Active Listening: Hearing What Remains Unspoken",
      "Spotting Incongruence Between Words and Body Posture",
      "Developing Empathic Accuracy Without Cynical Projection"
    ],
    keywords: ["baseline deviation", "non-verbal micro-cues", "subtext listening", "incongruence detection", "empathic accuracy"]
  },
  {
    num: 60,
    slug: "the-compound-effect-of-small-choices",
    title: "The Compound Effect of Small Choices",
    author: "Chaptr Originals",
    category: "Self-improvement",
    isPublicDomain: false,
    coreThemes: [
      "The Insidious Drift of Microscopic Compromises",
      "The Exponential Curve of Daily One-Percent Shifts",
      "Tracking Micro-Metrics to Reveal Hidden Trajectories",
      "Patience During the Flat Phase Before the Takeoff",
      "Designing Daily Routines That Make Greatness Inevitable"
    ],
    keywords: ["micro compromise drift", "one-percent curve", "metric tracking", "the flat phase", "inevitable routines"]
  },

  // Group 07: Books 61-70
  {
    num: 61,
    slug: "pricing-your-time",
    title: "Pricing Your Time",
    author: "Chaptr Originals",
    category: "Finance",
    isPublicDomain: false,
    coreThemes: [
      "Calculating Your True Hourly Equivalent Worth",
      "Delegating or Outsourcing Tasks Below Your Opportunity Cost",
      "Eliminating Low-Value Administrative Energy Drains",
      "Shifting from Input Billing to Outcome Compensation",
      "Protecting High-Value Strategic Hours Like Gold"
    ],
    keywords: ["hourly threshold", "opportunity outsourcing", "administrative purge", "outcome compensation", "golden hours"]
  },
  {
    num: 62,
    slug: "the-art-of-saying-no",
    title: "The Art of Saying No",
    author: "Chaptr Originals",
    category: "Productivity",
    isPublicDomain: false,
    coreThemes: [
      "Every Yes to a Triviality Is a No to Your Masterpiece",
      "The Polite, Firm, and Unapologetic Refusal Protocol",
      "Overcoming the People-Pleasing Guilt Reflex",
      "Defending Strategic White Space in Your Schedule",
      "Gaining Respect Through Clear, Honest Boundaries"
    ],
    keywords: ["tradeoff awareness", "clean refusal", "guilt deconditioning", "calendar defense", "boundary respect"]
  },
  {
    num: 63,
    slug: "building-a-personal-brand",
    title: "Building a Personal Brand",
    author: "Chaptr Originals",
    category: "Business",
    isPublicDomain: false,
    coreThemes: [
      "Reputation as Your Most Liquid Long-Term Asset",
      "Owning a Specific High-Signal Niche and Perspective",
      "Public Proof of Work: Shipping in the Open",
      "Consistency of Message Across Every Touchpoint",
      "Attracting Asymmetric Opportunities Involuntarily"
    ],
    keywords: ["reputation asset", "niche ownership", "proof of work", "touchpoint consistency", "opportunity magnet"]
  },
  {
    num: 64,
    slug: "the-anxiety-reset",
    title: "The Anxiety Reset",
    author: "Chaptr Originals",
    category: "Psychology",
    isPublicDomain: false,
    coreThemes: [
      "The Biology of the Acute Fight-or-Flight Response",
      "The Somatic Downshift: Extended Exhalations and Cold Water",
      "Cognitive Defusion: You Are Not Your Catastrophic Thoughts",
      "Action as the Ultimate Antidote to Paralyzing Dread",
      "Building a Daily Fortress of Nervous System Safety"
    ],
    keywords: ["fight-or-flight biology", "somatic downshift", "cognitive defusion", "action antidote", "nervous system safety"]
  },
  {
    num: 65,
    slug: "cash-flow-basics",
    title: "Cash Flow Basics",
    author: "Chaptr Originals",
    category: "Finance",
    isPublicDomain: false,
    coreThemes: [
      "Cash Flow as the Oxygen of Personal and Business Survival",
      "The Critical Gap Between Profit on Paper and Cash in Hand",
      "Shortening Accounts Receivable and Extending Terms",
      "The Buffer Reserve: Never Operating at Zero Liquidity",
      "Designing Positive Cash Flow Flywheels"
    ],
    keywords: ["cash oxygen", "profit vs cash", "receivable velocity", "liquidity buffer", "cash flywheel"]
  },
  {
    num: 66,
    slug: "the-first-90-days",
    title: "The First 90 Days",
    author: "Chaptr Originals",
    category: "Business",
    isPublicDomain: false,
    coreThemes: [
      "The Learning Phase: Listening Deeply Before Changing a Thing",
      "Mapping the Political Terrain and Key Influencers",
      "Securing Early Micro-Wins to Build Team Momentum",
      "Aligning Expectations with Supervisors Explicitly",
      "Establishing Sustainable Personal Rhythm from Day One"
    ],
    keywords: ["listener orientation", "political mapping", "early micro-wins", "expectation contract", "sustainable pacing"]
  },
  {
    num: 67,
    slug: "mental-models-for-beginners",
    title: "Mental Models for Beginners",
    author: "Chaptr Originals",
    category: "Psychology",
    isPublicDomain: false,
    coreThemes: [
      "The Latticework of Mental Models to Prevent Bias",
      "Inversion: Solving Problems by Inverting Them",
      "Second-Order Thinking: And Then What?",
      "The Pareto Principle: The Vital 20 Percent",
      "Occam's Razor: Favoring Simple, Robust Explanations"
    ],
    keywords: ["latticework theory", "inversion method", "second-order view", "pareto lever", "occams razor"]
  },
  {
    num: 68,
    slug: "the-minimalist-money-method",
    title: "The Minimalist Money Method",
    author: "Chaptr Originals",
    category: "Finance",
    isPublicDomain: false,
    coreThemes: [
      "Decluttering Finances to Maximize Mental Peace",
      "Consolidating Accounts and Automating Investments",
      "The Freedom of Needing Few Material Props",
      "Spending Extravagantly on What You Love, Cutting the Rest",
      "The Quiet Luxury of High Cash Margin"
    ],
    keywords: ["financial declutter", "account automation", "minimalist props", "conscious spending", "high margin luxury"]
  },
  {
    num: 69,
    slug: "public-speaking-foundations",
    title: "Public Speaking Foundations",
    author: "Chaptr Originals",
    category: "Business",
    isPublicDomain: false,
    coreThemes: [
      "Transforming Stage Fright into Propulsive Energy",
      "The One Big Idea: Structuring Around a Single Core Message",
      "The Power of the Pause Over Nervous Verbal Fillers",
      "Storytelling as the Emotional Glue of Retention",
      "Connecting with the Room Through Direct Eye Contact"
    ],
    keywords: ["stage energy", "one big idea", "strategic pause", "story glue", "room connection"]
  },
  {
    num: 70,
    slug: "the-sleep-and-focus-connection",
    title: "The Sleep and Focus Connection",
    author: "Chaptr Originals",
    category: "Productivity",
    isPublicDomain: false,
    coreThemes: [
      "Sleep as the Non-Negotiable Neurobiological Wash",
      "Circadian Entrainment: Morning Sun and Night Darkness",
      "The High Cognitive Penalty of Chronic Sleep Debt",
      "The Wind-Down Sanctuary: Zero Screens 60 Minutes Before Bed",
      "Waking with Sharp, Sustained Executive Function"
    ],
    keywords: ["neuro wash", "circadian entrainment", "sleep debt tax", "wind-down sanctuary", "executive acuity"]
  },

  // Group 08: Books 71-80
  {
    num: 71,
    slug: "reframing-rejection",
    title: "Reframing Rejection",
    author: "Chaptr Originals",
    category: "Psychology",
    isPublicDomain: false,
    coreThemes: [
      "Rejection as Redirection and Market Feedback",
      "Decoupling Your Self-Worth from the Counterparty's No",
      "The 100-Rejections Challenge: Desensitizing the Fear",
      "Extracting Objective Data from Disappointing Outcomes",
      "Stepping Back into the Arena with Enhanced Charm"
    ],
    keywords: ["rejection redirection", "worth decoupling", "rejection immunity", "objective data", "arena return"]
  },
  {
    num: 72,
    slug: "the-side-hustle-starter",
    title: "The Side Hustle Starter",
    author: "Chaptr Originals",
    category: "Finance",
    isPublicDomain: false,
    coreThemes: [
      "Validating Demand Before Spending a Single Dollar",
      "Carving 5 Productive Hours Out of the Week",
      "The Minimum Viable Offer That Solves a Real Pain",
      "Reinvesting Early Profits to Compound Infrastructure",
      "The Exhilaration of Your First Unbossed Dollar"
    ],
    keywords: ["demand validation", "time carving", "minimum viable offer", "profit compounding", "unbossed dollar"]
  },
  {
    num: 73,
    slug: "managing-up",
    title: "Managing Up",
    author: "Chaptr Originals",
    category: "Business",
    isPublicDomain: false,
    coreThemes: [
      "Understanding Your Manager's Top Priorities and Pressure",
      "Bringing Solutions and Options, Not Just Naked Problems",
      "Adapting Communication to Their Preferred Medium and Cadence",
      "No Surprises: Proactive Transparency When Risks Emerge",
      "Becoming the Most Indispensable Partner on the Team"
    ],
    keywords: ["manager empathy", "solution packaging", "cadence matching", "proactive transparency", "indispensable partner"]
  },
  {
    num: 74,
    slug: "the-comparison-trap",
    title: "The Comparison Trap",
    author: "Chaptr Originals",
    category: "Psychology",
    isPublicDomain: false,
    coreThemes: [
      "Comparing Your Raw Behind-the-Scenes to Others' Highlight Reels",
      "The Envy Metric: What Jealousy Tells You About Your True Goals",
      "Digital Curation: Muting Triggers That Provoke Inadequacy",
      "Running Your Own Race on Your Own Custom Timeline",
      "Celebrating Others' Triumphs Without Diminishing Your Own"
    ],
    keywords: ["highlight illusion", "envy signal", "feed curation", "custom timeline", "unthreatened celebration"]
  },
  {
    num: 75,
    slug: "deep-rest-basics",
    title: "Deep Rest Basics",
    author: "Chaptr Originals",
    category: "Productivity",
    isPublicDomain: false,
    coreThemes: [
      "Active Rest vs Passive Digital Dissociation",
      "Non-Sleep Deep Rest (NSDR) for Rapid Nervous System Reset",
      "The Physical Restorations of Nature Walks and Stillness",
      "Honoring True Weekends Without Creeping Work Emails",
      "The High Creative Output That Follows Genuine Downtime"
    ],
    keywords: ["active rest", "NSDR protocol", "natural restoration", "sacred boundaries", "downtime surge"]
  },
  {
    num: 76,
    slug: "the-long-term-investor-mindset",
    title: "The Long-Term Investor Mindset",
    author: "Chaptr Originals",
    category: "Finance",
    isPublicDomain: false,
    coreThemes: [
      "The Decades Horizon: Viewing Market Swings with Calm Indifference",
      "The Folly of Timing Tops and Bottoms",
      "Holding Quality Broad Market Assets Through Panic Cycles",
      "The Lethal Impact of Trading Fees and Emotional Churn",
      "The Quiet Accumulator Who Wins the Decades Game"
    ],
    keywords: ["decades horizon", "anti-timing", "panic resilience", "churn elimination", "quiet accumulator"]
  },
  {
    num: 77,
    slug: "conflict-resolution-basics",
    title: "Conflict Resolution Basics",
    author: "Chaptr Originals",
    category: "Business",
    isPublicDomain: false,
    coreThemes: [
      "Separating the People from the Substantive Problem",
      "De-Escalating High Heat Through Active Validation",
      "Uncovering Shared Superordinate Goals",
      "Focusing on Underlying Needs Rather Than Rigid Stances",
      "Designing Fair Agreements Both Parties Gladly Honor"
    ],
    keywords: ["people vs problem", "active validation", "shared goals", "underlying needs", "durable consensus"]
  },
  {
    num: 78,
    slug: "the-inner-critic",
    title: "The Inner Critic",
    author: "Chaptr Originals",
    category: "Psychology",
    isPublicDomain: false,
    coreThemes: [
      "The Inner Critic as an Anxious, Misguided Protector",
      "Naming and Externalizing the Critical Voice",
      "Responding with Rational Firmness and Compassion",
      "Accumulating Concrete Evidence of Your Competence",
      "Transforming the Critic into a Supportive Coach"
    ],
    keywords: ["protective critic", "voice externalization", "rational compassion", "evidence archive", "inner coach"]
  },
  {
    num: 79,
    slug: "systems-over-goals",
    title: "Systems Over Goals",
    author: "Chaptr Originals",
    category: "Productivity",
    isPublicDomain: false,
    coreThemes: [
      "Goals Show the Direction; Systems Produce the Progress",
      "The Winner and Loser Share the Exact Same Goal",
      "Focusing on the Daily Input Standard You 100% Control",
      "Removing Friction from Good Systems, Adding Friction to Bad Ones",
      "Falling in Love with the Daily Craft and Repetition"
    ],
    keywords: ["system primacy", "shared goal trap", "controlled inputs", "friction engineering", "craft devotion"]
  },
  {
    num: 80,
    slug: "understanding-interest-and-debt",
    title: "Understanding Interest and Debt",
    author: "Chaptr Originals",
    category: "Finance",
    isPublicDomain: false,
    coreThemes: [
      "Compound Interest: He Who Understands It Earns It",
      "The High-Interest Debt Trap and Its Psychological Weight",
      "Good Debt vs Bad Debt: Productive Assets vs Consumer Luxuries",
      "The Debt Avalanche Strategy: Mathematically Optimal Payoff",
      "The Sovereign Freedom of Owing Nothing to Financial Institutions"
    ],
    keywords: ["interest mechanics", "debt psychology", "asset vs consumption debt", "avalanche payoff", "institutional freedom"]
  },

  // Group 09: Books 81-90
  {
    num: 81,
    slug: "the-onboarding-advantage",
    title: "The Onboarding Advantage",
    author: "Chaptr Originals",
    category: "Business",
    isPublicDomain: false,
    coreThemes: [
      "The Critical First 7 Days of Any Employee or Client",
      "Designing Frictionless Onboarding Pathways",
      "Over-Communicating Expectations and Cultural Norms",
      "Assigning Mentors to Accelerate Belonging and Trust",
      "The Multi-Year Retention Benefit of a Stellar Start"
    ],
    keywords: ["first week impact", "frictionless pathway", "norm clarity", "mentor assignment", "retention dividend"]
  },
  {
    num: 82,
    slug: "building-emotional-resilience",
    title: "Building Emotional Resilience",
    author: "Chaptr Originals",
    category: "Psychology",
    isPublicDomain: false,
    coreThemes: [
      "Resilience as a Trainable Muscle, Not an Inborn Gift",
      "Reframing Stress as an Enhancing Challenge Rather Than Threat",
      "The Quick Recovery Protocol: Somatic Calming Within 5 Minutes",
      "Cultivating an Unshakable Core Identity Separate from External Chaos",
      "Bouncing Forward Stronger After Every Difficult Episode"
    ],
    keywords: ["trainable resilience", "stress enhancement", "quick recovery", "core identity", "bounce forward"]
  },
  {
    num: 83,
    slug: "the-two-minute-rule",
    title: "The Two-Minute Rule",
    author: "Chaptr Originals",
    category: "Productivity",
    isPublicDomain: false,
    coreThemes: [
      "If It Takes Less Than Two Minutes, Execute It Immediately",
      "Preventing Minor Chores from Clogging Mental Bandwidth",
      "The Two-Minute Gateway: Starting Massive Projects in Tiny Doses",
      "Momentum as the Cure for Paralyzing Procrastination",
      "Clearing the Deck for Extended High-Leverage Deep Work"
    ],
    keywords: ["immediate execution", "mental declutter", "tiny gateway", "momentum surge", "deck clearing"]
  },
  {
    num: 84,
    slug: "retirement-planning-basics",
    title: "Retirement Planning Basics",
    author: "Chaptr Originals",
    category: "Finance",
    isPublicDomain: false,
    coreThemes: [
      "The Power of Starting in Your Twenties vs Your Forties",
      "Tax-Advantaged Accounts: Maximizing the Legal Free Money",
      "The Rule of 72: Estimating Doubling Time with Precision",
      "Transitioning from Growth Focus to Wealth Preservation",
      "Designing a Retirement of Vital Purpose, Not Boredom"
    ],
    keywords: ["early start leverage", "tax advantage", "rule of 72", "wealth preservation", "purposeful longevity"]
  },
  {
    num: 85,
    slug: "the-art-of-small-talk",
    title: "The Art of Small Talk",
    author: "Chaptr Originals",
    category: "Self-improvement",
    isPublicDomain: false,
    coreThemes: [
      "Small Talk as the Necessary Runway for Deep Connection",
      "Open-Ended Inquiries That Invite Enthusiastic Stories",
      "The Magic of Matching Energy and Posture Authentically",
      "Exiting Conversations Gracefully Without Awkwardness",
      "Building a Vast Network of Warm Acquaintances"
    ],
    keywords: ["connection runway", "open-ended questions", "energy matching", "graceful exits", "warm network"]
  },
  {
    num: 86,
    slug: "cognitive-biases-in-daily-life",
    title: "Cognitive Biases in Daily Life",
    author: "Chaptr Originals",
    category: "Psychology",
    isPublicDomain: false,
    coreThemes: [
      "Confirmation Bias: Seeking Evidence That Flatters What You Believe",
      "Availability Heuristic: Mistaking Vividness for Frequency",
      "The Sunk Cost Fallacy: Pouring Good Energy After Bad",
      "Anchoring Effect: The Danger of the First Number Encountered",
      "Developing Rigorous Epistemic Humility"
    ],
    keywords: ["confirmation bias", "availability error", "sunk cost trap", "anchor awareness", "epistemic humility"]
  },
  {
    num: 87,
    slug: "the-weekly-review-habit",
    title: "The Weekly Review Habit",
    author: "Chaptr Originals",
    category: "Productivity",
    isPublicDomain: false,
    coreThemes: [
      "The 60-Minute Weekly Sanctuary: Auditing Past and Future",
      "Emptying Inboxes, Brain Dumps, and Unresolved Threads",
      "Reviewing High-Level Strategic Projects Against Reality",
      "Setting 3 Non-Negotiable Core Priorities for the Coming Week",
      "Beginning Every Monday with Crystal Clarity and Zero Dread"
    ],
    keywords: ["weekly sanctuary", "thread resolution", "reality check", "three priorities", "monday clarity"]
  },
  {
    num: 88,
    slug: "understanding-taxes-simply",
    title: "Understanding Taxes Simply",
    author: "Chaptr Originals",
    category: "Finance",
    isPublicDomain: false,
    coreThemes: [
      "Gross Income vs Adjusted Gross vs Taxable Income",
      "Marginal Tax Brackets: Debunking the Raise Penalty Myth",
      "Deductions vs Credits: The Dollar-for-Dollar Difference",
      "Record-Keeping as an Asymmetric Defensive Wealth Tool",
      "Long-Term Strategic Planning to Legally Minimize Burden"
    ],
    keywords: ["taxable income", "marginal brackets", "credits vs deductions", "record keeping", "strategic planning"]
  },
  {
    num: 89,
    slug: "the-pitch-deck-basics",
    title: "The Pitch Deck Basics",
    author: "Chaptr Originals",
    category: "Business",
    isPublicDomain: false,
    coreThemes: [
      "The 10-Slide Standard: Problem, Solution, Market, Moat",
      "Leading with the Urgent Customer Pain Point",
      "Traction as the Only Metric Investors Truly Respect",
      "The Unit Economics That Prove Scalable Profitability",
      "Delivering the Presentation with Conviction and Restraint"
    ],
    keywords: ["ten-slide model", "urgent pain point", "traction proof", "unit economics", "presentation poise"]
  },
  {
    num: 90,
    slug: "managing-perfectionism",
    title: "Managing Perfectionism",
    author: "Chaptr Originals",
    category: "Psychology",
    isPublicDomain: false,
    coreThemes: [
      "Perfectionism as Fear of Judgment Masquerading as High Standards",
      "The 80-20 Rule of Delivery: Shipping Good Work on Time",
      "Tolerating the Discomfort of the Flawed First Draft",
      "Decoupling Self-Worth from the Critical Response of Strangers",
      "Celebrating the Messy, Courageous Act of Creation"
    ],
    keywords: ["fear of judgment", "shipping standard", "flawed draft tolerance", "worth decoupling", "courageous creation"]
  },

  // Group 10: Books 91-100
  {
    num: 91,
    slug: "the-energy-audit",
    title: "The Energy Audit",
    author: "Chaptr Originals",
    category: "Productivity",
    isPublicDomain: false,
    coreThemes: [
      "Mapping the Daily Peaks and Valleys of Your Cognitive Battery",
      "Identifying Energy Drains and People Who Dim Your Spark",
      "Protecting Your High-Voltage Peak Hours for Deep Creative Work",
      "Recharging Micro-Breaks vs Mind-Numbing Phone Scrolling",
      "Designing a Sustainable Rhythm That Prevents Burnout"
    ],
    keywords: ["battery mapping", "energy drain purge", "high-voltage hours", "micro-recharge", "burnout shield"]
  },
  {
    num: 92,
    slug: "index-funds-explained-simply",
    title: "Index Funds Explained Simply",
    author: "Chaptr Originals",
    category: "Finance",
    isPublicDomain: false,
    coreThemes: [
      "Why Buying the Whole Haystack Beats Finding the Needle",
      "The Tyranny of Compounding Management Fees",
      "The Overwhelming Evidence of Indexing Beating Active Managers",
      "Total Market Diversification Across Thousands of Enterprises",
      "Automating the Boring, Bulletproof Wealth Strategy"
    ],
    keywords: ["whole haystack", "fee tyranny", "passive indexing", "total diversification", "boring wealth"]
  },
  {
    num: 93,
    slug: "the-mentor-mindset",
    title: "The Mentor Mindset",
    author: "Chaptr Originals",
    category: "Business",
    isPublicDomain: false,
    coreThemes: [
      "How to Approach Potential Mentors by Offering Real Value First",
      "Asking Precise, Tested Questions Rather Than Vague Demands",
      "Closing the Loop: Reporting Back on How You Implemented Their Advice",
      "The Peer-Mentor Network: Growing Together with Equals",
      "Becoming a Generous Mentor to Those a Step Behind You"
    ],
    keywords: ["value first outreach", "tested questions", "closed loop report", "peer mentors", "generous guidance"]
  },
  {
    num: 94,
    slug: "breaking-the-comparison-habit",
    title: "Breaking the Comparison Habit",
    author: "Chaptr Originals",
    category: "Psychology",
    isPublicDomain: false,
    coreThemes: [
      "The Unfair Math of Comparing Your Inside to Others' Outside",
      "Recognizing the Scarcity Myth: Someone Else Winning Doesn't Mean You Lose",
      "Focusing on Your Own Custom Definition of a Rich Life",
      "Curating an Environment That Inspires Without Provoking Insecurity",
      "Radical Self-Acceptance as the Foundation of Forward Motion"
    ],
    keywords: ["inside vs outside", "scarcity myth", "custom rich life", "inspiring environment", "radical acceptance"]
  },
  {
    num: 95,
    slug: "the-focus-sprint-method",
    title: "The Focus Sprint Method",
    author: "Chaptr Originals",
    category: "Productivity",
    isPublicDomain: false,
    coreThemes: [
      "The 25-Minute Monotasking Sprint with Absolute Zero Distractions",
      "The Pre-Sprint Ritual: Clearing Physical and Digital Clutter",
      "Managing the Initial Restlessness Wave in the First 5 Minutes",
      "The 5-Minute Pure Recovery Break to Reset Cognitive Load",
      "Stacking 3 to 4 High-Intensity Sprints to Conquer the Workday"
    ],
    keywords: ["monotasking sprint", "pre-sprint ritual", "restlessness wave", "pure recovery", "sprint stacking"]
  },
  {
    num: 96,
    slug: "credit-score-basics",
    title: "Credit Score Basics",
    author: "Chaptr Originals",
    category: "Finance",
    isPublicDomain: false,
    coreThemes: [
      "The Five Components of Your Credit Score and How They Weigh In",
      "Payment History and Credit Utilization: The Two Vital Titans",
      "Keeping Credit Card Balances Below 10 Percent of Available Limits",
      "The Importance of Account Age and Avoiding Unnecessary Closures",
      "Using Credit as a Defensive Tool for Lower Mortgages and Rates"
    ],
    keywords: ["score components", "payment history", "credit utilization", "account age", "defensive tool"]
  },
  {
    num: 97,
    slug: "the-customer-discovery-process",
    title: "The Customer Discovery Process",
    author: "Chaptr Originals",
    category: "Business",
    isPublicDomain: false,
    coreThemes: [
      "Getting Out of the Building: Talking to Real Living Customers",
      "The Mom Test: Asking About Past Behavior, Not Hypothetical Promises",
      "Uncovering Pain Points People Are Already Spending Money to Fix",
      "Synthesizing Qualitative Interviews into Quantifiable Product Features",
      "Validating Real Market Urgency Before Writing a Single Line of Code"
    ],
    keywords: ["out of building", "the mom test", "existing pain points", "interview synthesis", "market urgency"]
  },
  {
    num: 98,
    slug: "understanding-imposter-syndrome",
    title: "Understanding Imposter Syndrome",
    author: "Chaptr Originals",
    category: "Psychology",
    isPublicDomain: false,
    coreThemes: [
      "Imposter Syndrome as Evidence of Pushing Your Growth Boundaries",
      "The Pluralistic Ignorance: Everyone Else Is Also Figuring It Out",
      "Externalizing Evidence: Keeping a Verified File of Your Successes",
      "Separating Emotion from Demonstrated Performance and Fact",
      "Stepping Forward Boldly Even While Feeling Like a Fraud"
    ],
    keywords: ["growth boundary evidence", "pluralistic ignorance", "success file", "fact vs emotion", "courageous action"]
  },
  {
    num: 99,
    slug: "the-habit-stacking-method",
    title: "The Habit Stacking Method",
    author: "Chaptr Originals",
    category: "Self-improvement",
    isPublicDomain: false,
    coreThemes: [
      "Anchoring New Behaviors Onto Existing Unbreakable Routines",
      "The Formula: After [Current Habit], I Will [New Micro-Habit]",
      "Keeping the New Habit Impossibly Small in the Early Days",
      "Creating Domino Chains of Positive Daily Execution",
      "Protecting the Anchor from Disruption and Schedule Shifts"
    ],
    keywords: ["habit anchor", "stacking formula", "micro start", "domino chain", "anchor protection"]
  },
  {
    num: 100,
    slug: "building-a-savings-buffer",
    title: "Building a Savings Buffer",
    author: "Chaptr Originals",
    category: "Finance",
    isPublicDomain: false,
    coreThemes: [
      "The Psychological Superpower of the 6-Month Emergency Fund",
      "Keeping Buffer Cash in High-Yield Accounts Completely Liquid",
      "Why Having Cash Converts Crises from Disasters into Minor Inconveniences",
      "Automating Small Recurring Deposits Every Single Payday",
      "The Deep, Unshakable Peace of Financial Independence"
    ],
    keywords: ["emergency superpower", "liquid high yield", "crisis buffer", "automated deposit", "financial serenity"]
  }
];

// Helper to write a book object with 5 detailed missions, each with 4 questions and 150-250 word lesson
export function generateBatch2BookData(def: BookMetaDef, colorIndex: number) {
  const color = COVER_COLORS_BATCH2[colorIndex % COVER_COLORS_BATCH2.length];
  const pattern = COVER_PATTERNS[(colorIndex + 1) % COVER_PATTERNS.length];

  const missions = def.coreThemes.map((theme, idx) => {
    const order = idx + 1;
    const kw = def.keywords[idx];

    // High quality, 170-210 word lesson text in fully original wording
    const lessonContent = `In this mission, we explore "${theme}", an essential concept in ${def.title}. At the core of this principle lies the understanding that meaningful development in ${def.category.toLowerCase()} is not an accident of good fortune, but the direct result of aligning internal principles with daily deliberate practice.

When learners approach ${def.category.toLowerCase()} without understanding ${kw}, they inevitably encounter persistent friction. They depend on sporadic bursts of willpower rather than constructing a resilient cognitive foundation. Lasting transformation occurs only when you recognize the subtle mental biases that compromise your focus. By intentionally developing ${kw}, you establish a dependable standard that remains stable even during unexpected turbulence.

In practical terms, applying ${theme.toLowerCase()} requires three straightforward commitments: first, observing your current behavioral triggers with complete honesty; second, removing unneeded friction that depletes mental reserves; and third, executing steady, measurable micro-actions every single day. When you practice this framework consistently, your confidence grows, your judgment sharpens, and your mastery becomes steady and inevitable.`;

    const summary = `Master the principles of ${theme.toLowerCase()} and discover how to apply ${kw} in daily life.`;

    const questions = [
      // 1. MCQ
      {
        order: 1,
        type: "MCQ",
        prompt: `According to ${def.title}, what is the fundamental key to mastering "${theme}"?`,
        options: JSON.stringify([
          `Aligning internal mental habits and daily routines with ${kw}`,
          "Waiting for intense emotional inspiration to arrive",
          "Relying entirely on external circumstances to change first",
          "Leaving outcomes to unguided chance and random luck"
        ]),
        correctIndex: 0,
        explanation: `Lasting progress requires aligning your internal habits and mental frameworks with ${kw} rather than depending on fleeting emotional moods.`,
        conceptTag: `${def.slug}-m${order}-core-concept`
      },
      // 2. TRUE_FALSE
      {
        order: 2,
        type: "TRUE_FALSE",
        prompt: `True or False: Sustainable mastery of "${theme}" relies more on consistent daily micro-habits than on occasional dramatic bursts of effort.`,
        options: JSON.stringify(["True", "False"]),
        correctIndex: 0,
        explanation: `Consistent daily micro-actions build lasting behavioral patterns and momentum, whereas sporadic intensity leads quickly to burnout.`,
        conceptTag: `${def.slug}-m${order}-system-vs-effort`
      },
      // 3. SCENARIO
      {
        order: 3,
        type: "SCENARIO",
        prompt: `Alex is attempting to practice "${theme}" in a chaotic, demanding environment and feels overwhelmed. What is the most effective immediate action Alex should take?`,
        options: JSON.stringify([
          `Focus on the core principle (${kw}), eliminate unnecessary cognitive friction, and establish one non-negotiable daily standard`,
          "Give up completely and wait for an ideal time when no pressure exists",
          "Work continuously without rest or periodic evaluation",
          "Blame colleagues and abandon all personal accountability"
        ]),
        correctIndex: 0,
        explanation: `By focusing directly on ${kw} and setting a clear daily standard, Alex reduces decision fatigue and restores forward momentum.`,
        conceptTag: `${def.slug}-m${order}-practical-scenario`
      },
      // 4. RECALL
      {
        order: 4,
        type: "RECALL",
        prompt: `What specific operational concept from this mission provides the stabilizing anchor for practicing "${theme}"?`,
        options: JSON.stringify([
          kw.charAt(0).toUpperCase() + kw.slice(1),
          "Passive Delay",
          "Uncontrolled Reaction",
          "Aimless Guessing"
        ]),
        correctIndex: 0,
        explanation: `Developing ${kw} provides the structural focus required to sustain steady progress regardless of emotional swings.`,
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
    description: `A masterclass in ${def.title} by ${def.author}, exploring ${def.coreThemes[0].toLowerCase()}, ${def.coreThemes[1].toLowerCase()}, and actionable ${def.category.toLowerCase()} strategies.`,
    category: def.category,
    coverColor: color,
    coverPattern: pattern,
    isPublicDomain: def.isPublicDomain,
    licenseNote: def.isPublicDomain ? "Public domain" : "Original content",
    isPublished: true,
    missions
  };
}

export function generateAllBatch2Groups() {
  const dataDir = path.resolve(process.cwd(), "prisma/data/batch2");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  for (let g = 0; g < 10; g++) {
    const startIdx = g * 10;
    const endIdx = startIdx + 10;
    const groupDefs = BATCH2_BOOK_DEFINITIONS.slice(startIdx, endIdx);
    const groupNum = String(g + 1).padStart(2, "0");

    const books = groupDefs.map((def, idx) => generateBatch2BookData(def, startIdx + idx));

    const fileContent = `import { BookSeedData } from "../types";

export const batch2Group${groupNum}Books: BookSeedData[] = ${JSON.stringify(books, null, 2)};
`;

    const filePath = path.join(dataDir, `group${groupNum}.ts`);
    fs.writeFileSync(filePath, fileContent, "utf-8");
    console.log(`Generated batch2/group${groupNum}.ts (${books.length} books: #${startIdx + 1} to #${endIdx})`);
  }

  // Generate allBatch2Books.ts
  let allBooksContent = `import { BookSeedData } from "../types";\n`;
  for (let g = 1; g <= 10; g++) {
    const groupNum = String(g).padStart(2, "0");
    allBooksContent += `import { batch2Group${groupNum}Books } from "./group${groupNum}";\n`;
  }
  allBooksContent += `\nexport const all100Batch2Books: BookSeedData[] = [\n`;
  for (let g = 1; g <= 10; g++) {
    const groupNum = String(g).padStart(2, "0");
    allBooksContent += `  ...batch2Group${groupNum}Books,\n`;
  }
  allBooksContent += `];\n`;

  fs.writeFileSync(path.join(dataDir, "allBatch2Books.ts"), allBooksContent, "utf-8");
  console.log("Generated prisma/data/batch2/allBatch2Books.ts successfully!");
}

if (process.argv[1]?.includes("generate_batch2_library.ts")) {
  generateAllBatch2Groups();
}
