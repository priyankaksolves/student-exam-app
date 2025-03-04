import { createRoot } from 'react-dom/client'
import App from '../App.tsx'
import { AuthProvider } from './authContext/AuthContext.tsx'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <AuthProvider>
      <ToastContainer />
      <App />
    </AuthProvider>
  // </StrictMode>,
)
