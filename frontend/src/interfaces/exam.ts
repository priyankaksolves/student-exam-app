import { Question } from "./Question";

// Create an exam
export interface Exam {
  exam_id: number;
  title: string;
  description: string;
  duration: number;
  type: "aptitude" | "coding";
  pass_marks: number;
  created_by: number;
  is_live: boolean;
  questions: Question[];
}
