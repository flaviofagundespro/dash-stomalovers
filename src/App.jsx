import { useState, useEffect } from 'react'
import { isAuthenticated } from './auth.js'
import { LoginForm } from './LoginForm.jsx'
import { Dashboard } from './Dashboard.jsx'
import './App.css'

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se o usuário já está autenticado
    setAuthenticated(isAuthenticated())
    setLoading(false)
  }, [])

  const handleLogin = () => {
    setAuthenticated(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return authenticated ? (
    <Dashboard />
  ) : (
    <LoginForm onLogin={handleLogin} />
  )
}

export default App
