export interface RegisterBody {
  email: string
  password: string
}

export interface LoginBody {
  email: string
  password: string
}

export interface AuthUser {
  userId: string
  email: string
  role: string
}

// Extend Express Request to carry user
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}