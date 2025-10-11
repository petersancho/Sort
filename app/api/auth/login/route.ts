import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { authManager } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const result = await authManager.login(username, password)

    if (result.success && result.sessionId && result.user) {
      // Set session cookie
      const response = NextResponse.json({
        success: true,
        message: result.message,
        user: {
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          createdAt: result.user.createdAt,
          lastLogin: result.user.lastLogin
        }
      })

      response.cookies.set('sessionId', result.sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 // 30 days
      })

      return response
    }

    return NextResponse.json(
      { success: false, error: result.message },
      { status: 401 }
    )

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
}

