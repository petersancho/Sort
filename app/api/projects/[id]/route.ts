import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { database } from '@/lib/database'
import { ProjectManager } from '@/lib/project-manager'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await database.initialize()
    
    const projectManager = new ProjectManager()
    const body = await request.json()
    const id = parseInt(params.id)
    
    await projectManager.updateProject(id, body)
    
    return NextResponse.json({
      success: true,
      message: 'Project updated successfully'
    })
    
  } catch (error) {
    console.error('Project PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
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
    
    const projectManager = new ProjectManager()
    const id = parseInt(params.id)
    
    await projectManager.deleteProject(id)
    
    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    })
    
  } catch (error) {
    console.error('Project DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}

