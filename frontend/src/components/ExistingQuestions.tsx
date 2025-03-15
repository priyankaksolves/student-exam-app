import { useState } from "react";
import { Button, Card, Modal, Form, Container, Alert, Row, Col } from "react-bootstrap";
import { Question } from "../interfaces/exam";
import { updateQuestion } from "../api";

interface Option {
  option_id: number;
  option_text: string;
  is_correct: boolean;
}

interface ExistingQuestionsProps {
  questions: Question[];
  onEdit: (questionId: number, updatedQuestion: Question) => void;
  onDelete: (questionId: number) => void;
}

const ExistingQuestions: React.FC<ExistingQuestionsProps> = ({ questions, onEdit, onDelete }) => {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState<Question | null>(null);

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({ ...question, options: question.options || [] });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleOptionChange = (index: number, newText: string) => {
    if (formData) {
      const updatedOptions = (formData.options || []).map((opt, i) =>
        i === index ? { ...opt, option_text: newText } : opt
      );
      setFormData({ ...formData, options: updatedOptions });
    }
  };

  const handleCorrectAnswerChange = (index: number) => {
    if (formData) {
      if (formData.question_type === "multi_select") {
        const updatedOptions = (formData.options || []).map((opt, i) =>
          i === index ? { ...opt, is_correct: !opt.is_correct } : opt
        );
        setFormData({ ...formData, options: updatedOptions });
      } else if (formData.question_type === "true_false") {
        const updatedOptions = [
          { option_text: "True",option_id:0, question_id: 0,is_correct: index === 0 },
          { option_text: "False", option_id:0, question_id: 0, is_correct: index === 1 }
        ];
        setFormData({ ...formData, options: updatedOptions });
      } else {
        const updatedOptions = (formData.options || []).map((opt, i) => ({
          ...opt,
          is_correct: i === index,
        }));
        setFormData({ ...formData, options: updatedOptions });
      }
    }
  };

  const handleSave = async () => {
    if (editingQuestion && formData) {
      try {
        const transformedData = {
          question_text: formData.question_text,
          options: (formData.options || []).map(option => option.option_text),
          correct_answer: (formData.options || []).filter(option => option.is_correct).map(option => option.option_text).join(", "),
          question_type:formData.question_type 
        };
        const response = await updateQuestion(editingQuestion.exam_id, editingQuestion.question_id, transformedData);
        onEdit(editingQuestion.question_id, response.data.question);
        setEditingQuestion(null);
      } catch (error) {
        console.error("Error updating question:", error);
      }
    }
  };

  const handleDelete = (questionId: number) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      onDelete(questionId);
    }
  };

  return (
    <Container className="mt-4">
      {questions.length === 0 && <Alert variant="warning">No questions available.</Alert>}
      {questions.map((question) => (
        <Card key={question.question_id} className="mb-3">
          <Card.Body>
            <Row>
              <Col md={8}>
                <Card.Title>{question.question_text}</Card.Title>
                <ul>
                  {(question.options || []).map((option) => (
                    <li key={option.option_id}>{option.option_text}</li>
                  ))}
                </ul>
              </Col>
              <Col md={4} className="text-end">
                <Button variant="warning" className="me-2" onClick={() => handleEdit(question)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(question.question_id)}>Delete</Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      <Modal show={!!editingQuestion} onHide={() => setEditingQuestion(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formData && (
            <>
              <Form.Group>
                <Form.Label>Question Text</Form.Label>
                <Form.Control
                  type="text"
                  name="question_text"
                  value={formData.question_text || ""}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Options</Form.Label>
                {formData.question_type === "true_false" ? (
                  <>
                    <Form.Check
                      type="radio"
                      label="True"
                      name="trueFalseAnswer"
                      checked={formData.options?.some(opt => opt.option_text === "True" && opt.is_correct)}
                      onChange={() => handleCorrectAnswerChange(0)}
                    />
                    <Form.Check
                      type="radio"
                      label="False"
                      name="trueFalseAnswer"
                      checked={formData.options?.some(opt => opt.option_text === "False" && opt.is_correct)}
                      onChange={() => handleCorrectAnswerChange(1)}
                    />
                  </>
                ) : (
                  (formData.options || []).map((option, index) => (
                    <Row key={option.option_id} className="mb-2">
                      <Col>
                        <Form.Control
                          type="text"
                          value={option.option_text || ""}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          disabled={formData.question_type === "true_false"}
                        />
                      </Col>
                      <Col xs="auto">
                        <Form.Check
                          type={formData.question_type === "multi_select" ? "checkbox" : "radio"}
                          name="correctAnswer"
                          checked={option.is_correct}
                          onChange={() => handleCorrectAnswerChange(index)}
                        />
                      </Col>
                    </Row>
                  ))
                )}
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditingQuestion(null)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ExistingQuestions;