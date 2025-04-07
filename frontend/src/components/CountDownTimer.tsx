import { useEffect } from "react";

interface CountDownProps {
  leftTime: number;
  handleSubmit: () => void;
  setLeftTime: React.Dispatch<React.SetStateAction<number | null>>;
}

const CountdownTimer: React.FC<CountDownProps> = ({ leftTime, handleSubmit, setLeftTime}) => {
  
  useEffect(() => {
    if (leftTime <= 0) return;

    const timer = setInterval(() => {
      setLeftTime((prev) => Math.max((prev ?? 0) - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [leftTime]);

  const formatTime = (seconds: number) => {
    const totalSeconds = Math.floor(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="d-flex justify-content-end bg-info p-2 text-dark">
        <button
          className="btn btn-outline-warning text-dark me-2"
          onClick={handleSubmit}
        >
          Submit Exam
        </button>
        <div className="fs-3">
          Time Left: <span className="text-danger">{formatTime(leftTime)}</span>
        </div>
      </div>
    </>
  );
};

export default CountdownTimer;
