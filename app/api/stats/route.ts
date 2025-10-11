import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { database } from '@/lib/database'
import { promisify } from 'util'

export async function GET() {
  try {
    await database.initialize()
    const db = database.getDB()
    const all = promisify(db.all.bind(db)) as any
    
    const projects = await all('SELECT COUNT(*) as count FROM projects WHERE status = "active"')
    const todos = await all('SELECT COUNT(*) as count FROM todos WHERE status != "completed"')
    
    const stats = {
      totalFiles: 0,
      organizedFiles: 0,
      projects: projects[0]?.count || 0,
      todos: todos[0]?.count || 0
    }
    
    return NextResponse.json({
      success: true,
      stats
    })
    
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get stats' },
      { status: 500 }
    )
  }
}
