import { addQuestion } from "../api";
import { Question } from "../interfaces/Question";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";

interface QuestionFormProps {
  examID: number;
  onQuestionsChange?: (questions: Question[]) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  examID,
  onQuestionsChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([
    {
      exam_id: examID,
      question_text: "",
      question_type: "multiple_choice",
      marks: 1,
      options: [
        { question_id: 0, option_text: "", is_correct: false },
        { question_id: 0, option_text: "", is_correct: false },
      ],
      correct_answer: undefined,
    },
  ]);

  useEffect(() => {
    if (onQuestionsChange) {
      onQuestionsChange(questions);
    }
  }, [questions, onQuestionsChange]);

  const handleChange = (index: number, field: keyof Question, value: any) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index
          ? {
              ...q,
              [field]: value,
              options:
                field === "question_type"
                  ? value === "true_false"
                    ? []
                    : [
                        { question_id: 0, option_text: "", is_correct: false },
                        { question_id: 0, option_text: "", is_correct: false },
                      ]
                  : q.options,
              correct_answer:
                field === "question_type" && value === "true_false"
                  ? false
                  : field === "correct_answer"
                  ? value
                  : q.correct_answer,
            }
          : q
      )
    );
  };

  const handleOptionChange = (
    qIndex: number,
    optIndex: number,
    value: string
  ) => {
    setQuestions((prev) => {
      const updatedQuestions = [...prev];
      if (!updatedQuestions[qIndex].options) {
        updatedQuestions[qIndex].options = [];
      }
      updatedQuestions[qIndex].options[optIndex].option_text = value;
      return updatedQuestions;
    });
  };

  const toggleCorrectOption = (qIndex: number, optIndex: number) => {
    setQuestions((prev) => {
      const updatedQuestions = [...prev];

      if (!updatedQuestions[qIndex].options) {
        updatedQuestions[qIndex].options = [];
      }

      if (updatedQuestions[qIndex].question_type === "multiple_choice") {
        updatedQuestions[qIndex].options.forEach(
          (opt, i) => (opt.is_correct = i === optIndex)
        );
      } else {
        updatedQuestions[qIndex].options[optIndex].is_correct =
          !updatedQuestions[qIndex].options[optIndex].is_correct;
      }

      return updatedQuestions;
    });
  };

  const addOption = (qIndex: number) => {
    setQuestions((prev) => {
      const updatedQuestions = [...prev];

      if (!updatedQuestions[qIndex].options) {
        updatedQuestions[qIndex].options = [];
      }

      updatedQuestions[qIndex].options.push({
        question_id: 0,
        option_text: "",
        is_correct: false,
      });

      return updatedQuestions;
    });
  };

  const addAnotherQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        exam_id: examID,
        question_text: "",
        question_type: "multiple_choice",
        marks: 1,
        options: [
          { question_id: 0, option_text: "", is_correct: false },
          { question_id: 0, option_text: "", is_correct: false },
        ],
        correct_answer: undefined,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => {
      if (prev.length === 1) {
        toast.warning("At least one question is required.");
        return prev;
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (containerRef.current) {
      const inputs = containerRef.current.querySelectorAll("input[required]");
      for (const input of Array.from(inputs)) {
        if (!(input as HTMLInputElement).checkValidity()) {
          (input as HTMLInputElement).reportValidity();
          return;
        }
      }
    }
    try {
      await addQuestion(Number(examID), questions);
      toast.success("Questions added successfully!");
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add questions.");
    }
  };

  return (
    <div ref={containerRef} className="mt-4">
      {examID !== 0 && <h2>Add Questions to Exam</h2>}
      <div className="p-4 shadow">
        {questions.map((question, qIndex) => (
          <div
            key={qIndex}
            className="mb-4 p-3 border rounded position-relative"
          >
            {questions.length > 1 && (
              <button
                type="button"
                className="btn btn-outline-secondary position-absolute top-0 end-0 m-2 p-1"
                onClick={() => removeQuestion(qIndex)}
              >
                <i className="bi bi-x"></i>{" "}
              </button>
            )}
            <h5>Question {qIndex + 1}</h5>
            <div className="mb-3">
              <label>Question Text</label>
              <input
                type="text"
                className="form-control"
                value={question.question_text}
                onChange={(e) =>
                  handleChange(qIndex, "question_text", e.target.value)
                }
                required
              />
            </div>

            <div className="row mb-3">
              <div className="col-6">
                <label>Question Type</label>
                <select
                  className="form-select"
                  value={question.question_type}
                  onChange={(e) =>
                    handleChange(qIndex, "question_type", e.target.value)
                  }
                  required
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="multi_select">Multi Select</option>
                  <option value="true_false">True/False</option>
                </select>
              </div>
              <div className="col-6">
                <label>Marks</label>
                <input
                  type="number"
                  className="form-control"
                  value={question.marks}
                  onChange={(e) =>
                    handleChange(qIndex, "marks", Number(e.target.value))
                  }
                  required
                  min="1"
                />
              </div>
            </div>

            {question.question_type === "true_false" && (
              <div className="mb-3">
                <label>Correct Answer</label>
                <div className="d-flex align-items-center mb-2">
                  <input
                    type="radio"
                    name={`true_false_${qIndex}`}
                    checked={question.correct_answer == true}
                    onChange={() =>
                      handleChange(qIndex, "correct_answer", true)
                    }
                  />
                  <label className="ms-2">True</label>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <input
                    type="radio"
                    name={`true_false_${qIndex}`}
                    checked={question.correct_answer == false}
                    onChange={() =>
                      handleChange(qIndex, "correct_answer", false)
                    }
                  />
                  <label className="ms-2">False</label>
                </div>
              </div>
            )}

            {["multiple_choice", "multi_select"].includes(
              question.question_type
            ) && (
              <div className="mb-3">
                <label>Options</label>
                {question.options?.map((opt, optIndex) => (
                  <div
                    key={optIndex}
                    className="d-flex align-items-center mb-2"
                  >
                    <input
                      type="text"
                      className="form-control me-2"
                      value={opt.option_text}
                      placeholder={`Option ${optIndex + 1}`}
                      onChange={(e) =>
                        handleOptionChange(qIndex, optIndex, e.target.value)
                      }
                      required
                    />
                    <input
                      type="checkbox"
                      checked={opt.is_correct}
                      onChange={() => toggleCorrectOption(qIndex, optIndex)}
                    />
                    <label className="ms-2">Correct</label>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => addOption(qIndex)}
                >
                  + Add Option
                </button>
              </div>
            )}
          </div>
        ))}

        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={addAnotherQuestion}
        >
          + Add Another Question
        </button>
        {examID != 0 && (
          <button
            type="submit"
            className="btn btn-success"
            onClick={handleSubmit}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionForm;
