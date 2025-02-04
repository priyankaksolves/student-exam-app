import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext/AuthContext';

const Header: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && window.location.pathname === "/login") {
      debugger;
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect after logout
  };

  return (
    <header className="header" style={styles.navbar}>
      <nav>
        <ul style={styles.menu}>
          {isLoggedIn && (
            <>
              <li style={styles.menuItem}>
                <NavLink
                  to="/dashboard"
                  style={({ isActive }) =>
                    isActive ? { ...styles.menuItem, ...styles.activeTab } : styles.menuItem
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li style={styles.menuItem}>
                <NavLink
                  to="/aptitudeTest"
                  style={({ isActive }) =>
                    isActive ? { ...styles.menuItem, ...styles.activeTab } : styles.menuItem
                  }
                >
                  Aptitude Test
                </NavLink>
              </li>
              <li style={styles.menuItem}>
                <NavLink
                  to="/editQuestions"
                  style={({ isActive }) =>
                    isActive ? { ...styles.menuItem, ...styles.activeTab } : styles.menuItem
                  }
                >
                  Edit Questions
                </NavLink>
              </li>
              <li style={styles.menuItem}>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}

          {!isLoggedIn && (
            <>
              <li style={styles.menuItem}>
                <NavLink
                  to="/login"
                  style={({ isActive }) =>
                    isActive ? { ...styles.menuItem, ...styles.activeTab } : styles.menuItem
                  }
                >
                  Login
                </NavLink>
              </li>
              <li style={styles.menuItem}>
                <NavLink
                  to="/signup"
                  style={({ isActive }) =>
                    isActive ? { ...styles.menuItem, ...styles.activeTab } : styles.menuItem
                  }
                >
                  Signup
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

const styles = {
  navbar: {
    background: '#333',
    color: 'white',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'center', // Center the navigation horizontally
  },
  menu: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    listStyle: 'none',
    gap: '40px', // Adjust gap to create more spacing between tabs
    margin: 0,
    padding: 0,
  },
  menuItem: {
    fontSize: '1.1rem',
    color: 'white',
    textDecoration: 'none',
    padding: '10px 15px', // Add padding for better click area
    borderRadius: '5px', // Rounded corners
    transition: 'background-color 0.3s ease', // Smooth hover effect
  },
  activeTab: {
    fontWeight: 'bold',
    textDecoration: 'underline',
    color: 'yellow',
    backgroundColor: '#444', // Background for active tab
  },
};

export default Header;