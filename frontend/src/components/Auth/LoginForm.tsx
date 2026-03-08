import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Link } from 'react-router-dom'

export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useAuth()

  const handleSubmit = async () => {
    await login(email, password)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f0f1a'
    }}>
      <div style={{
        backgroundColor: '#1a1a2e',
        padding: '40px',
        borderRadius: '12px',
        width: '360px',
        border: '1px solid #333'
      }}>
        <h2 style={{ color: 'white', marginBottom: '8px', textAlign: 'center' }}>
          Welcome Back
        </h2>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '28px', fontSize: '14px' }}>
          Sign in to TechMart Support
        </p>

        {error && (
          <div style={{
            backgroundColor: '#3d1a1a',
            border: '1px solid #c0392b',
            color: '#e74c3c',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              width: '100%',
              padding: '10px 12px',
              backgroundColor: '#0f0f1a',
              border: '1px solid #444',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{
              width: '100%',
              padding: '10px 12px',
              backgroundColor: '#0f0f1a',
              border: '1px solid #444',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#333' : '#4a90d9',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600'
          }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p style={{ color: '#666', textAlign: 'center', marginTop: '20px', fontSize: '13px' }}>
          No account?{' '}
          <Link to="/register" style={{ color: '#4a90d9' }}>Register here</Link>
        </p>
      </div>
    </div>
  )
}