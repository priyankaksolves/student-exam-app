import { jwtDecode } from "jwt-decode";

const getUserIdFromToken = () => {
  const token = localStorage.getItem("token"); // Get JWT from local storage
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.userId; // Assuming your JWT has `userId`
  } catch (error) {
    console.error("Invalid Token:", error);
    return null;
  }
};