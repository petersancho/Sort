import fs from 'fs-extra'
import path from 'path'
import { promisify } from 'util'
import { database } from './database'

export interface FinanceDocument {
  id?: number
  name: string
  type: 'receipt' | 'invoice' | 'statement' | 'contract' | 'tax' | 'budget' | 'other'
  amount?: number
  currency: string
  date?: string
  category: string
  file_path?: string
  project_id?: number
  created_at?: string
  metadata?: any
}

export interface BudgetCategory {
  name: string
  allocated: number
  spent: number
  remaining: number
}

export interface MonthlyBudget {
  month: string
  total_allocated: number
  total_spent: number
  categories: BudgetCategory[]
}

export class FinanceTracker {
  private db = database.getDB()
  private run = promisify(this.db.run.bind(this.db))
  private all = promisify(this.db.all.bind(this.db))
  private get = promisify(this.db.get.bind(this.db))

  async addDocument(document: FinanceDocument): Promise<FinanceDocument> {
    const result = await (this.run as any)(`
      INSERT INTO finance_documents 
      (name, type, amount, currency, date, category, file_path, project_id, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      document.name,
      document.type,
      document.amount || null,
      document.currency || 'USD',
      document.date || new Date().toISOString().split('T')[0],
      document.category,
      document.file_path || null,
      document.project_id || null,
      JSON.stringify(document.metadata || {})
    ])

    return {
      ...document,
      id: (result as any).lastID
    }
  }

  async getDocuments(filters?: {
    type?: string
    category?: string
    project_id?: number
    date_from?: string
    date_to?: string
  }): Promise<FinanceDocument[]> {
    let query = 'SELECT * FROM finance_documents WHERE 1=1'
    const params: any[] = []

    if (filters?.type) {
      query += ' AND type = ?'
      params.push(filters.type)
    }

    if (filters?.category) {
      query += ' AND category = ?'
      params.push(filters.category)
    }

    if (filters?.project_id) {
      query += ' AND project_id = ?'
      params.push(filters.project_id)
    }

    if (filters?.date_from) {
      query += ' AND date >= ?'
      params.push(filters.date_from)
    }

    if (filters?.date_to) {
      query += ' AND date <= ?'
      params.push(filters.date_to)
    }

    query += ' ORDER BY date DESC'

    return await (this.all as any)(query, params)
  }

  async getDocument(id: number): Promise<FinanceDocument | null> {
    return await (this.get as any)('SELECT * FROM finance_documents WHERE id = ?', [id])
  }

  async updateDocument(id: number, updates: Partial<FinanceDocument>): Promise<void> {
    const fields = []
    const values = []

    for (const [key, value] of Object.entries(updates)) {
      if (key !== 'id' && value !== undefined) {
        fields.push(`${key} = ?`)
        values.push(typeof value === 'object' ? JSON.stringify(value) : value)
      }
    }

    if (fields.length === 0) return

    values.push(id)

    await (this.run as any)(`
      UPDATE finance_documents 
      SET ${fields.join(', ')}
      WHERE id = ?
    `, values)
  }

  async deleteDocument(id: number): Promise<void> {
    await (this.run as any)('DELETE FROM finance_documents WHERE id = ?', [id])
  }

  async getFinancialSummary(): Promise<{
    totalDocuments: number
    totalAmount: number
    byType: { [key: string]: { count: number; amount: number } }
    byCategory: { [key: string]: { count: number; amount: number } }
    monthlySpending: { month: string; amount: number }[]
  }> {
    // Total documents and amount
    const total = await (this.get as any)(`
      SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total
      FROM finance_documents
      WHERE amount IS NOT NULL
    `)

    // By type
    const byType = await (this.all as any)(`
      SELECT type, COUNT(*) as count, COALESCE(SUM(amount), 0) as amount
      FROM finance_documents
      WHERE amount IS NOT NULL
      GROUP BY type
    `)

    // By category
    const byCategory = await (this.all as any)(`
      SELECT category, COUNT(*) as count, COALESCE(SUM(amount), 0) as amount
      FROM finance_documents
      WHERE amount IS NOT NULL
      GROUP BY category
    `)

    // Monthly spending
    const monthlySpending = await (this.all as any)(`
      SELECT strftime('%Y-%m', date) as month, COALESCE(SUM(amount), 0) as amount
      FROM finance_documents
      WHERE amount IS NOT NULL AND date IS NOT NULL
      GROUP BY strftime('%Y-%m', date)
      ORDER BY month DESC
      LIMIT 12
    `)

    return {
      totalDocuments: total?.count || 0,
      totalAmount: total?.total || 0,
      byType: byType.reduce((acc: any, row: any) => {
        acc[row.type] = { count: row.count, amount: row.amount }
        return acc
      }, {}),
      byCategory: byCategory.reduce((acc: any, row: any) => {
        acc[row.category] = { count: row.count, amount: row.amount }
        return acc
      }, {}),
      monthlySpending
    }
  }

  async createBudgetTemplate(categories: { name: string; allocated: number }[]): Promise<void> {
    // This would typically create a budget template file
    // For now, we'll store it as metadata
    const template = {
      created_at: new Date().toISOString(),
      categories,
      total_allocated: categories.reduce((sum, cat) => sum + cat.allocated, 0)
    }

    await (this.run as any)(`
      INSERT INTO finance_documents (name, type, category, metadata)
      VALUES (?, ?, ?, ?)
    `, [
      'Budget Template',
      'budget',
      'budget',
      JSON.stringify(template)
    ])
  }

  async getExpenseCategories(): Promise<string[]> {
    const result = await (this.all as any)(`
      SELECT DISTINCT category 
      FROM finance_documents 
      WHERE category IS NOT NULL
      ORDER BY category
    `)
    
    return result.map((row: any) => row.category)
  }

  async getRecentExpenses(limit: number = 10): Promise<FinanceDocument[]> {
    return await (this.all as any)(`
      SELECT * FROM finance_documents
      WHERE amount IS NOT NULL
      ORDER BY date DESC, created_at DESC
      LIMIT ?
    `, [limit])
  }

  async searchDocuments(query: string): Promise<FinanceDocument[]> {
    return await (this.all as any)(`
      SELECT * FROM finance_documents
      WHERE name LIKE ? OR category LIKE ? OR type LIKE ?
      ORDER BY created_at DESC
    `, [`%${query}%`, `%${query}%`, `%${query}%`])
  }

  // File organization methods
  async organizeReceipts(sourcePath: string, targetPath: string): Promise<void> {
    // This would organize receipt files into categorized folders
    // Implementation would depend on specific file naming patterns
    console.log(`Organizing receipts from ${sourcePath} to ${targetPath}`)
  }

  async generateFinancialReport(startDate: string, endDate: string): Promise<{
    summary: any
    documents: FinanceDocument[]
    categories: any[]
  }> {
    const documents = await this.getDocuments({
      date_from: startDate,
      date_to: endDate
    })

    const summary = await this.getFinancialSummary()
    
    const categories = await (this.all as any)(`
      SELECT category, COUNT(*) as count, COALESCE(SUM(amount), 0) as amount
      FROM finance_documents
      WHERE date BETWEEN ? AND ? AND amount IS NOT NULL
      GROUP BY category
      ORDER BY amount DESC
    `, [startDate, endDate])

    return {
      summary,
      documents,
      categories
    }
  }
}
