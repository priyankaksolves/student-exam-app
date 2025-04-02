import { Question } from "../interfaces/Question";

interface StudentExam {
  exam: {
    questions: Question[];
    title: string;
    description: string;
  };
}

interface CodeQuestionProps {
  studentExam: StudentExam;
  currentQuestionIndex: number;
  onNext: () => void;
  onPrevious: () => void;
}

const CodeQuestion: React.FC<CodeQuestionProps> = ({
  studentExam,
  currentQuestionIndex,
  onNext,
  onPrevious,
}) => {
  const questions = studentExam.exam.questions;
  const currentQuestion = questions[currentQuestionIndex];

  const firstTestcase = currentQuestion?.test_cases?.[0];

  return (
    <div className="container mt-4"  style={{ overflow: 'auto', height: 'calc(80vh - 30px)' }}>
      <h1 className="text-center text-primary">{studentExam.exam.title}</h1>
      <p className="text-muted text-center mb-4">
        {studentExam.exam.description}
      </p>

      <div className="border rounded shadow bg-white p-4 mb-4 d-flex align-items-center justify-content-center min-vh-50">
        <div className="text-center">
          <h2 className="mb-3">Question {currentQuestionIndex + 1}</h2>
          <p className="lead">
            {questions[currentQuestionIndex].question_text}
          </p>

          {firstTestcase && (
            <div className="mt-3 p-3 bg-light rounded">
              <h5 className="text-secondary">Sample Test Case</h5>
              <p>
                <strong>Input:</strong> {firstTestcase.input}
              </p>
              <p>
                <strong>Expected Output:</strong>{" "}
                {firstTestcase.expected_output}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          onClick={onPrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>

        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CodeQuestion;
