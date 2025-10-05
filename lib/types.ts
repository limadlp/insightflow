// Core domain types for InsightFlow

export type UserRole = "teacher" | "student"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  teacherId?: string // Only for students
  createdAt: string
}

export interface Practice {
  id: string
  teacherId: string
  title: string
  description: string
  category: string
  createdAt: string
  updatedAt: string
}

export interface AssignedPractice {
  id: string
  practiceId: string
  studentId: string
  teacherId: string
  assignedAt: string
  completed: boolean
}

export interface Report {
  id: string
  studentId: string
  practiceId: string
  assignedPracticeId: string
  content: string
  feedback?: string
  submittedAt: string
  feedbackAt?: string
}

export interface Invite {
  id: string
  teacherId: string
  email: string
  token: string
  status: "pending" | "accepted" | "expired"
  createdAt: string
  expiresAt: string
  acceptedAt?: string
}

export interface Branding {
  teacherId: string
  brandName: string
  logoUrl?: string
  primaryColor: string
  subdomain?: string
  updatedAt: string
}

export interface BrandingConfig {
  teacherId: string
  brandName: string
  primaryColor: string
  logoUrl?: string
  customDomain?: string
}

export interface AuthUser {
  user: User
  token: string
}
