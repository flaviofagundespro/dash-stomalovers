import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import './index.css'
import './tailwind.css' // Certifique-se de que o caminho para o seu CSS do Tailwind esteja correto

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)