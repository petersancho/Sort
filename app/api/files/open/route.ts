import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const { path } = await request.json()
    
    if (!path) {
      return NextResponse.json(
        { success: false, error: 'File path is required' },
        { status: 400 }
      )
    }

    // On macOS, use the 'open' command to open files with their default applications
    const command = `open "${path}"`
    
    try {
      await execAsync(command)
      return NextResponse.json({
        success: true,
        message: 'File opened successfully'
      })
    } catch (error) {
      console.error('Failed to open file:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to open file' },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('Open file error:', error)
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    )
  }
}
