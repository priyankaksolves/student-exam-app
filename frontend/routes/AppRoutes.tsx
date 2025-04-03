import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../src/pages/Login";
import Signup from "../src/pages/Signup";
import Header from "../src/components/Header";
import ProtectedRoute from "../src/components/ProtectedRoute";
import { Spinner } from "react-bootstrap";
import { useAuth } from "../src/authContext/AuthContext";

// Lazy Load Pages
const StudentDashboard = React.lazy(() => import("../src/pages/StudentDashboard"));
const AdminDashboard = React.lazy(() => import("../src/pages/AdminDashboard"));
const CreateExam = React.lazy(() => import("../src/pages/CreateExam"));
const EditExam = React.lazy(() => import("../src/pages/EditExam"));
const StudentExam = React.lazy(() => import("../src/pages/StudentExam"));
const AddQuestions = React.lazy(() => import("../src/pages/AddQuestions"));
const ExamPage = React.lazy(() => import("../src/pages/ExamPage"));
const ResultPage = React.lazy(() => import("../src/pages/ResultPage"));
const EditStudentExam = React.lazy(() => import("../src/pages/EditStudentExam"));
const ExamDetails = React.lazy(() => import("../src/pages/ExamDetails"));
const SmowlRegistration = React.lazy(() => import("../src/pages/SmowlRegistration"));
const RegistrationStatus = React.lazy(() => import("../src/pages/RegistrationStatus"));
const Coding = React.lazy(() => import("../src/pages/Coding"));

const AppRoutes: React.FC = () => {
  const { isLoggedIn, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <Suspense fallback={<div className="d-flex justify-content-center align-items-center vh-100"><Spinner animation="border" /></div>}>
        <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/studentdashboard"} /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/create-exam" element={<CreateExam />} />
            <Route path="/edit-exam/:id" element={<EditExam />} />
            <Route path="/admin/student-exam" element={<StudentExam />} />
            <Route path="/exam/:examId/add-questions" element={<AddQuestions />} />
            <Route path="/edit/:studentExamId" element={<EditStudentExam />} />
            <Route path="/exam/:id" element={<ExamDetails />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/studentdashboard" element={<StudentDashboard />} />
            <Route path="/student-exam/:studentExamId" element={<ExamPage />} />
            <Route path="/result/:studentExamId" element={<ResultPage />} />
            <Route path="/smowl/registration/:id" element={<SmowlRegistration />} />
            <Route path="/smowl/registration/status" element={<RegistrationStatus />} />
            <Route path="/coding/:studentExamId" element={<Coding />} />
          </Route>
        </Routes>
        </Suspense>
    </Router>
  );
};

export default AppRoutes;
