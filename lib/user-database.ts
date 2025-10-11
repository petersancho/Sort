let _sqlite3: any
function getSqlite3() {
  if (!_sqlite3) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    _sqlite3 = require('sqlite3')
  }
  return _sqlite3
}
import { promisify } from 'util'
import path from 'path'
import fs from 'fs-extra'

export class UserDatabase {
  private db: any | null = null
  private dbPath: string

  constructor(userId: string) {
    const dataDir = path.join(process.cwd(), 'data', 'users', userId)
    this.dbPath = path.join(dataDir, 'user-data.db')
  }

  async initialize() {
    await fs.ensureDir(path.dirname(this.dbPath))
    
    const sqlite3 = getSqlite3()
    this.db = new sqlite3.Database(this.dbPath)
    
    const run = promisify(this.db.run.bind(this.db))
    const all = promisify(this.db.all.bind(this.db))
    const get = promisify(this.db.get.bind(this.db))

    // Create user-specific tables
    await run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        path TEXT NOT NULL,
        template TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'active',
        metadata TEXT
      )
    `)

    await run(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        priority TEXT DEFAULT 'medium',
        status TEXT DEFAULT 'pending',
        due_date DATETIME,
        project_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        metadata TEXT,
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )
    `)

  }

  getDB() {
    if (!this.db) {
      throw new Error('Database not initialized')
    }
    return this.db
  }

  async close() {
    if (this.db) {
      return new Promise<void>((resolve, reject) => {
        this.db!.close((err) => {
          if (err) reject(err)
          else resolve()
        })
      })
    }
  }
}

// Global map to store user database instances
const userDatabases = new Map<string, UserDatabase>()

export function getUserDatabase(userId: string): UserDatabase {
  if (!userDatabases.has(userId)) {
    userDatabases.set(userId, new UserDatabase(userId))
  }
  return userDatabases.get(userId)!
}

