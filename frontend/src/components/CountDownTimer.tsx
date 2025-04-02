import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { declareResult } from "../api";

interface CountDownProps {
  leftTime: number;
  studentExamId: number;
}

const CountdownTimer: React.FC<CountDownProps> = ({ leftTime, studentExamId }) => {
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(leftTime);
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      setShowModal(true);
      setTimeout(async () => {
        handleSubmit();
      }, 2000);
    }
  }, [timeLeft, studentExamId]);

  const formatTime = (seconds: number) => {
    const totalSeconds = Math.floor(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async () => {
    try {
      await declareResult(studentExamId);
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("Question ")) {
          localStorage.removeItem(key);
        }
      });      
      navigate("/");
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit exam.");
    } finally {
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-end bg-info p-2 text-dark">
        <button className="btn btn-outline-warning text-dark me-2" onClick={handleSubmit}>
          Submit Exam
        </button>
        <div className="fs-3">
          Time Left: <span className="text-danger">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog">
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
    </>
  );
};

export default CountdownTimer;
