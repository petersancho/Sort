import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { authManager } from '@/lib/auth'
import { getUserDatabase } from '@/lib/user-database'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Username, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const result = await authManager.register(username, email, password)

    if (result.success && result.user) {
      // Initialize user database
      const userDb = getUserDatabase(result.user.id)
      await userDb.initialize()

      // Send welcome email (best-effort)
      try {
        await sendEmail({
          to: result.user.email,
          subject: 'Welcome to Sort System',
          text: `Hi ${result.user.username}, welcome to Sort System!`,
        })
      } catch (e) {
        console.warn('Email send skipped/failed:', (e as Error)?.message)
      }

      return NextResponse.json({
        success: true,
        message: result.message,
        user: {
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          createdAt: result.user.createdAt
        }
      })
    }

    return NextResponse.json(
      { success: false, error: result.message },
      { status: 400 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    )
  }
}

