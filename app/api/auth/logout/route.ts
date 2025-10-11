import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { authManager } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'No active session' },
        { status: 400 }
      )
    }

    const result = await authManager.logout(sessionId)

    const response = NextResponse.json({
      success: result.success,
      message: result.message
    })

    // Clear session cookie
    response.cookies.set('sessionId', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    )
  }
}

