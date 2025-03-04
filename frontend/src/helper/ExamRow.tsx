import { Exam } from "../interfaces/exam";
import "../styles/AdminDashboard.css";


interface ExamRowProps {
  exam: Exam;
  onDelete: (examId: number) => void;
  onToggleLiveStatus: (examId: number, currentStatus: boolean) => void;
  navigate: (path: string) => void;
}

export const ExamRow: React.FC<ExamRowProps> = ({ exam, onDelete, onToggleLiveStatus, navigate }) => (
  <tr>
    <td>{exam.title}</td>
    <td>{exam.type}</td>
    <td>{exam.pass_marks}</td>
    <td>{exam.duration}</td>
    <td>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          id={`toggleLive-${exam.exam_id}`}
          checked={exam.is_live}
          onChange={() => onToggleLiveStatus(exam.exam_id, exam.is_live)}
        />
        <label
          className={`form-check-label ${exam.is_live ? "text-success fw-bold" : "text-danger fw-bold"}`}
          htmlFor={`toggleLive-${exam.exam_id}`}
        >
          {exam.is_live ? "Active" : "Inactive"}
        </label>
      </div>
    </td>
    <td className="d-flex align-items-center">
      <div className="d-flex align-items-center edit-button me-1" onClick={() => navigate(`/exam/${exam.exam_id}/add-questions/`)}>
        <i className="bi bi-pencil-square me-1"></i>
        <span> Edit</span>
      </div>
      <div className="d-flex align-items-center delete-button me-1" onClick={() => onDelete(exam.exam_id)}>
        <i className="bi bi-trash-fill me-1"></i>
        <span> Delete</span>
      </div>
      <div className="d-flex align-items-center add-question" onClick={() => navigate(`/exam/${exam.exam_id}/add-questions/`)}>
        <i className="bi bi-plus-square me-1"></i>
        <span> Add Question</span>
      </div>
    </td>
  </tr>
);