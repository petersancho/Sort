import { NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { ProjectManager } from '@/lib/project-manager'

export async function GET() {
  try {
    await database.initialize()
    
    const projectManager = new ProjectManager()
    const templates = projectManager.getAvailableTemplates()
    
    return NextResponse.json({
      success: true,
      templates
    })
    
  } catch (error) {
    console.error('Templates error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get templates' },
      { status: 500 }
    )
  }
}
