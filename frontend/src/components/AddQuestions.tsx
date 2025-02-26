import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addQuestion, getQuestionsForExam } from "../api";
import { Button, Container, Form, Table, Alert, Spinner } from "react-bootstrap";
import { Question } from "../interfaces/Question"; // ✅ Import models

const AddQuestions: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<Question>({
    exam_id: Number(examId),
    question_text: "",
    question_type: "multiple_choice",
    marks: 1,
    options: [
      { question_id: 0, option_text: "", is_correct: false },
      { question_id: 0, option_text: "", is_correct: false },
    ],
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await getQuestionsForExam(Number(examId));
      setQuestions(response.data.examDetails.questions);
    } catch (err) {
      setError("Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Question, value: any) => {
    setNewQuestion((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...(newQuestion.options || [])];
    updatedOptions[index].option_text = value; // ✅ Use `option_text` instead of `text`
    setNewQuestion((prev) => ({ ...prev, options: updatedOptions }));
  };

  const toggleCorrectOption = (index: number) => {
    const updatedOptions = [...(newQuestion.options || [])];
    if (newQuestion.question_type === "multiple_choice") {
      updatedOptions.forEach((opt, i) => (opt.is_correct = i === index));
    } else {
      updatedOptions[index].is_correct = !updatedOptions[index].is_correct;
    }
    setNewQuestion((prev) => ({ ...prev, options: updatedOptions }));
  };

  const addOption = () => {
    setNewQuestion((prev) => ({
      ...prev,
      options: [
        ...(prev.options || []),
        { question_id: 0, option_text: "", is_correct: false },
      ],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addQuestion(Number(examId), newQuestion);
      fetchQuestions();
      setNewQuestion({
        exam_id: Number(examId),
        question_text: "",
        question_type: "multiple_choice",
        marks: 1,
        options: [
          { question_id: 0, option_text: "", is_correct: false },
          { question_id: 0, option_text: "", is_correct: false },
        ],
      });
    } catch (err) {
      setError("Failed to add question.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Add Questions to Exam ID: {examId}</h2>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group>
          <Form.Label>Question Text</Form.Label>
          <Form.Control
            type="text"
            value={newQuestion.question_text}
            onChange={(e) => handleChange("question_text", e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Question Type</Form.Label>
          <Form.Select
            value={newQuestion.question_type}
            onChange={(e) => handleChange("question_type", e.target.value)}
            required
          >
            <option value="multiple_choice">Multiple Choice</option>
            <option value="multi_select">Multi Select</option>
            <option value="true_false">True/False</option>
          </Form.Select>
        </Form.Group>

        {newQuestion.question_type === "true_false" && (
          <Form.Group>
            <Form.Label>Correct Answer</Form.Label>
            <Form.Check
              type="checkbox"
              label="Correct Answer"
              checked={newQuestion.correct_answer}
              onChange={(e) => handleChange("correct_answer", e.target.checked)}
            />
          </Form.Group>
        )}

        {["multiple_choice", "multi_select"].includes(newQuestion.question_type) && (
          <div>
            <Form.Label>Options</Form.Label>
            {newQuestion.options?.map((opt, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <Form.Control
                  type="text"
                  value={opt.option_text}
                  placeholder={`Option ${index + 1}`}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="me-2"
                />
                <Form.Check
                  type="checkbox"
                  label="Correct"
                  checked={opt.is_correct}
                  onChange={() => toggleCorrectOption(index)}
                />
              </div>
            ))}
            <Button variant="outline-primary" size="sm" onClick={addOption}>
              + Add Option
            </Button>
          </div>
        )}

        <Form.Group>
          <Form.Label>Marks</Form.Label>
          <Form.Control
            type="number"
            value={newQuestion.marks}
            onChange={(e) => handleChange("marks", e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="success" type="submit">
          Add Question
        </Button>
      </Form>

      <h3>Existing Questions</h3>
      {questions?.length === 0 ? (
        <Alert variant="warning">No questions added yet.</Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Question Text</th>
              <th>Type</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            {questions?.map((question: Question) => (
              <tr key={question.question_id}>
                <td>{question.question_id}</td>
                <td>{question.question_text}</td>
                <td>{question.question_type}</td>
                <td>{question.marks}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AddQuestions;
