import CodeEditor from "../components/CodeEditor";
import CodeQuestion from "../components/CodeQuestion";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { fetchLanguages } from "../api";
import { Exam } from "../interfaces/exam";

interface CodingExamProps {
  studentExamId: number;
  exam: Exam;
}

const CodingExam: React.FC<CodingExamProps> = ({ exam, studentExamId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [languages, setLanguages] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedLanguage, setSelectedLanguage] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    loadLanguages();
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [studentExamId]);

  const questions = exam?.questions;

  const loadLanguages = async () => {
    try {
      const data = await fetchLanguages();
      setLanguages(data);
      setSelectedLanguage(data[8]?.id || "");
      setLoading(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };


  const handleNextQuestion = () => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const currentQuestion = questions
    ? questions[currentQuestionIndex]
    : undefined;

  if (loading) return <Spinner animation="grow" />;

  return (
    <div>
      <div className="d-flex mt-3 mx-3 mb-2">
        <div className="w-50">
          {exam && (
              <CodeQuestion
                studentExam={{exam}}
                currentQuestionIndex={currentQuestionIndex}
                onNext={handleNextQuestion}
                onPrevious={handlePreviousQuestion}
              />
          )}
        </div>
        <div className="w-50 border border-ligth h-75">
          {currentQuestion && (
            <CodeEditor
              key={currentQuestion.question_id}
              questionId={currentQuestion.question_id}
              selectedLanguage={selectedLanguage}
              languages={languages}
              setSelectedLanguage={setSelectedLanguage}
              studentExamId={studentExamId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CodingExam;
