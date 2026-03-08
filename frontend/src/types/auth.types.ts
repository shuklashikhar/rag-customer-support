export interface User {
  id: string
  email: string
  role: 'USER' | 'ADMIN'
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
}