import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { CalendarManager } from '@/lib/calendar-manager'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await database.initialize()
    const calendar = new CalendarManager()
    const id = parseInt(params.id)
    const body = await request.json()

    await calendar.updateEvent(id, body)

    return NextResponse.json({ success: true, message: 'Event updated' })
  } catch (error) {
    console.error('Calendar PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update calendar event' },
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
    const calendar = new CalendarManager()
    const id = parseInt(params.id)

    await calendar.deleteEvent(id)

    return NextResponse.json({ success: true, message: 'Event deleted' })
  } catch (error) {
    console.error('Calendar DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete calendar event' },
      { status: 500 }
    )
  }
}
