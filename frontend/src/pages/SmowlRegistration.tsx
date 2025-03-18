import { useEffect, useState } from "react";
import { useAuth } from "../authContext/AuthContext";
import { useParams } from "react-router-dom";

const SmowlRegistration = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [registerUrl, setRegisterUrl] = useState("");

  useEffect(() => {
    const fetchRegisterUrl = async () => {
      try {
        if (user) {
          const response = await fetch(
            `http://localhost:5000/api/smowl/register?userId=${user.user_id}&userName=${encodeURIComponent(
              user.first_name
            )}&userEmail=${encodeURIComponent(user.email)}&activityId=${id}&activityType=quiz&lang=en&activityUrl=${encodeURIComponent(
              "http://localhost:5173"
            )}`
          );
          const data = await response.json();
          if (data.url) setRegisterUrl(data.url);
        }
      } catch (error) {
        console.error("Error fetching SMOWL registration URL:", error);
      }
    };

    fetchRegisterUrl();
  }, [user, id]);

  if (!registerUrl)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Checking registration...</p>
        </div>
      </div>
    );

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card p-4 shadow-lg"
        style={{ maxWidth: "400px"}}
      >
        <div className="card-body text-center">
          <h2 className="card-title text-primary">SMOWL Registration</h2>
          <p className="card-text">
            Please complete the registration process before taking the exam.
          </p>
          <a
            href={registerUrl}
            rel="noopener noreferrer"
            className="btn btn-primary btn-lg mt-3"
          >
            Register with SMOWL
          </a>
        </div>
      </div>
    </div>
  );
};

export default SmowlRegistration;
