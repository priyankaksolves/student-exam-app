import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../src/pages/Login";
import Signup from "../src/pages/Signup";
import Header from "../src/components/Header";
import CreateExam from "../src/pages/CreateExam";
import EditExam from "../src/pages/EditExam";
import StudentExam from "../src/pages/StudentExam";
import StudentDashboard from "../src/pages/StudentDashboard";
import ProtectedRoute from "../src/components/ProtectedRoute";
import RoleBasedRedirect from "../src/components/RoleBasedRedirec";
import { Spinner } from "react-bootstrap";
import { useAuth } from "../src/authContext/AuthContext";
import ExamPage from "../src/pages/ExamPage";
import ResultPage from "../src/pages/ResultPage";
import AdminDashboard from "../src/pages/AdminDashboard";
import AddQuestions from "../src/pages/AddQuestions";
import EditStudentExam from "../src/pages/EditStudentExam";
import ExamDetails from "../src/pages/ExamDetails";
import SmowlRegistration from "../src/pages/SmowlRegistration";
import RegistrationStatus from "../src/pages/RegistrationStatus";
import Coding from "../src/pages/Coding";

const AppRoutes: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();
      
  useEffect(() => {
    setLoading(false);
    
  },[isLoggedIn]);
  

  if (loading) {
  return(
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="border" role="status" />
    </div>
  )}

  return (
    <Router>
      <Header />
      <div>
        <Routes>
          <Route path="/" element={<RoleBasedRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute accessRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/create-exam" element={<ProtectedRoute accessRole="admin"><CreateExam /></ProtectedRoute>} />
          <Route path="/edit-exam/:id" element={<ProtectedRoute accessRole="admin"><EditExam /></ProtectedRoute>} />
          <Route path="/admin/student-exam" element={<ProtectedRoute accessRole="admin"><StudentExam /></ProtectedRoute>} />
          <Route path="/exam/:examId/add-questions" element={<ProtectedRoute accessRole="admin"><AddQuestions /></ProtectedRoute>} />
          <Route path="/studentdashboard" element={<ProtectedRoute accessRole="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student-exam/:studentExamId" element={<ProtectedRoute accessRole="student"><ExamPage /></ProtectedRoute>} />
          <Route path="/result/:studentExamId" element={<ProtectedRoute accessRole="student"><ResultPage /></ProtectedRoute>} />
          <Route path="/edit/:studentExamId" element={<ProtectedRoute accessRole="admin"><EditStudentExam /></ProtectedRoute>} />
          <Route path="/exam/:id" element={<ProtectedRoute accessRole="admin"><ExamDetails /></ProtectedRoute>} /> 
          <Route path="/smowl/registration/:id" element={<ProtectedRoute accessRole="student"><SmowlRegistration /></ProtectedRoute>} />
          <Route path="/smowl/registration/status" element={<ProtectedRoute accessRole="student"><RegistrationStatus /></ProtectedRoute>} />
          <Route path="/Coding/:studentExamId" element={<ProtectedRoute accessRole="student"><Coding /></ProtectedRoute>} /> 

        </Routes>
      </div>
    </Router>
  );
};

export default AppRoutes;
