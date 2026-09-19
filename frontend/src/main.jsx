import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CurrentGroupProvider } from './context/CurrentGroupContext.jsx'
import './index.scss'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CurrentGroupProvider>
          <App />
        </CurrentGroupProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)