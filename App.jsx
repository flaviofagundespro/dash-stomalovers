import { useState, useEffect } from 'react'
import { isAuthenticated } from './lib/auth'
import { LoginForm } from './components/LoginForm'
import { Dashboard } from './components/Dashboard'
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
