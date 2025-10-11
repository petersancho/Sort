'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { useEffect, useMemo, useState } from 'react'
import {
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  isWithinInterval,
  parseISO
} from 'date-fns'
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, X, Edit, Trash2 } from 'lucide-react'

interface CalendarEvent {
  id: number
  title: string
  description?: string
  start: string
  end: string
  all_day?: boolean
  project_id?: number
  todo_id?: number
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    all_day: false,
    date: '',
    startTime: '09:00',
    endTime: '10:00'
  })

  const year = currentDate.getUTCFullYear()
  const month = currentDate.getUTCMonth() + 1

  useEffect(() => {
    loadEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month])

  const loadEvents = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/calendar?year=${year}&month=${month}`)
      const data = await response.json()
      if (data.success) setEvents(data.events)
    } catch (e) {
      console.error('Failed to load events', e)
    } finally {
      setIsLoading(false)
    }
  }

  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 })
    return eachDayOfInterval({ start, end })
  }, [currentDate])

  const openAddModal = (date: Date) => {
    setSelectedDate(date)
    setNewEvent(ev => ({
      ...ev,
      date: format(date, 'yyyy-MM-dd')
    }))
    setShowAddModal(true)
  }

  const submitNewEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!newEvent.title) return
      const dateStr = newEvent.date
      const startISO = newEvent.all_day
        ? new Date(`${dateStr}T00:00:00.000Z`).toISOString()
        : new Date(`${dateStr}T${newEvent.startTime}:00.000Z`).toISOString()
      const endISO = newEvent.all_day
        ? new Date(`${dateStr}T23:59:59.999Z`).toISOString()
        : new Date(`${dateStr}T${newEvent.endTime}:00.000Z`).toISOString()

      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newEvent.title,
          description: newEvent.description || undefined,
          start: startISO,
          end: endISO,
          all_day: newEvent.all_day
        })
      })
      const data = await res.json()
      if (data.success) {
        setShowAddModal(false)
        setNewEvent({ title: '', description: '', all_day: false, date: '', startTime: '09:00', endTime: '10:00' })
        loadEvents()
      }
    } catch (err) {
      console.error('Failed to add event', err)
    }
  }

  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm('Delete this event?')) return
    try {
      const res = await fetch(`/api/calendar/${eventId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        loadEvents()
      }
    } catch (err) {
      console.error('Failed to delete event', err)
    }
  }

  const openEditModal = (event: CalendarEvent) => {
    setEditingEvent(event)
    setShowEditModal(true)
  }

  const submitEditEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEvent) return
    try {
      const res = await fetch(`/api/calendar/${editingEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingEvent.title,
          description: editingEvent.description,
          start: editingEvent.start,
          end: editingEvent.end,
          all_day: editingEvent.all_day
        })
      })
      const data = await res.json()
      if (data.success) {
        setShowEditModal(false)
        setEditingEvent(null)
        loadEvents()
      }
    } catch (err) {
      console.error('Failed to update event', err)
    }
  }

  const eventsForDay = (day: Date) => {
    return events.filter(ev =>
      isWithinInterval(day, { start: parseISO(ev.start), end: parseISO(ev.end) })
    )
  }

  const goPrevMonth = () => setCurrentDate(d => subMonths(d, 1))
  const goNextMonth = () => setCurrentDate(d => addMonths(d, 1))
  const goToday = () => setCurrentDate(new Date())

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <CalendarIcon className="h-8 w-8" /> Calendar
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Plan and track your events</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={goPrevMonth} className="btn-secondary p-2"><ChevronLeft className="h-5 w-5" /></button>
            <div className="px-4 py-2 border rounded-lg text-gray-900 dark:text-white">
              {format(currentDate, 'MMMM yyyy')}
            </div>
            <button onClick={goNextMonth} className="btn-secondary p-2"><ChevronRight className="h-5 w-5" /></button>
            <button onClick={goToday} className="btn-secondary">Today</button>
            <button onClick={() => openAddModal(new Date())} className="btn-primary flex items-center gap-2">
              <Plus className="h-5 w-5" /> Add Event
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
            <div key={d} className="px-2 py-1">{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {monthDays.map((day) => {
            const dayEvents = eventsForDay(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            return (
              <button
                key={day.toISOString()}
                onClick={() => openAddModal(day)}
                className={`relative h-32 p-2 rounded-lg border text-left transition-colors ${
                  isCurrentMonth
                    ? 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    : 'border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 text-gray-400'
                }`}
              >
                <div className={`flex items-center justify-between mb-1`}>
                  <span className={`text-sm ${isToday(day) ? 'text-primary-600 font-semibold' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  {isToday(day) && (
                    <span className="text-xs text-primary-600">Today</span>
                  )}
                </div>
                <div className="space-y-1 overflow-hidden">
                  {dayEvents.slice(0, 3).map(ev => (
                    <div 
                      key={ev.id} 
                      className="group truncate text-xs px-2 py-1 rounded bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 flex items-center justify-between hover:bg-primary-200"
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditModal(ev)
                      }}
                    >
                      <span className="truncate flex-1">{ev.title}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteEvent(ev.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 ml-1 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Add Event Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-6 w-full max-w-md mx-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Event</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={submitNewEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="allDay"
                    type="checkbox"
                    checked={newEvent.all_day}
                    onChange={(e) => setNewEvent({ ...newEvent, all_day: e.target.checked })}
                  />
                  <label htmlFor="allDay" className="text-sm text-gray-700 dark:text-gray-300">All day</label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  {!newEvent.all_day && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start</label>
                        <input
                          type="time"
                          value={newEvent.startTime}
                          onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End</label>
                        <input
                          type="time"
                          value={newEvent.endTime}
                          onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">Add</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Event Modal */}
        {showEditModal && editingEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-6 w-full max-w-md mx-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Event</h2>
                <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={submitEditEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    value={editingEvent.description || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">Save</button>
                  <button 
                    type="button" 
                    onClick={() => {
                      handleDeleteEvent(editingEvent.id)
                      setShowEditModal(false)
                    }}
                    className="btn-secondary text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

