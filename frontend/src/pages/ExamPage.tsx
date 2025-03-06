import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Spinner, Alert, Form } from "react-bootstrap";
import { declareResult, getStudentExamById, submitExam } from "../api";
import { toast } from "react-toastify";
import { Exam } from "../interfaces/exam";
import { Option, Question } from "../interfaces/Question";

const ExamPage: React.FC = () => {
  const { studentExamId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responses, setResponses] = useState<{
    [key: number]: number | number[] | boolean | null;
  }>({});

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const response = await getStudentExamById(Number(studentExamId));
        setExam(response.data.studentExamDetails.exam);

        // Initialize state with no selection
        const initialResponses: {
          [key: number]: number | number[] | boolean | null;
        } = {};
        response.data.studentExamDetails.exam.questions.forEach((q: Question) => {
          if (q.question_type === "true_false") {
            initialResponses[q.question_id!] = null;
          } else {
            initialResponses[q.question_id!] = [];
          }
        });
        setResponses(initialResponses);
      } catch (err: any) {
        setError("Failed to load exam details.");
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [studentExamId]);

  // Handle option selection
  const handleOptionChange = (
    questionId: number,
    value: number | boolean,
    questionType?: string
  ) => {
    setResponses((prevResponses) => {
      if (questionType === "multi_select") {
        const prevSelection = Array.isArray(prevResponses[questionId])
          ? (prevResponses[questionId] as number[])
          : [];
        return {
          ...prevResponses,
          [questionId]: prevSelection.includes(value as number)
            ? prevSelection.filter((id) => id !== value)
            : [...prevSelection, value as number],
        };
      }

      return {
        ...prevResponses,
        [questionId]: value,
      };
    });
  };

  // Handle exam submission
  const handleSubmit = async () => {
    try {
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
        Number(studentExamId),
        formattedResponses
      );
      toast.success(submitResponse.data.message);
      if (studentExamId) {
        // Declare result only if studentExamId is valid
        const resultResponse = await declareResult(Number(studentExamId));
        console.log("Result Declared:", resultResponse);
      } else {
        console.error("Error: studentExamId is missing!");
      }

      navigate("/studentdashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit exam.");
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!exam) return <p>No exam found!</p>;

  return (
    <Container>
      <h2>{exam.title}</h2>
      <p>Duration: {exam.duration} minutes</p>

      {exam.questions.map((question: Question, index: number) => (
        <div key={question.question_id} className="mb-4">
          <h4>
            {index + 1}. {question.question_text}
          </h4>
          <Form>
            {question.question_type !== "true_false" ? (
              question.options?.map((option: Option) => (
                <Form.Check
                  key={option.option_id}
                  type={
                    question.question_type === "multi_select"
                      ? "checkbox"
                      : "radio"
                  }
                  label={option.option_text}
                  name={`question_${question.question_id}`}
                  checked={
                    question.question_type === "multi_select"
                      ? (
                          responses[question.question_id!] as number[]
                        )?.includes(option.option_id!) || false
                      : responses[question.question_id!] === option.option_id
                  }
                  onChange={() =>
                    handleOptionChange(
                      question.question_id!,
                      option.option_id!,
                      question.question_type
                    )
                  }
                />
              ))
            ) : (
              <>
                <Form.Check
                  type="radio"
                  label="True"
                  name={`question_${question.question_id}`}
                  checked={responses[question.question_id!] === true || false}
                  onChange={() =>
                    handleOptionChange(
                      question.question_id!,
                      true,
                      "true_false"
                    )
                  }
                />
                <Form.Check
                  type="radio"
                  label="False"
                  name={`question_${question.question_id}`}
                  checked={responses[question.question_id!] === false || false}
                  onChange={() =>
                    handleOptionChange(
                      question.question_id!,
                      false,
                      "true_false"
                    )
                  }
                />
              </>
            )}
          </Form>
        </div>
      ))}

      <Button variant="success" onClick={handleSubmit}>
        Submit Exam
      </Button>
    </Container>
  );
};

export default ExamPage;
