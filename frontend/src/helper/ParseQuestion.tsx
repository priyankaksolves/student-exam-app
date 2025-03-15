import * as XLSX from "exceljs";
import Papa from "papaparse";
import { Question } from "../interfaces/Question";

let errors: string[];
export const handleParse = async (file: File | null, exam_id: number): Promise<Question[]> => {
  errors = [];
  if (!file) return [];

  const fileType = file.name.split(".").pop()?.toLowerCase();
  let parsedQuestions: Question[] = [];

  const validateAndParse = (q: any, index: number) => {
    const question = parseQuestion(q, exam_id, index);
    if (question) {
      parsedQuestions.push(question);
    }
  };

  if (fileType === "csv") {
    return new Promise<Question[]>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });

        parsed.data.forEach((q: any, index: number) => {
          let options: any[] = [];
          for (let i = 1; i <= 4; i++) {
            if (q[`option_${i}`]) {
              options.push({
                text: q[`option_${i}`],
                is_correct: q[`is_correct_${i}?`]?.toLowerCase() === "true",
              });
            }
          }

          validateAndParse({ 
            ...q, 
            options 
          }, index + 1);
        });

        if (errors.length > 0) {
          reject(new Error(`File contains errors:\n${errors.join("\n")}`));
        } else {
          resolve(parsedQuestions);
        }
      };
      reader.readAsText(file);
    });
  } else if (fileType === "xlsx") {
    return new Promise<Question[]>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const buffer = e.target?.result as ArrayBuffer;
        const workbook = new XLSX.Workbook();
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.worksheets[0];

        worksheet.eachRow((row, rowIndex) => {
          if (rowIndex > 1) {
            let options: any[] = [];
            for (let i = 5; i <= 12; i += 2) {
              const optionText = row.getCell(i).value;
              const isCorrect = row.getCell(i + 1).value?.toString().toLowerCase() === "true";

              if (optionText) {
                options.push({ text: optionText, is_correct: isCorrect });
              }
            }

            validateAndParse({
              question_text: row.getCell(1).value,
              question_type: row.getCell(2).value,
              marks: row.getCell(3).value,
              correct_answer: row.getCell(4).value,
              options,
            }, rowIndex);
          }
        });

        if (errors.length > 0) {
          reject(new Error(`File contains errors:\n${errors.join("\n")}`));
        } else {
          resolve(parsedQuestions);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  } else {
    return Promise.reject(new Error("Unsupported file type! Please upload an Excel or CSV file."));
  }
};

const parseQuestion = (q: any, exam_id: number, index: number): Question | null => {
  const validTypes = ["multiple_choice", "multi_select", "true_false"] as const;
  const questionType = q.question_type?.trim().toLowerCase();

  if (!q.question_text) {
    errors.push(`Row ${index}: Missing question text.`);
    return null;
  }
  if (!questionType || !validTypes.includes(questionType)) {
    errors.push(`Row ${index}: Invalid or missing question type.`);
    return null;
  }

  let options: {option_id: number; question_id: number; option_text: string; is_correct: boolean }[] = [];
  let correctAnswer: boolean | null = null;

  if (questionType === "true_false") {
    if (q.correct_answer === undefined || q.correct_answer === null) {
      errors.push(`Row ${index}: Missing correct answer for true/false question.`);
      return null;
    }
    correctAnswer = q.correct_answer.toString().toLowerCase();
  } else if (questionType === "multiple_choice" || questionType === "multi_select") {

    q.options.forEach((option: any) => {
      if (option.text) {
        options.push({
          option_id: 0,
          question_id: 0,
          option_text: option.text,
          is_correct: option.is_correct,
        });
      }
    });

    if (options.length < 2) {
      errors.push(`Row ${index}: At least two options are required for ${questionType} questions.`);
      return null;
    }

    const correctOptions = options.filter(opt => opt.is_correct);
    if (questionType === "multiple_choice" && correctOptions.length !== 1) {
      errors.push(`Row ${index}: Multiple choice question must have exactly one correct answer.`);
      return null;
    }
    if (questionType === "multi_select" && correctOptions.length < 1) {
      errors.push(`Row ${index}: Multi-select question must have at least one correct answer.`);
      return null;
    }
  }

  return {
    question_id: 0,
    exam_id,
    question_text: q.question_text,
    question_type: questionType,
    marks: Number(q.marks) || 1,
    correct_answer: questionType === "true_false" ? correctAnswer ?? undefined : undefined,
    options: questionType === "multiple_choice" || questionType === "multi_select" ? options : [],
  };
};
