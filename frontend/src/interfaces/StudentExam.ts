import { User } from "./User";
import { Exam } from "./exam";

export interface StudentExam {
  student_exam_id: number;
  exam_id: number;
  status: "not_started" | "in_progress" | "completed";
  start_time: string;
  end_time: string;
  score?: number;
  exam?: Exam;
}

export interface StudentExamRecord {
  student_exam_id: number;
  student: User;
  exam: Exam;
  start_time: string;
  end_time: string;
  status: string;
}