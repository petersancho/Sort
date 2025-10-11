import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { database } from '@/lib/database'
import { FinanceTracker } from '@/lib/finance-tracker'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await database.initialize()
    
    const financeTracker = new FinanceTracker()
    const body = await request.json()
    const id = parseInt(params.id)
    
    await financeTracker.updateDocument(id, body)
    
    return NextResponse.json({
      success: true,
      message: 'Document updated successfully'
    })
    
  } catch (error) {
    console.error('Finance document PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update document' },
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
    
    const financeTracker = new FinanceTracker()
    const id = parseInt(params.id)
    
    await financeTracker.deleteDocument(id)
    
    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    })
    
  } catch (error) {
    console.error('Finance document DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete document' },
      { status: 500 }
    )
  }
}

