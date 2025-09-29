import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css' // PRIMEIRO: Base do Tailwind
import './App.css'   // DEPOIS: Customizações

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)