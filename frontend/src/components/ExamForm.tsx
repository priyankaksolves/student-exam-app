import { useState } from "react";
import { createExam, updateExam } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { Exam } from "../interfaces/exam";
import { Button } from "react-bootstrap";
import QuestionForm from "../components/QuestionForm";
import { Question } from "../interfaces/Question";
import { toast } from "react-toastify";

interface CreateExamProps {
  examData: Partial<Exam>;
  setExamData: React.Dispatch<React.SetStateAction<Partial<Exam>>>;
}

const ExamForm: React.FC<CreateExamProps> = ({ examData, setExamData }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [addQuestion, setAddQuestion] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setExamData((prev) => ({ ...prev, [name]: value }));
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...examData, questions };
      await createExam(payload);
      toast.success("Exam created successfully.");
      navigate("/admin/dashboard");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Failed to create exam. Please try again."
      );
    }
  };

  const update = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateExam(examData.created_by, examData);
      toast.success("Exam Updated successfully.");
      navigate("/admin/dashboard");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Failed to create exam. Please try again."
      );
    }
  };

  return (
    <form onSubmit={id ? update : create} className="p-4 shadow">
      <div className="mb-3">
        <label className="form-label">Exam Title</label>
        <input
          type="text"
          name="title"
          className="form-control"
          placeholder="Enter exam title"
          value={examData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-control"
          placeholder="Enter exam description"
          rows={3}
          value={examData.description}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="row">
        <div className="col-md-4">
          <label className="form-label">Exam Type</label>
          <select
            name="type"
            className="form-select"
            value={examData.type}
            onChange={handleChange}
            required
          >
            <option value="aptitude">Aptitude</option>
            <option value="coding">Coding</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            className="form-control"
            placeholder="Enter duration in minutes"
            value={examData.duration}
            onChange={handleChange}
            required
            min="1"
            max="1440"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Pass Marks</label>
          <input
            type="number"
            name="pass_marks"
            className="form-control"
            placeholder="Enter minimum pass marks"
            value={examData.pass_marks}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
      </div>
      <div>
        <input
          type="hidden"
          name="created_by"
          value={examData.created_by}
          required
        />
      </div>
      {addQuestion && (
        <QuestionForm examID={0} onQuestionsChange={setQuestions} />
      )}
      {!id && (
        <Button
          variant={addQuestion ? "danger" : "success"}
          size="sm"
          className="mt-3"
          onClick={() => {
            if (addQuestion) {
              setQuestions([]);
            }
            setAddQuestion(!addQuestion);
          }}
        >
          {addQuestion ? "- Remove Questions" : "+ Add Questions"}
        </Button>
      )}

      <button className="btn btn-primary w-100 mt-4">
        {id ? "Update Exam" : "Create Exam"}
      </button>
    </form>
  );
};

export default ExamForm;
