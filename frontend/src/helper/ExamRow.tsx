import { useState } from "react";
import { Link } from "react-router-dom";
import { Exam } from "../interfaces/exam";
import "../styles/AdminDashboard.css";
import ImportQuestions from "../components/ImportQuestions";
import { Question } from "../interfaces/Question";
import { handleParse } from "./ParseQuestion";
import { addQuestion } from "../api";
import { toast } from "react-toastify";

interface ExamRowProps {
  exam: Exam;
  onDelete: (examId: number) => void;
  onToggleLiveStatus: (examId: number, currentStatus: boolean) => void;
  navigate: (path: string) => void;
}

export const ExamRow: React.FC<ExamRowProps> = ({ exam, onDelete, onToggleLiveStatus, navigate }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"form" | "import">(
    "form"
  );
  const [file, setFile] = useState<File | null>(null);

  const handleSelectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOption(event.target.value as "form" | "import");
  };

  const handleProceed = () => {
    if (selectedOption === "form") {
      navigate(`/exam/${exam.exam_id}/add-questions/`);
      setShowModal(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if(!file){
        toast.error("Please select a file to import questions.");
        return;
      }
      let parsedQuestions: Question[] = [];
      parsedQuestions = await handleParse(file, exam.exam_id);

      await addQuestion(Number(exam.exam_id), parsedQuestions);
      toast.success("Questions added successfully!");
      setShowModal(false);
      navigate("/admin/dashboard");
    } catch (error:any) {
      toast.error(
        error.response?.data?.message || error.message ||
          "Failed to Add Questions. Please try again."
      ); 
      setShowModal(false);
       }
  };

  return (
    <>
      <tr>
        <td>
          <Link to={`/exam/${exam.exam_id}`} className="exam-title-link">
          {exam.title}
          </Link>
        </td>
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
          <div className="d-flex align-items-center edit-button me-1" onClick={() => navigate(`/edit-exam/${exam.exam_id}`)}>
            <i className="bi bi-pencil-square me-1"></i>
            <span> Edit</span>
          </div>
          <div className="d-flex align-items-center delete-button me-1" onClick={() => onDelete(exam.exam_id)}>
            <i className="bi bi-trash-fill me-1"></i>
            <span> Delete</span>
          </div>
          <div className="d-flex align-items-center add-question" onClick={() => {setShowModal(true); setSelectedOption("form"); setFile(null);}}>
            <i className="bi bi-plus-square me-1"></i>
            <span> Add Question</span>
          </div>
        </td>
      </tr>

      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                Add Questions to Exam: {exam.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body vh-25">
                <select
                  className="form-select"
                  value={selectedOption}
                  onChange={handleSelectionChange}
                >
                  <option value="form">Manually Create Questions</option>
                  <option value="import">Import Questions from File</option>
                </select>

                {selectedOption === "import" && (
                  <ImportQuestions setFile={setFile} />
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={
                    selectedOption === "form" ? handleProceed : handleAdd
                  }
                >
                  {selectedOption === "form" ? "Create Questions" : "Import Questions"}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && <div className="modal-backdrop fade show"></div>}
    </>
  );
};