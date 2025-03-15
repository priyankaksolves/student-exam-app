export interface Question {
  question_id: number; 
  exam_id: number;
  question_text: string;
  question_type: "multiple_choice" | "multi_select" | "true_false";
  marks: number;
  correct_answer?: boolean;
  options?: Option[];  // ✅ Add this property
}

export interface Option {
  option_id: number;  
  question_id: number;
  option_text: string;
  is_correct: boolean;
}