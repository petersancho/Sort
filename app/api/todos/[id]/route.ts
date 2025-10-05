import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { TodoManager } from '@/lib/todo-manager'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await database.initialize()
    
    const todoManager = new TodoManager()
    const body = await request.json()
    const id = parseInt(params.id)
    
    await todoManager.updateTodo(id, body)
    
    return NextResponse.json({
      success: true,
      message: 'Todo updated successfully'
    })
    
  } catch (error) {
    console.error('Todo PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update todo' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await database.initialize()
    
    const todoManager = new TodoManager()
    const id = parseInt(params.id)
    
    await todoManager.deleteTodo(id)
    
    return NextResponse.json({
      success: true,
      message: 'Todo deleted successfully'
    })
    
  } catch (error) {
    console.error('Todo DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete todo' },
      { status: 500 }
    )
  }
}
