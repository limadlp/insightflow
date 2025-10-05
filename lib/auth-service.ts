// Authentication service - handles login/logout/registration
import type { User } from "./types"
import { userStorage, inviteStorage, sessionStorage } from "./storage-service"
import { MOCK_PASSWORDS } from "./mock-data"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  inviteToken?: string
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AuthError"
  }
}

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<User> => {
    const { email, password } = credentials

    // Find user
    const user = userStorage.getByEmail(email)
    if (!user) {
      throw new AuthError("Email ou senha inválidos")
    }

    // Check password (in real app, this would be done securely on backend)
    if (MOCK_PASSWORDS[email] !== password) {
      throw new AuthError("Email ou senha inválidos")
    }

    // Set current user
    sessionStorage.setCurrentUser(user)

    return user
  },

  // Logout user
  logout: async (): Promise<void> => {
    sessionStorage.setCurrentUser(null)
  },

  // Get current user
  getCurrentUser: (): User | null => {
    return sessionStorage.getCurrentUser()
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return sessionStorage.getCurrentUser() !== null
  },

  // Register new student (via invite)
  register: async (data: RegisterData): Promise<User> => {
    const { email, password, name, inviteToken } = data

    // Check if user already exists
    const existingUser = userStorage.getByEmail(email)
    if (existingUser) {
      throw new AuthError("Usuário já existe")
    }

    let teacherId = "demo-teacher"
    if (inviteToken) {
      const invite = inviteStorage.getByToken(inviteToken)
      if (!invite) {
        throw new AuthError("Convite inválido")
      }
      if (invite.status !== "pending") {
        throw new AuthError("Convite já foi usado")
      }
      if (new Date(invite.expiresAt) < new Date()) {
        throw new AuthError("Convite expirado")
      }
      if (invite.email !== email) {
        throw new AuthError("Este convite foi enviado para outro email")
      }

      teacherId = invite.teacherId

      // Mark invite as accepted
      inviteStorage.update(invite.id, {
        status: "accepted",
        acceptedAt: new Date().toISOString(),
      })
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      role: "student",
      teacherId,
      createdAt: new Date().toISOString(),
    }

    userStorage.create(newUser)

    // Set current user
    localStorage.setItem("insightflow_current_user", JSON.stringify(newUser))

    return newUser
  },
}
