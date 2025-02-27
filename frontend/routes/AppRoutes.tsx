// App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../src/pages/Login";
import Signup from "../src/pages/Signup";
import Header from "../src/components/Header";
import Dashboard from "../src/pages/Dashboard";
import AptitudeTest from "../src/components/AptitudeTest";
import EditQuestions from "../src/pages/EditQuestions";
import CreateExam from "../src/pages/CreateExam";
import EditExam from "../src/pages/EditExam";
import AddQuestions from "../src/components/AddQuestions";
import StudentDashboard from "../src/pages/StudentDashboard";
import ProtectedRoute from "../src/components/ProtectedRoute";
import RoleBasedRedirect from "../src/components/RoleBasedRedirec";
import { Spinner } from "react-bootstrap";
import { useAuth } from "../src/authContext/AuthContext";

const AppRoutes: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();
      
  useEffect(() => {
    console.log(isLoggedIn);
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
      <div className="container">
        <Routes>
          <Route path="/" element={<RoleBasedRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute accessRole="admin"><Dashboard /></ProtectedRoute>} />
          <Route path="/aptitudeTest/:examId" element={<ProtectedRoute accessRole="admin"><AptitudeTest /></ProtectedRoute>} />
          <Route path="/exam/:examId/questions" element={<ProtectedRoute accessRole="admin"><AptitudeTest /></ProtectedRoute>} />
          {/* <Route path="/EditQuestions" element={<ProtectedRoute accessRole="admin"><EditQuestions/></ProtectedRoute>} /> */}
          <Route path="/create-exam" element={<ProtectedRoute accessRole="admin"><CreateExam /></ProtectedRoute>} />
          <Route path="/edit-exam/:id" element={<ProtectedRoute accessRole="admin"><EditExam /></ProtectedRoute>} />
          <Route path="/exam/:examId/add-questions" element={<ProtectedRoute accessRole="admin"><AddQuestions /></ProtectedRoute>} />
          <Route path="/studentdashboard" element={<ProtectedRoute accessRole="student"><StudentDashboard /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRoutes;
