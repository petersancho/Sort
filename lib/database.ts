// Lazy-load sqlite3 to avoid native binding during Next build static analysis
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

class Database {
  private db: any | null = null
  private dbPath: string

  constructor() {
    const isHeroku = !!process.env.DYNO
    const baseDataDir = process.env.DATA_DIR || (isHeroku ? path.join(process.env.TMPDIR || '/tmp', 'sort-data') : path.join(process.cwd(), 'data'))
    this.dbPath = process.env.DATABASE_PATH || path.join(baseDataDir, 'sort-system.db')
  }

  async initialize() {
    await fs.ensureDir(path.dirname(this.dbPath))
    
    const sqlite3 = getSqlite3()
    this.db = new sqlite3.Database(this.dbPath)
    
    const run = promisify(this.db.run.bind(this.db))
    const all = promisify(this.db.all.bind(this.db))
    const get = promisify(this.db.get.bind(this.db))

    // Create tables
    await run(`
      CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        extension TEXT,
        size INTEGER,
        created_at DATETIME,
        modified_at DATETIME,
        category TEXT,
        project_id INTEGER,
        todo_id INTEGER,
        tags TEXT,
        metadata TEXT,
        FOREIGN KEY (project_id) REFERENCES projects (id),
        FOREIGN KEY (todo_id) REFERENCES todos (id)
      )
    `)

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

    await run(`
      CREATE TABLE IF NOT EXISTS finance_documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        amount DECIMAL(10,2),
        currency TEXT DEFAULT 'USD',
        date DATE,
        category TEXT,
        file_path TEXT,
        project_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        metadata TEXT,
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )
    `)

    await run(`
      CREATE TABLE IF NOT EXISTS sorting_rules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        pattern TEXT NOT NULL,
        category TEXT NOT NULL,
        action TEXT NOT NULL,
        enabled BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Calendar events table
    await run(`
      CREATE TABLE IF NOT EXISTS calendar_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        start DATETIME NOT NULL,
        end DATETIME NOT NULL,
        all_day BOOLEAN DEFAULT 0,
        project_id INTEGER,
        todo_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        metadata TEXT,
        FOREIGN KEY (project_id) REFERENCES projects (id),
        FOREIGN KEY (todo_id) REFERENCES todos (id)
      )
    `)

    // Insert default sorting rules
    await this.insertDefaultRules()
  }

  private async insertDefaultRules() {
    const run = promisify(this.db!.run.bind(this.db!)) as any
    
    const defaultRules = [
      { name: 'Images', pattern: '\\.(jpg|jpeg|png|gif|bmp|svg|webp)$', category: 'Media', action: 'move_to_media' },
      { name: 'Documents', pattern: '\\.(pdf|doc|docx|txt|rtf|odt)$', category: 'Documents', action: 'move_to_documents' },
      { name: 'Spreadsheets', pattern: '\\.(xls|xlsx|csv|ods)$', category: 'Spreadsheets', action: 'move_to_spreadsheets' },
      { name: 'Code Files', pattern: '\\.(js|ts|jsx|tsx|py|java|cpp|c|cs|php|rb|go|rs)$', category: 'Code', action: 'move_to_code' },
      { name: 'Archives', pattern: '\\.(zip|rar|7z|tar|gz)$', category: 'Archives', action: 'move_to_archives' },
      { name: 'Videos', pattern: '\\.(mp4|avi|mov|wmv|flv|webm|mkv)$', category: 'Media', action: 'move_to_media' },
      { name: 'Audio', pattern: '\\.(mp3|wav|flac|aac|ogg|m4a)$', category: 'Media', action: 'move_to_media' },
    ]

    for (const rule of defaultRules) {
      await run(`
        INSERT OR IGNORE INTO sorting_rules (name, pattern, category, action)
        VALUES (?, ?, ?, ?)
      `, [rule.name, rule.pattern, rule.category, rule.action])
    }
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

export const database = new Database()
