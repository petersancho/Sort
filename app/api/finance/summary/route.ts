import { NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { FinanceTracker } from '@/lib/finance-tracker'

export async function GET() {
  try {
    await database.initialize()
    
    const financeTracker = new FinanceTracker()
    const summary = await financeTracker.getFinancialSummary()
    
    return NextResponse.json({
      success: true,
      summary
    })
    
  } catch (error) {
    console.error('Finance summary error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get financial summary' },
      { status: 500 }
    )
  }
}
