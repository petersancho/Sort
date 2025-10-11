import fs from 'fs-extra'
import path from 'path'
import mime from 'mime-types'
import { promisify } from 'util'
import { database } from './database'

export interface FileInfo {
  path: string
  name: string
  extension: string
  size: number
  created: Date
  modified: Date
  category?: string
  mimeType?: string
}

export class FileScanner {
  private db = database.getDB()
  private run = promisify(this.db.run.bind(this.db)) as any
  private all = promisify(this.db.all.bind(this.db)) as any

  async scanDirectory(dirPath: string, recursive: boolean = true): Promise<FileInfo[]> {
    const files: FileInfo[] = []
    
    try {
      const items = await fs.readdir(dirPath)
      
      for (const item of items) {
        try {
          const fullPath = path.join(dirPath, item)
          const stats = await fs.stat(fullPath)
          
          if (stats.isDirectory() && recursive) {
            // Skip hidden directories and system directories
            if (!item.startsWith('.') && !['node_modules', '.git', '.vscode', '.DS_Store', 'Library', 'System'].includes(item)) {
              const subFiles = await this.scanDirectory(fullPath, recursive)
              files.push(...subFiles)
            }
          } else if (stats.isFile()) {
            // Skip hidden files and system files
            if (!item.startsWith('.') && !['.DS_Store', 'Thumbs.db'].includes(item)) {
              const fileInfo = await this.analyzeFile(fullPath, stats)
              files.push(fileInfo)
            }
          }
        } catch (itemError) {
          const message = itemError instanceof Error ? itemError.message : String(itemError)
          console.log(`Skipping item ${item} in ${dirPath}:`, message)
          continue
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`Error scanning directory ${dirPath}:`, message)
    }
    
    return files
  }

  private async analyzeFile(filePath: string, stats: fs.Stats): Promise<FileInfo> {
    const parsed = path.parse(filePath)
    const mimeType = mime.lookup(filePath) || 'unknown'
    
    const category = this.categorizeFile(parsed.ext, mimeType)
    
    return {
      path: filePath,
      name: parsed.name,
      extension: parsed.ext.toLowerCase(),
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      category,
      mimeType
    }
  }

  private categorizeFile(extension: string, mimeType: string): string {
    const ext = extension.toLowerCase()
    
    // Images
    if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.tiff', '.ico'].includes(ext)) {
      return 'Images'
    }
    
    // Documents
    if (['.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt', '.pages'].includes(ext)) {
      return 'Documents'
    }
    
    // Spreadsheets
    if (['.xls', '.xlsx', '.csv', '.ods', '.numbers'].includes(ext)) {
      return 'Spreadsheets'
    }
    
    // Presentations
    if (['.ppt', '.pptx', '.odp', '.key'].includes(ext)) {
      return 'Presentations'
    }
    
    // Code files
    if (['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.php', '.rb', '.go', '.rs', '.swift', '.kt'].includes(ext)) {
      return 'Code'
    }
    
    // Media
    if (['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'].includes(ext)) {
      return 'Media'
    }
    
    // Archives
    if (['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz'].includes(ext)) {
      return 'Archives'
    }
    
    // Fonts
    if (['.ttf', '.otf', '.woff', '.woff2', '.eot'].includes(ext)) {
      return 'Fonts'
    }
    
    // 3D Models
    if (['.obj', '.fbx', '.dae', '.3ds', '.blend', '.stl', '.ply'].includes(ext)) {
      return '3D Models'
    }
    
    return 'Other'
  }

  async saveFilesToDatabase(files: FileInfo[]) {
    for (const file of files) {
      try {
        await (this.run as any)(`
          INSERT OR REPLACE INTO files 
          (path, name, extension, size, created_at, modified_at, category, metadata)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          file.path,
          file.name,
          file.extension,
          file.size,
          file.created.toISOString(),
          file.modified.toISOString(),
          file.category,
          JSON.stringify({ mimeType: file.mimeType })
        ])
      } catch (error) {
        console.error(`Error saving file ${file.path}:`, error)
      }
    }
  }

  async getSystemStats() {
    const totalFiles = await (this.all as any)('SELECT COUNT(*) as count FROM files')
    const organizedFiles = await (this.all as any)`
      SELECT COUNT(*) as count FROM files 
      WHERE category IS NOT NULL AND category != 'Other'
    `
    const projects = await (this.all as any)('SELECT COUNT(*) as count FROM projects WHERE status = "active"')
    const todos = await (this.all as any)('SELECT COUNT(*) as count FROM todos WHERE status != "completed"')
    
    return {
      totalFiles: totalFiles[0]?.count || 0,
      organizedFiles: organizedFiles[0]?.count || 0,
      projects: projects[0]?.count || 0,
      todos: todos[0]?.count || 0
    }
  }

  async getFilesByCategory(category?: string, limit: number = 100) {
    let query = 'SELECT * FROM files'
    const params: any[] = []
    
    if (category) {
      query += ' WHERE category = ?'
      params.push(category)
    }
    
    query += ' ORDER BY modified_at DESC LIMIT ?'
    params.push(limit)
    
    return await (this.all as any)(query, params)
  }

  async getRecentFiles(limit: number = 20) {
    return await (this.all as any)(`
      SELECT * FROM files 
      ORDER BY modified_at DESC 
      LIMIT ?
    `, [limit])
  }
}
