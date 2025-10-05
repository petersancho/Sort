import { NextRequest, NextResponse } from 'next/server'
import { authManager } from '@/lib/auth'
import { getUserDatabase } from '@/lib/user-database'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value
    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const authResult = await authManager.validateSession(sessionId)
    if (!authResult.valid || !authResult.user) {
      return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 })
    }

    const userDb = getUserDatabase(authResult.user.id)
    await userDb.initialize()
    
    const db = userDb.getDB()
    const all = require('util').promisify(db.all.bind(db))
    
    const projects = await all('SELECT * FROM finance_projects ORDER BY created_at DESC')
    
    return NextResponse.json({
      success: true,
      projects
    })
    
  } catch (error) {
    console.error('Finance projects GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get finance projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value
    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const authResult = await authManager.validateSession(sessionId)
    if (!authResult.valid || !authResult.user) {
      return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 })
    }

    const userDb = getUserDatabase(authResult.user.id)
    await userDb.initialize()
    
    const db = userDb.getDB()
    const run = require('util').promisify(db.run.bind(db))
    
    const body = await request.json()
    
    const result = await run(`
      INSERT INTO finance_projects (name, description, budget, currency, start_date, end_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      body.name,
      body.description,
      body.budget || null,
      body.currency || 'USD',
      body.start_date || null,
      body.end_date || null,
      body.status || 'active'
    ])
    
    return NextResponse.json({
      success: true,
      project: {
        id: (result as any).lastID,
        ...body
      }
    })
    
  } catch (error) {
    console.error('Finance projects POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create finance project' },
      { status: 500 }
    )
  }
}

