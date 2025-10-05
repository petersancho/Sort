import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { FinanceTracker } from '@/lib/finance-tracker'

export async function GET(request: NextRequest) {
  try {
    await database.initialize()
    
    const financeTracker = new FinanceTracker()
    const { searchParams } = new URL(request.url)
    
    const filters = {
      type: searchParams.get('type') || undefined,
      category: searchParams.get('category') || undefined,
      project_id: searchParams.get('project_id') ? parseInt(searchParams.get('project_id')!) : undefined,
      date_from: searchParams.get('date_from') || undefined,
      date_to: searchParams.get('date_to') || undefined
    }
    
    const documents = await financeTracker.getDocuments(filters)
    
    return NextResponse.json({
      success: true,
      documents
    })
    
  } catch (error) {
    console.error('Finance documents GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get documents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await database.initialize()
    
    const financeTracker = new FinanceTracker()
    const body = await request.json()
    
    const document = await financeTracker.addDocument(body)
    
    return NextResponse.json({
      success: true,
      document
    })
    
  } catch (error) {
    console.error('Finance documents POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add document' },
      { status: 500 }
    )
  }
}
