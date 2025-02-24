// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../src/pages/Login";
import Signup from "../src/pages/Signup";
import Header from "../src/components/Header";
import Dashboard from "../src/pages/Dashboard";
import AptitudeTest from "../src/components/AptitudeTest";
import EditQuestions from "../src/pages/EditQuestions";
import CreateExam from "../src/pages/CreateExam";
import EditExam from "../src/pages/EditExam";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/aptitudeTest/:examId" element={<AptitudeTest />} />
          <Route path="/exam/:examId/questions" element={<AptitudeTest />} />
          <Route path="/EditQuestions" element={<EditQuestions/>} />
          <Route path="/create-exam" element={<CreateExam />} />
          <Route path="/edit-exam/:id" element={<EditExam />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRoutes;
