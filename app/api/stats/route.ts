import { NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { FileScanner } from '@/lib/file-scanner'

export async function GET() {
  try {
    await database.initialize()
    
    const scanner = new FileScanner()
    const stats = await scanner.getSystemStats()
    
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
