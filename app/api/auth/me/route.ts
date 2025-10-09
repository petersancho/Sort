import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { authManager } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'No active session' },
        { status: 401 }
      )
    }

    const result = await authManager.validateSession(sessionId)

    if (!result.valid || !result.user) {
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        createdAt: result.user.createdAt,
        lastLogin: result.user.lastLogin
      }
    })

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication check failed' },
      { status: 500 }
    )
  }
}

