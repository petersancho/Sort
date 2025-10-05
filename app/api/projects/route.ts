import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { ProjectManager } from '@/lib/project-manager'

export async function GET() {
  try {
    await database.initialize()
    
    const projectManager = new ProjectManager()
    const projects = await projectManager.getProjects()
    
    return NextResponse.json({
      success: true,
      projects
    })
    
  } catch (error) {
    console.error('Projects GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await database.initialize()
    
    const projectManager = new ProjectManager()
    const body = await request.json()
    
    const project = await projectManager.createProject(body)
    
    return NextResponse.json({
      success: true,
      project
    })
    
  } catch (error) {
    console.error('Projects POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
