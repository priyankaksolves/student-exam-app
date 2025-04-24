import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { declareResult, getStudentExamById, submitExam } from "../api";
import { toast } from "react-toastify";
import { Exam } from "../interfaces/exam";
import CountdownTimer from "../components/CountDownTimer";
import AptitudeExam from "../components/AptitudeExam";
import CodingExam from "../components/CodingExam";
import FaceMonitor from "../components/FaceMonitor";

const ExamPage: React.FC = () => {
  const { state } = useLocation();
  const [leftTime, setLeftTime] = useState<number | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [responses, setResponses] = useState<{
    [key: number]: number | number[] | boolean | null;
  }>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();


  const checkFullscreen = () => {
    const isFS =
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement;

    setIsFullscreen(!isFS);
  };

  // Request fullscreen
  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if ((elem as any).webkitRequestFullscreen)
      (elem as any).webkitRequestFullscreen();
    else if ((elem as any).mozRequestFullScreen)
      (elem as any).mozRequestFullScreen();
    else if ((elem as any).msRequestFullscreen)
      (elem as any).msRequestFullscreen();
  };

  useEffect(() => {
    let blurTime: number | null = null;
  
    const handleBlur = () => {
      blurTime = Date.now();
    };
  
    const handleFocus = () => {
      const now = Date.now();
      if (isFullscreen && blurTime && now - blurTime > 500) {
        toast.warning("You switched tabs/windows. This is being monitored!", {
          autoClose: 5000,
        });
      }
      blurTime = null;
    };
  
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
  
    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isFullscreen]);
  

  useEffect(() => {
    const handleFullscreenChange = () => {
      checkFullscreen();
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    checkFullscreen();

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const response = await getStudentExamById(Number(state.studentExamId));
        setLeftTime(response.data.leftTime);
        setExam(response.data.studentExamDetails.exam);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [state.studentExamId]);

  useEffect(() => {
    if (leftTime === 0) {
      setShowModal(true);
      const timeout = setTimeout(async () => {
        handleSubmit();
      }, 2000);
  
      return () => clearTimeout(timeout);
    }
  }, [leftTime]);

  const handleSubmit = async () => {
    try {
      if (exam?.type === "coding") {
        await declareResult(Number(state.studentExamId));
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("Question ")) {
            localStorage.removeItem(key);
          }
        });
      } else {
        const formattedResponses = Object.entries(responses)
          .map(([questionId, selectedValue]) => {
            const question = exam?.questions.find(
              (q) => q.question_id === Number(questionId)
            );
            if (!question) return null;

            if (question.question_type === "true_false") {
              return {
                question_id: Number(questionId),
                selected_option_id: null,
                selected_boolean_answer: selectedValue,
              };
            } else {
              return {
                question_id: Number(questionId),
                selected_option_id: Array.isArray(selectedValue)
                  ? selectedValue
                  : [selectedValue],
                selected_boolean_answer: null,
              };
            }
          })
          .filter((response) => response !== null);

        const submitResponse = await submitExam(
          Number(state.studentExamId),
          formattedResponses
        );
        toast.success(submitResponse.data.message);
        if (state.studentExamId) {
          // Declare result only if studentExamId is valid
          const resultResponse = await declareResult(
            Number(state.studentExamId)
          );
          console.log("Result Declared:", resultResponse);
        } else {
          console.error("Error: studentExamId is missing!");
        }
      }
      navigate("/");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to submit exam."
      );
    } finally {
      setShowModal(false);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (!exam) return <p>No exam found!</p>;

  return (
    <div>
      {!isFullscreen && (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="card p-4 shadow-lg" style={{ maxWidth: "400px" }}>
            <div className="card-body text-center">
              <p className="card-text">
                Please enter full screen mode to start the exam
              </p>
              <button
                onClick={enterFullscreen}
                className="btn btn-primary btn-lg mt-3"
              >
                Enter Fullscreen
              </button>
            </div>
          </div>
        </div>
      )}
      {isFullscreen && (
        <div>
          <CountdownTimer
            leftTime={leftTime || 0}
            handleSubmit={handleSubmit}
            setLeftTime={setLeftTime}
          />
          {exam?.type === "aptitude" && <FaceMonitor />}
          {exam && exam.type === "coding" ? (
            <CodingExam
              exam={exam}
              studentExamId={Number(state.studentExamId)}
            />
          ) : (
            <AptitudeExam
              exam={exam}
              studentExamId={Number(state.studentExamId)}
              setResponses={setResponses}
              responses={responses}
            />
          )}

          {showModal && (
            <div
              className="modal fade show d-block"
              tabIndex={-1}
              role="dialog"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header"></div>
                  <div className="modal-body text-danger">
                    <h4>Time's up! Your exam is being submitted...</h4>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showModal && <div className="modal-backdrop fade show"></div>}
        </div>
      )}
    </div>
  );
};

export default ExamPage;
