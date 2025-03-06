import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getExamById } from "../api";
import { Exam } from "../interfaces/exam";
import ExamForm from "../components/ExamForm";
import { Spinner } from "react-bootstrap";

const UpdateExam: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [examData, setExamData] = useState<Partial<Exam>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExam = async () => {
      const fetchExam = async () => {
        try {
          const response = await getExamById(Number(id));
          setExamData(response.data.examDetails);
          setLoading(false);
        } catch (err) {
          setError("Failed to fetch exam details.");
        }
      };
      fetchExam();
    };
    fetchExam();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Edit Exam</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <ExamForm examData={examData} setExamData={setExamData} />
    </div>
  );
};

export default UpdateExam;
