import { useState } from "react";
import { useAuth } from "../authContext/AuthContext";
import { Exam } from "../interfaces/exam";
import ExamForm from "../components/ExamForm";

const CreateExam: React.FC = () => {
  const { userId } = useAuth();
  const [examData, setExamData] = useState<Partial<Exam>>({
    title: "",
    description: "",
    duration: undefined,
    type: "aptitude",
    pass_marks: undefined,
    created_by: userId,
  });

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Create Exam</h2>
      <ExamForm examData={examData} setExamData={setExamData} />
    </div>
  );
};

export default CreateExam;
