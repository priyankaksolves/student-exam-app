import { TestCase } from "./Testcase";
import { Option } from "./Option";

export interface Question {
  question_id: number;
  exam_id: number;
  question_text: string;
  question_type: "multiple_choice" | "multi_select" | "true_false" | "coding";
  marks: number;
  correct_answer?: boolean;
  options?: Option[];
  test_cases?: TestCase[];
}