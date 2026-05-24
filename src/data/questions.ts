export type PersonalityKey = "A" | "B" | "C" | "D" | "E";

export interface Option {
  text: string;
  type: PersonalityKey;
}

export interface Question {
  id: number;
  question: string;
  options: Option[]; // pre-shuffled so no option is always in the same position
}

export interface PersonalityType {
  key: PersonalityKey;
  name: string;
  description: string;
  color: string;        // Tailwind bg class
  lightColor: string;   // Tailwind light bg class
  textColor: string;    // Tailwind text class
  borderColor: string;  // Tailwind border class
  emoji: string;
}

export const quizTitle = "Where do I fit?";
export const quizSubtitle = "Discover your place in the community";

export const personalityTypes: PersonalityType[] = [
  {
    key: "A",
    name: "Community Builder",
    description:
      "You help people feel welcome, included, and connected.",
    color: "bg-indigo-600",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-700",
    borderColor: "border-indigo-400",
    emoji: "🤝",
  },
  {
    key: "B",
    name: "Creative Communicator",
    description:
      "You express faith through music, media, speaking, art, or creativity.",
    color: "bg-violet-600",
    lightColor: "bg-violet-50",
    textColor: "text-violet-700",
    borderColor: "border-violet-400",
    emoji: "🎨",
  },
  {
    key: "C",
    name: "Servant Heart",
    description:
      "You show love through helping, serving, and supporting others.",
    color: "bg-emerald-600",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-400",
    emoji: "🙌",
  },
  {
    key: "D",
    name: "Faith Seeker",
    description:
      "You are drawn to prayer, learning, reflection, and growing deeper with God.",
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-400",
    emoji: "✨",
  },
  {
    key: "E",
    name: "Active Connector",
    description:
      "You connect through fun, movement, activities, sports, and relaxed fellowship.",
    color: "bg-rose-500",
    lightColor: "bg-rose-50",
    textColor: "text-rose-700",
    borderColor: "border-rose-400",
    emoji: "⚡",
  },
];

// Options are shuffled per question so the order is never predictably A→B→C→D→E.
export const questions: Question[] = [
  {
    id: 1,
    question: "In a group, I usually become the…",
    options: [
      { text: "Fun one",      type: "E" },
      { text: "Welcomer",     type: "A" },
      { text: "Helper",       type: "C" },
      { text: "Idea person",  type: "B" },
      { text: "Deep thinker", type: "D" },
    ],
  },
  {
    id: 2,
    question: "I connect best through…",
    options: [
      { text: "Service",       type: "C" },
      { text: "Conversations", type: "A" },
      { text: "Activities",    type: "E" },
      { text: "Prayer",        type: "D" },
      { text: "Creativity",    type: "B" },
    ],
  },
  {
    id: 3,
    question: "People usually come to me for…",
    options: [
      { text: "Advice", type: "A" },
      { text: "Help",   type: "C" },
      { text: "Ideas",  type: "B" },
      { text: "Plans",  type: "E" },
      { text: "Prayer", type: "D" },
    ],
  },
  {
    id: 4,
    question: "I feel most alive when I am…",
    options: [
      { text: "Creating something",    type: "B" },
      { text: "Doing something fun",   type: "E" },
      { text: "Building friendships",  type: "A" },
      { text: "Learning faith",        type: "D" },
      { text: "Helping others",        type: "C" },
    ],
  },
  {
    id: 5,
    question: "In church, I'm most drawn to…",
    options: [
      { text: "Events / sports",    type: "E" },
      { text: "Service",            type: "C" },
      { text: "Community",          type: "A" },
      { text: "Music / media",      type: "B" },
      { text: "Prayer / formation", type: "D" },
    ],
  },
  {
    id: 6,
    question: "My ideal group would be…",
    options: [
      { text: "Prayerful",       type: "D" },
      { text: "Creative",        type: "B" },
      { text: "Supportive",      type: "A" },
      { text: "Active",          type: "E" },
      { text: "Service-focused", type: "C" },
    ],
  },
  {
    id: 7,
    question: "I would be most open to…",
    options: [
      { text: "Volunteering",         type: "C" },
      { text: "Sports / hangouts",    type: "E" },
      { text: "Music / media",        type: "B" },
      { text: "Fellowship group",     type: "A" },
      { text: "Bible study / prayer", type: "D" },
    ],
  },
  {
    id: 8,
    question: "My faith journey needs more…",
    options: [
      { text: "Joy",        type: "E" },
      { text: "Connection", type: "A" },
      { text: "Depth",      type: "D" },
      { text: "Action",     type: "C" },
      { text: "Expression", type: "B" },
    ],
  },
];
