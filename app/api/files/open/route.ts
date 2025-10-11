import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const { path, app } = await request.json()
    
    if (!path) {
      return NextResponse.json(
        { success: false, error: 'File path is required' },
        { status: 400 }
      )
    }

    // On macOS, use the 'open' command (optionally with a specific app)
    // On Linux/Windows this would need adapting (xdg-open/start)
    const command = app ? `open -a "${app}" "${path}"` : `open "${path}"`
    
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
