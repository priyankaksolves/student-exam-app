import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner, Alert, Card } from "react-bootstrap";
import { getResult } from "../api"; // API to fetch result

const ResultPage: React.FC = () => {
  const { studentExamId } = useParams(); // Get studentExamId from URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        if (!studentExamId) {
          throw new Error("Invalid Student Exam ID");
        }

        const response = await getResult(Number(studentExamId)); // Fetch result API
        setResult(response.result); // Extract the result object properly
      } catch (err) {
        setError("Failed to fetch result.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [studentExamId]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!result) return <p>No result found!</p>;

  // Calculate percentage safely
  const percentage = result.total_marks > 0 
    ? ((result.obtained_marks / result.total_marks) * 100).toFixed(2) 
    : "0.00";

  return (
    <Container className="mt-4">
      <h2 className="text-center">Exam Result</h2>
      <Card className="mt-4 p-4 text-center">
        <h4>Total Marks: {result.total_marks}</h4>
        <h4>Obtained Marks: {result.obtained_marks}</h4>
        <h5>Status: {result.status === "pass" ? "Passed ✅" : "Failed ❌"}</h5>
        <h6>Percentage: {percentage}%</h6>
      </Card>
    </Container>
  );
};

export default ResultPage;
