// Storage abstraction layer - easy to swap localStorage for a real database
import type { User, Practice, AssignedPractice, Report, Invite, BrandingConfig } from "./types"
import {
  MOCK_USERS,
  INITIAL_PRACTICES,
  INITIAL_ASSIGNED_PRACTICES,
  INITIAL_REPORTS,
  INITIAL_BRANDING,
} from "./mock-data"

// Storage keys
const STORAGE_KEYS = {
  USERS: "insightflow_users",
  PRACTICES: "insightflow_practices",
  ASSIGNED_PRACTICES: "insightflow_assigned_practices",
  REPORTS: "insightflow_reports",
  INVITES: "insightflow_invites",
  BRANDING: "insightflow_branding",
  CURRENT_USER: "insightflow_current_user",
} as const

// Initialize storage with mock data if empty
export function initializeStorage() {
  if (typeof window === "undefined") return

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS))
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRACTICES)) {
    localStorage.setItem(STORAGE_KEYS.PRACTICES, JSON.stringify(INITIAL_PRACTICES))
  }
  if (!localStorage.getItem(STORAGE_KEYS.ASSIGNED_PRACTICES)) {
    localStorage.setItem(STORAGE_KEYS.ASSIGNED_PRACTICES, JSON.stringify(INITIAL_ASSIGNED_PRACTICES))
  }
  if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS))
  }
  if (!localStorage.getItem(STORAGE_KEYS.INVITES)) {
    localStorage.setItem(STORAGE_KEYS.INVITES, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.BRANDING)) {
    localStorage.setItem(STORAGE_KEYS.BRANDING, JSON.stringify(INITIAL_BRANDING))
  }
}

// Generic storage operations
function getItems<T>(key: string): T[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

function setItems<T>(key: string, items: T[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(items))
}

// User operations
export const userStorage = {
  getAll: (): User[] => getItems<User>(STORAGE_KEYS.USERS),

  getById: (id: string): User | undefined => {
    return userStorage.getAll().find((u) => u.id === id)
  },

  getByEmail: (email: string): User | undefined => {
    return userStorage.getAll().find((u) => u.email === email)
  },

  create: (user: User): User => {
    const users = userStorage.getAll()
    users.push(user)
    setItems(STORAGE_KEYS.USERS, users)
    return user
  },

  update: (id: string, updates: Partial<User>): User | undefined => {
    const users = userStorage.getAll()
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) return undefined

    users[index] = { ...users[index], ...updates }
    setItems(STORAGE_KEYS.USERS, users)
    return users[index]
  },

  getStudentsByTeacher: (teacherId: string): User[] => {
    return userStorage.getAll().filter((u) => u.teacherId === teacherId)
  },
}

// Practice operations
export const practiceStorage = {
  getAll: (): Practice[] => getItems<Practice>(STORAGE_KEYS.PRACTICES),

  getById: (id: string): Practice | undefined => {
    return practiceStorage.getAll().find((p) => p.id === id)
  },

  getByTeacher: (teacherId: string): Practice[] => {
    return practiceStorage.getAll().filter((p) => p.teacherId === teacherId)
  },

  create: (practice: Practice): Practice => {
    const practices = practiceStorage.getAll()
    practices.push(practice)
    setItems(STORAGE_KEYS.PRACTICES, practices)
    return practice
  },

  update: (id: string, updates: Partial<Practice>): Practice | undefined => {
    const practices = practiceStorage.getAll()
    const index = practices.findIndex((p) => p.id === id)
    if (index === -1) return undefined

    practices[index] = { ...practices[index], ...updates, updatedAt: new Date().toISOString() }
    setItems(STORAGE_KEYS.PRACTICES, practices)
    return practices[index]
  },

  delete: (id: string): boolean => {
    const practices = practiceStorage.getAll()
    const filtered = practices.filter((p) => p.id !== id)
    if (filtered.length === practices.length) return false

    setItems(STORAGE_KEYS.PRACTICES, filtered)
    return true
  },
}

