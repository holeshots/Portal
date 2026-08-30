import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthenticationProvider } from './auth/AuthenticationProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthenticationProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthenticationProvider>
  </StrictMode>,
)
