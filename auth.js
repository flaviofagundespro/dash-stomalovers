// Sistema de autenticação simples para o dashboard
const VALID_CREDENTIALS = {
  username: 'stomalovers',
  password: 'Sourica2025'
}

export const authenticate = (username, password) => {
  return username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password
}

export const isAuthenticated = () => {
  return localStorage.getItem('dashboard_authenticated') === 'true'
}

export const login = (username, password) => {
  if (authenticate(username, password)) {
    localStorage.setItem('dashboard_authenticated', 'true')
    return true
  }
  return false
}

export const logout = () => {
  localStorage.removeItem('dashboard_authenticated')
}

