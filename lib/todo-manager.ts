import fs from 'fs-extra'
import path from 'path'
import { promisify } from 'util'
import { database } from './database'

export interface Todo {
  id?: number
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  due_date?: string
  project_id?: number
  created_at?: string
  updated_at?: string
  completed_at?: string
  metadata?: any
}

export interface TodoStats {
  total: number
  pending: number
  in_progress: number
  completed: number
  overdue: number
  byPriority: { [key: string]: number }
  byProject: { [key: string]: number }
}

export class TodoManager {
  private db = database.getDB()
  private run = promisify(this.db.run.bind(this.db))
  private all = promisify(this.db.all.bind(this.db))
  private get = promisify(this.db.get.bind(this.db))

  async addTodo(todo: Todo): Promise<Todo> {
    const result = await this.run(`
      INSERT INTO todos 
      (title, description, priority, status, due_date, project_id, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      todo.title,
      todo.description || null,
      todo.priority || 'medium',
      todo.status || 'pending',
      todo.due_date || null,
      todo.project_id || null,
      JSON.stringify(todo.metadata || {})
    ])

    return {
      ...todo,
      id: (result as any).lastID
    }
  }

  async getTodos(filters?: {
    status?: string
    priority?: string
    project_id?: number
    due_soon?: boolean
    overdue?: boolean
  }): Promise<Todo[]> {
    let query = 'SELECT * FROM todos WHERE 1=1'
    const params: any[] = []

    if (filters?.status) {
      query += ' AND status = ?'
      params.push(filters.status)
    }

    if (filters?.priority) {
      query += ' AND priority = ?'
      params.push(filters.priority)
    }

    if (filters?.project_id) {
      query += ' AND project_id = ?'
      params.push(filters.project_id)
    }

    if (filters?.due_soon) {
      query += ' AND due_date IS NOT NULL AND due_date <= date("now", "+7 days") AND status != "completed"'
    }

    if (filters?.overdue) {
      query += ' AND due_date IS NOT NULL AND due_date < date("now") AND status != "completed"'
    }

    query += ' ORDER BY priority DESC, due_date ASC, created_at DESC'

    return await this.all(query, params)
  }

  async getTodo(id: number): Promise<Todo | null> {
    return await this.get('SELECT * FROM todos WHERE id = ?', [id])
  }

  async updateTodo(id: number, updates: Partial<Todo>): Promise<void> {
    const fields = []
    const values = []

    for (const [key, value] of Object.entries(updates)) {
      if (key !== 'id' && value !== undefined) {
        fields.push(`${key} = ?`)
        values.push(typeof value === 'object' ? JSON.stringify(value) : value)
      }
    }

    if (fields.length === 0) return

    // Add completed_at if status is being set to completed
    if (updates.status === 'completed' && !fields.includes('completed_at')) {
      fields.push('completed_at = CURRENT_TIMESTAMP')
    } else if (updates.status && updates.status !== 'completed') {
      fields.push('completed_at = NULL')
    }

    fields.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)

    await this.run(`
      UPDATE todos 
      SET ${fields.join(', ')}
      WHERE id = ?
    `, values)
  }

  async deleteTodo(id: number): Promise<void> {
    await this.run('DELETE FROM todos WHERE id = ?', [id])
  }

  async getTodoStats(): Promise<TodoStats> {
    // Total todos
    const total = await this.get('SELECT COUNT(*) as count FROM todos')
    
    // By status
    const statusCounts = await this.all(`
      SELECT status, COUNT(*) as count
      FROM todos
      GROUP BY status
    `)
    
    // Overdue todos
    const overdue = await this.get(`
      SELECT COUNT(*) as count
      FROM todos
      WHERE due_date IS NOT NULL AND due_date < date("now") AND status != "completed"
    `)
    
    // By priority
    const priorityCounts = await this.all(`
      SELECT priority, COUNT(*) as count
      FROM todos
      GROUP BY priority
    `)
    
    // By project
    const projectCounts = await this.all(`
      SELECT p.name, COUNT(t.id) as count
      FROM todos t
      LEFT JOIN projects p ON t.project_id = p.id
      GROUP BY t.project_id, p.name
    `)

    const statusMap = statusCounts.reduce((acc: any, row: any) => {
      acc[row.status] = row.count
      return acc
    }, {})

    const priorityMap = priorityCounts.reduce((acc: any, row: any) => {
      acc[row.priority] = row.count
      return acc
    }, {})

    const projectMap = projectCounts.reduce((acc: any, row: any) => {
      acc[row.name || 'No Project'] = row.count
      return acc
    }, {})

    return {
      total: total?.count || 0,
      pending: statusMap.pending || 0,
      in_progress: statusMap.in_progress || 0,
      completed: statusMap.completed || 0,
      overdue: overdue?.count || 0,
      byPriority: priorityMap,
      byProject: projectMap
    }
  }

  async getTodosByProject(projectId: number): Promise<Todo[]> {
    return await this.all(`
      SELECT * FROM todos
      WHERE project_id = ?
      ORDER BY priority DESC, due_date ASC, created_at DESC
    `, [projectId])
  }

  async getUpcomingTodos(limit: number = 10): Promise<Todo[]> {
    return await this.all(`
      SELECT * FROM todos
      WHERE status != "completed" AND due_date IS NOT NULL
      ORDER BY due_date ASC
      LIMIT ?
    `, [limit])
  }

  async searchTodos(query: string): Promise<Todo[]> {
    return await this.all(`
      SELECT * FROM todos
      WHERE title LIKE ? OR description LIKE ?
      ORDER BY created_at DESC
    `, [`%${query}%`, `%${query}%`])
  }

  async completeTodo(id: number): Promise<void> {
    await this.updateTodo(id, { 
      status: 'completed',
      completed_at: new Date().toISOString()
    })
  }

  async getCompletedTodos(limit: number = 50): Promise<Todo[]> {
    return await this.all(`
      SELECT * FROM todos
      WHERE status = "completed"
      ORDER BY completed_at DESC
      LIMIT ?
    `, [limit])
  }

  async getTodosByDateRange(startDate: string, endDate: string): Promise<Todo[]> {
    return await this.all(`
      SELECT * FROM todos
      WHERE created_at BETWEEN ? AND ?
      ORDER BY created_at DESC
    `, [startDate, endDate])
  }

  // File association methods
  async associateFileWithTodo(todoId: number, filePath: string): Promise<void> {
    const todo = await this.getTodo(todoId)
    if (!todo) throw new Error('Todo not found')

    const metadata = todo.metadata || {}
    const files = metadata.files || []
    
    if (!files.includes(filePath)) {
      files.push(filePath)
      await this.updateTodo(todoId, {
        metadata: { ...metadata, files }
      })
    }
  }

  async removeFileFromTodo(todoId: number, filePath: string): Promise<void> {
    const todo = await this.getTodo(todoId)
    if (!todo) throw new Error('Todo not found')

    const metadata = todo.metadata || {}
    const files = metadata.files || []
    
    const updatedFiles = files.filter((file: string) => file !== filePath)
    await this.updateTodo(todoId, {
      metadata: { ...metadata, files: updatedFiles }
    })
  }

  async getTodosWithFiles(): Promise<Todo[]> {
    return await this.all(`
      SELECT * FROM todos
      WHERE metadata LIKE '%files%'
      ORDER BY created_at DESC
    `)
  }

  // Bulk operations
  async bulkUpdateStatus(todoIds: number[], status: string): Promise<void> {
    const placeholders = todoIds.map(() => '?').join(',')
    const params = [...todoIds, status]
    
    let updateFields = 'status = ?, updated_at = CURRENT_TIMESTAMP'
    if (status === 'completed') {
      updateFields += ', completed_at = CURRENT_TIMESTAMP'
    } else if (status !== 'completed') {
      updateFields += ', completed_at = NULL'
    }

    await this.run(`
      UPDATE todos 
      SET ${updateFields}
      WHERE id IN (${placeholders})
    `, params)
  }

  async bulkDeleteTodos(todoIds: number[]): Promise<void> {
    const placeholders = todoIds.map(() => '?').join(',')
    await this.run(`DELETE FROM todos WHERE id IN (${placeholders})`, todoIds)
  }
}
