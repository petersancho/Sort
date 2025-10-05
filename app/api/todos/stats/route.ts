import { NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { TodoManager } from '@/lib/todo-manager'

export async function GET() {
  try {
    await database.initialize()
    
    const todoManager = new TodoManager()
    const stats = await todoManager.getTodoStats()
    
    return NextResponse.json({
      success: true,
      stats
    })
    
  } catch (error) {
    console.error('Todo stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get todo stats' },
      { status: 500 }
    )
  }
}
