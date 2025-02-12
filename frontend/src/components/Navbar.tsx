import { Link } from "react-router-dom";
import { useAuth } from "../authContext/AuthContext";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-lg font-bold">Exam App</h1>

        {isLoggedIn ? (
          <ul className="flex gap-4">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/exams">Exams</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><button onClick={logout} className="bg-red-500 px-2 py-1 rounded">Logout</button></li>
          </ul>
        ) : (
          <Link to="/login" className="bg-green-500 px-2 py-1 rounded">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
