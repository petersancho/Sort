import { promisify } from 'util'
import fs from 'fs-extra'
import path from 'path'
import crypto from 'crypto'

interface User {
  id: string
  username: string
  email: string
  passwordHash: string
  createdAt: string
  lastLogin?: string
}

interface Session {
  userId: string
  sessionId: string
  createdAt: string
  expiresAt: string
}

export class AuthManager {
  private usersFile: string
  private sessionsFile: string
  private users: Map<string, User> = new Map()
  private sessions: Map<string, Session> = new Map()

  constructor() {
    const isHeroku = !!process.env.DYNO
    const baseDataDir = process.env.DATA_DIR || (isHeroku
      ? path.join(process.env.TMPDIR || '/tmp', 'sort-data')
      : path.join(process.cwd(), 'data'))
    this.usersFile = path.join(baseDataDir, 'users.json')
    this.sessionsFile = path.join(baseDataDir, 'sessions.json')
    this.loadData()
  }

  private async loadData() {
    try {
      await fs.ensureDir(path.dirname(this.usersFile))
      
      if (await fs.pathExists(this.usersFile)) {
        const usersData = await fs.readFile(this.usersFile, 'utf-8')
        const users = JSON.parse(usersData)
        this.users = new Map(Object.entries(users))
      }

      if (await fs.pathExists(this.sessionsFile)) {
        const sessionsData = await fs.readFile(this.sessionsFile, 'utf-8')
        const sessions = JSON.parse(sessionsData)
        this.sessions = new Map(Object.entries(sessions))
      }
    } catch (error) {
      console.error('Error loading auth data:', error)
    }
  }

  private async saveUsers() {
    try {
      const usersObj = Object.fromEntries(this.users)
      await fs.writeFile(this.usersFile, JSON.stringify(usersObj, null, 2))
    } catch (error) {
      console.error('Error saving users:', error)
    }
  }

  private async saveSessions() {
    try {
      const sessionsObj = Object.fromEntries(this.sessions)
      await fs.writeFile(this.sessionsFile, JSON.stringify(sessionsObj, null, 2))
    } catch (error) {
      console.error('Error saving sessions:', error)
    }
  }

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex')
  }

  private generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  private generateUserId(): string {
    return crypto.randomBytes(16).toString('hex')
  }

  async register(username: string, email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
    // Check if user already exists
    for (const user of this.users.values()) {
      if (user.username === username || user.email === email) {
        return { success: false, message: 'Username or email already exists' }
      }
    }

    // Create new user
    const userId = this.generateUserId()
    const user: User = {
      id: userId,
      username,
      email,
      passwordHash: this.hashPassword(password),
      createdAt: new Date().toISOString()
    }

    this.users.set(userId, user)
    await this.saveUsers()

    return { success: true, message: 'User registered successfully', user }
  }

  async login(username: string, password: string): Promise<{ success: boolean; message: string; sessionId?: string; user?: User }> {
    // Find user by username or email
    let user: User | undefined
    for (const u of this.users.values()) {
      if (u.username === username || u.email === username) {
        user = u
        break
      }
    }

    if (!user) {
      return { success: false, message: 'Invalid credentials' }
    }

    // Check password
    const passwordHash = this.hashPassword(password)
    if (user.passwordHash !== passwordHash) {
      return { success: false, message: 'Invalid credentials' }
    }

    // Create session
    const sessionId = this.generateSessionId()
    const session: Session = {
      userId: user.id,
      sessionId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    }

    this.sessions.set(sessionId, session)
    await this.saveSessions()

    // Update last login
    user.lastLogin = new Date().toISOString()
    this.users.set(user.id, user)
    await this.saveUsers()

    return { success: true, message: 'Login successful', sessionId, user }
  }

  async logout(sessionId: string): Promise<{ success: boolean; message: string }> {
    if (this.sessions.has(sessionId)) {
      this.sessions.delete(sessionId)
      await this.saveSessions()
      return { success: true, message: 'Logged out successfully' }
    }
    return { success: false, message: 'Invalid session' }
  }

  async validateSession(sessionId: string): Promise<{ valid: boolean; user?: User }> {
    const session = this.sessions.get(sessionId)
    if (!session) {
      return { valid: false }
    }

    // Check if session is expired
    if (new Date() > new Date(session.expiresAt)) {
      this.sessions.delete(sessionId)
      await this.saveSessions()
      return { valid: false }
    }

    const user = this.users.get(session.userId)
    if (!user) {
      return { valid: false }
    }

    return { valid: true, user }
  }

  async getUserById(userId: string): Promise<User | undefined> {
    return this.users.get(userId)
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values())
  }
}

export const authManager = new AuthManager()

