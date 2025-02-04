import { createRoot } from 'react-dom/client'
import App from '../App.tsx'
import { AuthProvider } from './authContext/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  // </StrictMode>,
)
