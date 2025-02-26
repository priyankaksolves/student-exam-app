import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../authContext/AuthContext';
import { loginUser } from '../api'; // Import API function
import { jwtDecode } from 'jwt-decode';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    try {
      const response = await loginUser(email, password);
      if (!response.token) throw new Error('Invalid login response');
  
      localStorage.setItem('token', response.token);
  
      // Decode JWT to extract user info
      const decodedToken: any = jwtDecode(response.token);
      login(decodedToken.user_id, decodedToken.role); // Pass user_id from decoded token
  
      if(decodedToken.role === 'student') {
        navigate('/studentdashboard');
      }
      else {
        navigate('/dashboard');
      }

    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    }
  };
  
  

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '30px', textAlign: 'center' }}>
      <h2 style={{ margin: '0 0 30px 0' }}>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: '#007bff', textDecoration: 'none' }}>
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;
