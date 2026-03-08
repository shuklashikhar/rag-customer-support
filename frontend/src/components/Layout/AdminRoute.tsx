import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, isAdmin } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  if (!isAdmin()) return <Navigate to="/chat" replace />
  return <>{children}</>
}