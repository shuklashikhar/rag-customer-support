import { useAuthStore } from '../../store/authStore'
import { useAuth } from '../../hooks/useAuth'
import { Link } from 'react-router-dom'

export const Header = () => {
  const { user, isAdmin } = useAuthStore()
  const { logout } = useAuth()

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 24px',
      backgroundColor: '#1a1a2e',
      color: 'white',
      borderBottom: '1px solid #333'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '18px' }}>🤖 TechMart Support</h2>
        <nav style={{ display: 'flex', gap: '16px' }}>
          <Link to="/chat" style={{ color: '#ccc', textDecoration: 'none' }}>
            Chat
          </Link>
          {isAdmin() && (
            <Link to="/admin" style={{ color: '#ccc', textDecoration: 'none' }}>
              Admin
            </Link>
          )}
        </nav>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ color: '#aaa', fontSize: '14px' }}>
          {user?.email}
          {isAdmin() && (
            <span style={{
              marginLeft: '8px',
              backgroundColor: '#4a90d9',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '11px'
            }}>
              ADMIN
            </span>
          )}
        </span>
        <button
          onClick={logout}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #555',
            color: 'white',
            padding: '6px 14px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          Logout
        </button>
      </div>
    </header>
  )
}