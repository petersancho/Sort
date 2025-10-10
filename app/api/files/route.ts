import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { database } from '@/lib/database'
import { FileScanner } from '@/lib/file-scanner'

export async function GET(request: NextRequest) {
  try {
    await database.initialize()
    
    const scanner = new FileScanner()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '100')
    const recent = searchParams.get('recent') === 'true'
    
    let files
    
    if (recent) {
      files = await scanner.getRecentFiles(limit)
    } else {
      files = await scanner.getFilesByCategory(category || undefined, limit)
    }
    
    return NextResponse.json({
      success: true,
      files
    })
    
  } catch (error) {
    console.error('Files error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get files' },
      { status: 500 }
    )
  }
}
