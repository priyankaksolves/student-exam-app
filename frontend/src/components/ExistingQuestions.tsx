import { useState } from "react";
import { Button, Card, Modal, Form, Container, Alert, Row, Col } from "react-bootstrap";
import { Question } from "../interfaces/Question";
import { deleteQuestion, updateQuestion } from "../api";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!formData) return;
  
    const { name, value, type } = e.target;
  
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value, // Ensure numeric values for marks
    });
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
      let updatedOptions = [...(formData.options || [])];
  
      if (formData.question_type === "multiple_choice") {
        // Ensure only one correct answer is selected
        updatedOptions = updatedOptions.map((opt, i) => ({
          ...opt,
          is_correct: i === index, // Only the selected option is correct
        }));
      } else if (formData.question_type === "multi_select") {
        // Toggle correct status for multi-select
        updatedOptions[index].is_correct = !updatedOptions[index].is_correct;
      } else if (formData.question_type === "true_false") {
        // Ensure only one is correct (True or False)
        updatedOptions = [
          { option_text: "True", option_id: 0, question_id:0, is_correct: index === 0 },
          { option_text: "False", option_id: 0, question_id:0,  is_correct: index === 1 }
        ];
      }
  
      setFormData({ ...formData, options: updatedOptions });
    }
  };
  

  const handleSave = async () => {
    if (formData) {
      try {
        const payload = {
          question_text: formData.question_text,
          marks: formData.marks,
          question_type: formData.question_type,
          correct_answer: formData.correct_answer,
          options: formData.options, // Ensure it's an array of objects
        };
  
        const response = await updateQuestion(formData.exam_id, formData.question_id, payload);
  
        onEdit(formData.question_id, formData);
        setEditingQuestion(null);
      } catch (error) {
        console.error("Error updating question:", error);
      }
    }
  };
  
  

  const handleDelete = async (questionId: number, exam_id: number) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteQuestion(questionId, exam_id); // API call to delete the question
      } catch (error) {
        console.error("Error deleting question:", error);
      }
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
                <Button variant="danger" onClick={() => handleDelete(question.question_id, question.exam_id)}>Delete</Button>
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
        <Form.Label>Question Marks</Form.Label>
        <Form.Control
          type="number"
          name="marks"
          value={formData.marks || ""}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mt-3">
        <Form.Label>Question Type</Form.Label>
        <Form.Select
          name="question_type"
          value={formData.question_type || "multiple_choice"}
          onChange={handleChange}
        >
          <option value="multiple_choice">Multiple Choice</option>
          <option value="multi_select">Multi-Select</option>
          <option value="true_false">True/False</option>
        </Form.Select>
      </Form.Group>

      {/* Render options for editing */}
      {formData.options && (
        <Form.Group className="mt-3">
          <Form.Label>Options</Form.Label>
          {formData.options.map((option, index) => (
            <div key={option.option_id} className="d-flex align-items-center mb-2">
              <Form.Control
                type="text"
                value={option.option_text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              <Form.Check
                type={formData.question_type === "multi_select" ? "checkbox" : "radio"}
                className="ms-2"
                checked={option.is_correct}
                onChange={() => handleCorrectAnswerChange(index)}
              />
            </div>
          ))}
        </Form.Group>
      )}
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
