'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FolderOpen,
  Calendar,
  CheckSquare,
  FileText,
  BarChart3,
  Plus,
  TrendingUp,
  Clock
} from 'lucide-react'

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const [project, setProject] = useState<any>(null)
  const [widgets, setWidgets] = useState({
    todos: [],
    events: [],
    finances: [],
    files: [],
    stats: null
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProject()
    loadWidgets()
  }, [projectId])

  const loadProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      const data = await response.json()
      if (data.success) {
        setProject(data.project)
      }
    } catch (error) {
      console.error('Failed to load project:', error)
    }
  }

  const loadWidgets = async () => {
    try {
      const [todosRes, eventsRes] = await Promise.all([
        fetch(`/api/todos?project_id=${projectId}`),
        fetch('/api/calendar')
      ])

      const [todosData, eventsData] = await Promise.all([
        todosRes.json(),
        eventsRes.json()
      ])

      setWidgets({
        todos: todosData.todos || [],
        events: eventsData.events || [],
        finances: [],
        files: [],
        stats: null
      })
    } catch (error) {
      console.error('Failed to load widgets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Project Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold italic text-gray-900 dark:text-white mb-2">
            {project.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {project.description}
          </p>
        </div>

        {/* Widget Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Todos Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                <h3 className="font-bold italic text-gray-900 dark:text-white">TODOS</h3>
              </div>
              <Plus className="h-5 w-5 text-gray-400 cursor-pointer hover:text-black" />
            </div>
            <div className="space-y-2">
              {widgets.todos.slice(0, 5).map((todo: any) => (
                <div key={todo.id} className="flex items-center gap-2 text-sm">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="truncate font-bold">{todo.title}</span>
                </div>
              ))}
              {widgets.todos.length === 0 && (
                <p className="text-sm text-gray-500">NO TODOS YET</p>
              )}
            </div>
          </motion.div>

          {/* Calendar Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <h3 className="font-bold italic text-gray-900 dark:text-white">EVENTS</h3>
              </div>
              <Plus className="h-5 w-5 text-gray-400 cursor-pointer hover:text-black" />
            </div>
            <div className="space-y-2">
              {widgets.events.slice(0, 5).map((event: any) => (
                <div key={event.id} className="flex items-center gap-2 text-sm">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="truncate font-bold">{event.title}</span>
                </div>
              ))}
              {widgets.events.length === 0 && (
                <p className="text-sm text-gray-500">NO EVENTS YET</p>
              )}
            </div>
          </motion.div>

          {/* Notes Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <h3 className="font-bold italic text-gray-900 dark:text-white">NOTES</h3>
              </div>
              <Plus className="h-5 w-5 text-gray-400 cursor-pointer hover:text-black" />
            </div>
            <p className="text-sm text-gray-500">PROJECT NOTES AND DOCUMENTATION</p>
          </motion.div>

          {/* Analytics Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5" />
              <h3 className="font-bold italic text-gray-900 dark:text-white">ANALYTICS</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">COMPLETION RATE</p>
                <p className="text-2xl font-bold text-black">78%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">TOTAL ITEMS</p>
                <p className="text-2xl font-bold text-black">
                  {(widgets.todos.length || 0) + (widgets.events.length || 0)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Activity Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5" />
              <h3 className="font-bold italic text-gray-900 dark:text-white">ACTIVITY</h3>
            </div>
            <p className="text-sm text-gray-500">RECENT ACTIVITY TRACKING COMING SOON</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

