export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index into options[]
}

export const quizTitle = "Practice Quiz";
export const quizSubtitle = "Test your knowledge";

// Replace these with your actual questions and answer key.
// correctAnswer is the 0-based index of the correct option.
export const questions: Question[] = [
  {
    id: 1,
    question: "Placeholder question 1 — replace with your question.",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 0,
  },
  {
    id: 2,
    question: "Placeholder question 2 — replace with your question.",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "Placeholder question 3 — replace with your question.",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 2,
  },
];