// Assigned Practice operations
export const assignedPracticeStorage = {
  getAll: (): AssignedPractice[] => getItems<AssignedPractice>(STORAGE_KEYS.ASSIGNED_PRACTICES),

  getById: (id: string): AssignedPractice | undefined => {
    return assignedPracticeStorage.getAll().find((ap) => ap.id === id)
  },

  getByStudent: (studentId: string): AssignedPractice[] => {
    return assignedPracticeStorage.getAll().filter((ap) => ap.studentId === studentId)
  },

  getByTeacher: (teacherId: string): AssignedPractice[] => {
    return assignedPracticeStorage.getAll().filter((ap) => ap.teacherId === teacherId)
  },

  getByPractice: (practiceId: string): AssignedPractice[] => {
    return assignedPracticeStorage.getAll().filter((ap) => ap.practiceId === practiceId)
  },

  create: (assignment: AssignedPractice): AssignedPractice => {
    const assignments = assignedPracticeStorage.getAll()
    assignments.push(assignment)
    setItems(STORAGE_KEYS.ASSIGNED_PRACTICES, assignments)
    return assignment
  },

  update: (id: string, updates: Partial<AssignedPractice>): AssignedPractice | undefined => {
    const assignments = assignedPracticeStorage.getAll()
    const index = assignments.findIndex((ap) => ap.id === id)
    if (index === -1) return undefined

    assignments[index] = { ...assignments[index], ...updates }
    setItems(STORAGE_KEYS.ASSIGNED_PRACTICES, assignments)
    return assignments[index]
  },
}

// Report operations
export const reportStorage = {
  getAll: (): Report[] => getItems<Report>(STORAGE_KEYS.REPORTS),

  getById: (id: string): Report | undefined => {
    return reportStorage.getAll().find((r) => r.id === id)
  },

  getByStudent: (studentId: string): Report[] => {
    return reportStorage.getAll().filter((r) => r.studentId === studentId)
  },

  getByPractice: (practiceId: string): Report[] => {
    return reportStorage.getAll().filter((r) => r.practiceId === practiceId)
  },

  getByAssignedPractice: (assignedPracticeId: string): Report | undefined => {
    return reportStorage.getAll().find((r) => r.assignedPracticeId === assignedPracticeId)
  },

  create: (report: Report): Report => {
    const reports = reportStorage.getAll()
    reports.push(report)
    setItems(STORAGE_KEYS.REPORTS, reports)
    return report
  },

  update: (id: string, updates: Partial<Report>): Report | undefined => {
    const reports = reportStorage.getAll()
    const index = reports.findIndex((r) => r.id === id)
    if (index === -1) return undefined

    reports[index] = { ...reports[index], ...updates }
    setItems(STORAGE_KEYS.REPORTS, reports)
    return reports[index]
  },
}

// Invite operations
class InviteStorage {
  private key = "insightflow_invites"

  getAll(): Invite[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.key)
    return data ? JSON.parse(data) : []
  }

  getById(id: string): Invite | null {
    return this.getAll().find((invite) => invite.id === id) || null
  }

  getByToken(token: string): Invite | null {
    return this.getAll().find((invite) => invite.token === token) || null
  }

  getByTeacher(teacherId: string): Invite[] {
    return this.getAll().filter((invite) => invite.teacherId === teacherId)
  }

  create(invite: Invite): void {
    const invites = this.getAll()
    invites.push(invite)
    localStorage.setItem(this.key, JSON.stringify(invites))
  }

  update(id: string, updates: Partial<Invite>): void {
    const invites = this.getAll()
    const index = invites.findIndex((i) => i.id === id)
    if (index !== -1) {
      invites[index] = { ...invites[index], ...updates }
      localStorage.setItem(this.key, JSON.stringify(invites))
    }
  }

  delete(id: string): void {
    const invites = this.getAll().filter((i) => i.id !== id)
    localStorage.setItem(this.key, JSON.stringify(invites))
  }
}

// Branding operations
class BrandingStorage {
  private key = "insightflow_branding"

  getAll(): BrandingConfig[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.key)
    return data ? JSON.parse(data) : []
  }

  getByTeacher(teacherId: string): BrandingConfig | null {
    return this.getAll().find((config) => config.teacherId === teacherId) || null
  }

  save(config: BrandingConfig): void {
    const configs = this.getAll()
    const index = configs.findIndex((c) => c.teacherId === config.teacherId)
    if (index !== -1) {
      configs[index] = config
    } else {
      configs.push(config)
    }
    localStorage.setItem(this.key, JSON.stringify(configs))
  }

  delete(teacherId: string): void {
    const configs = this.getAll().filter((c) => c.teacherId !== teacherId)
    localStorage.setItem(this.key, JSON.stringify(configs))
  }
}

export const inviteStorage = new InviteStorage()
export const brandingStorage = new BrandingStorage()

// Current user session
export const sessionStorage = {
  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    return data ? JSON.parse(data) : null
  },

  setCurrentUser: (user: User | null): void => {
    if (typeof window === "undefined") return
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
    }
  },
}
