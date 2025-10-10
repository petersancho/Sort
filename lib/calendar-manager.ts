import { promisify } from 'util'
import { database } from './database'

export interface CalendarEvent {
  id?: number
  title: string
  description?: string
  start: string
  end: string
  all_day?: boolean
  project_id?: number
  todo_id?: number
  created_at?: string
  updated_at?: string
  metadata?: any
}

export class CalendarManager {
  private db = database.getDB()
  private run = promisify(this.db.run.bind(this.db))
  private all = promisify(this.db.all.bind(this.db))
  private get = promisify(this.db.get.bind(this.db))

  async addEvent(event: CalendarEvent): Promise<CalendarEvent> {
    const result = await (this.run as any)(`
      INSERT INTO calendar_events
      (title, description, start, end, all_day, project_id, todo_id, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      event.title,
      event.description || null,
      event.start,
      event.end,
      event.all_day ? 1 : 0,
      event.project_id || null,
      event.todo_id || null,
      JSON.stringify(event.metadata || {})
    ])

    return { ...event, id: (result as any).lastID }
  }

  async getEvent(id: number): Promise<CalendarEvent | null> {
    return await (this.get as any)('SELECT * FROM calendar_events WHERE id = ?', [id])
  }

  async getEventsInRange(startISO: string, endISO: string): Promise<CalendarEvent[]> {
    return await (this.all as any)(`
      SELECT * FROM calendar_events
      WHERE (start <= ? AND end >= ?)
      ORDER BY start ASC
    `, [endISO, startISO])
  }

  async getMonthlyEvents(year: number, month: number): Promise<CalendarEvent[]> {
    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0)).toISOString()
    const end = new Date(Date.UTC(year, month, 0, 23, 59, 59)).toISOString()
    return this.getEventsInRange(start, end)
  }

  async updateEvent(id: number, updates: Partial<CalendarEvent>): Promise<void> {
    const fields: string[] = []
    const values: any[] = []

    for (const [key, value] of Object.entries(updates)) {
      if (key !== 'id' && value !== undefined) {
        fields.push(`${key} = ?`)
        values.push(typeof value === 'object' && key === 'metadata' ? JSON.stringify(value) : value)
      }
    }

    if (fields.length === 0) return
    fields.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)

    await (this.run as any)(`
      UPDATE calendar_events
      SET ${fields.join(', ')}
      WHERE id = ?
    `, values)
  }

  async deleteEvent(id: number): Promise<void> {
    await (this.run as any)('DELETE FROM calendar_events WHERE id = ?', [id])
  }
}

