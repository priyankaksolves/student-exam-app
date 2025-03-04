import React from "react";
import { Table } from "react-bootstrap";
import { Question } from "../interfaces/Question";

interface ExistingQuestionsProps {
  questions: Question[];
}

const ExistingQuestions: React.FC<ExistingQuestionsProps> = ({ questions }) => {
  return (
    <div className="mt-4">
      <h3>Existing Questions</h3>
      {questions.length === 0 ? (
        <p>No questions available.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Sr. NO.</th>
              <th>Question Text</th>
              <th>Type</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question, index) => (
              <tr key={question.question_id}>
                <td>{index+1}</td>
                <td>{question.question_text}</td>
                <td>{question.question_type}</td>
                <td>{question.marks}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ExistingQuestions;
