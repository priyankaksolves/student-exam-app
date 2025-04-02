import { useParams, useNavigate } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import CodeQuestion from "../components/CodeQuestion";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { fetchLanguages, getCodingQuestion, startExam } from "../api";
import CountdownTimer from "../components/CountDownTimer";
import { Exam } from "../interfaces/exam";

interface StudentExam {
  exam: Exam
}

const Coding: React.FC = () => {
  const { studentExamId } = useParams();
  const [loading, setLoading] = useState(true);
  const [studentExam, setStudentExam] = useState<StudentExam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [leftTime, setLeftTime] = useState(0);
  const navigate = useNavigate();
  const [languages, setLanguages] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedLanguage, setSelectedLanguage] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const fetchQuestion = async () => {
      try {
        const data = await startExam(Number(studentExamId));
        setLeftTime(data.leftTime);
        const response = await getCodingQuestion(Number(studentExamId));
        setStudentExam(response.data.studentExamDetails);
      } catch (error: any) {
        toast.error(error.response?.data?.message || error.message);
        navigate("/");
      }
    };
    loadLanguages();
    fetchQuestion();
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [studentExamId]);

  const questions = studentExam?.exam.questions;

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
      <CountdownTimer leftTime={leftTime} studentExamId={Number(studentExamId)} />
      <div className="d-flex mt-3 mx-3 mb-2">
        <div className="w-50">
          {studentExam && (
              <CodeQuestion
                studentExam={studentExam}
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
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Coding;
