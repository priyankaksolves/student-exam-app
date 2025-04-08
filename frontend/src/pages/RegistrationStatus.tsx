import { useEffect } from "react";
import { useAuth } from "../authContext/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { updateRegistration } from "../api";

const RegistrationStatus = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  useEffect(() => {
    const updateRegistrationStatus = async () => {
      if (user && !user.is_registered) {
        try {
          await updateRegistration(user.user_id);
          updateUser({ is_registered: true });
          toast.success("Registration successful! You can now take the exam.");
        } catch (error: any) {
          toast.error(
            error.response?.data?.message ||
              "Error updating registration status."
          );
        }
      }
      navigate("/");
    };

    updateRegistrationStatus();
  }, [updateUser]);

  return <> </>;
};
export default RegistrationStatus;
