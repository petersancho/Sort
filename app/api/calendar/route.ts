import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { CalendarManager } from '@/lib/calendar-manager'

export async function GET(request: NextRequest) {
  try {
    await database.initialize()
    const calendar = new CalendarManager()

    const { searchParams } = new URL(request.url)
    const yearParam = searchParams.get('year')
    const monthParam = searchParams.get('month')
    const startParam = searchParams.get('start')
    const endParam = searchParams.get('end')

    let events
    if (startParam && endParam) {
      events = await calendar.getEventsInRange(startParam, endParam)
    } else if (yearParam && monthParam) {
      const year = parseInt(yearParam)
      const month = parseInt(monthParam)
      events = await calendar.getMonthlyEvents(year, month)
    } else {
      const now = new Date()
      const year = now.getUTCFullYear()
      const month = now.getUTCMonth() + 1
      events = await calendar.getMonthlyEvents(year, month)
    }

    return NextResponse.json({ success: true, events })
  } catch (error) {
    console.error('Calendar GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get calendar events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await database.initialize()
    const calendar = new CalendarManager()
    const body = await request.json()

    if (!body?.title || !body?.start || !body?.end) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, start, end' },
        { status: 400 }
      )
    }

    const event = await calendar.addEvent({
      title: body.title,
      description: body.description,
      start: body.start,
      end: body.end,
      all_day: !!body.all_day,
      project_id: body.project_id ? Number(body.project_id) : undefined,
      todo_id: body.todo_id ? Number(body.todo_id) : undefined,
      metadata: body.metadata || {}
    })

    return NextResponse.json({ success: true, event })
  } catch (error) {
    console.error('Calendar POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create calendar event' },
      { status: 500 }
    )
  }
}

