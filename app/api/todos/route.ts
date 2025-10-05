import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { TodoManager } from '@/lib/todo-manager'

export async function GET(request: NextRequest) {
  try {
    await database.initialize()
    
    const todoManager = new TodoManager()
    const { searchParams } = new URL(request.url)
    
    const filters = {
      status: searchParams.get('status') || undefined,
      priority: searchParams.get('priority') || undefined,
      project_id: searchParams.get('project_id') ? parseInt(searchParams.get('project_id')!) : undefined,
      due_soon: searchParams.get('due_soon') === 'true',
      overdue: searchParams.get('overdue') === 'true'
    }
    
    const todos = await todoManager.getTodos(filters)
    
    return NextResponse.json({
      success: true,
      todos
    })
    
  } catch (error) {
    console.error('Todos GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get todos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await database.initialize()
    
    const todoManager = new TodoManager()
    const body = await request.json()
    
    const todo = await todoManager.addTodo(body)
    
    return NextResponse.json({
      success: true,
      todo
    })
    
  } catch (error) {
    console.error('Todos POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create todo' },
      { status: 500 }
    )
  }
}
