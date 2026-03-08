import { useState } from 'react'
import api from '../services/api'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

export const useAuth = () => {
  const { setAuth, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/auth/login', { email, password })
      const { user, token } = res.data.data
      setAuth(user, token)
      navigate('/chat')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/auth/register', { email, password })
      const { user, token } = res.data.data
      setAuth(user, token)
      navigate('/chat')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    clearAuth()
    navigate('/login')
  }

  return { login, register, logout, loading, error }
}