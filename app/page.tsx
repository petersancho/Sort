'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  FolderOpen, 
  FileText, 
  DollarSign, 
  CheckSquare, 
  Settings, 
  Scan,
  BarChart3,
  Zap,
  Plus,
  X
} from 'lucide-react'

interface SystemStats {
  totalFiles: number
  organizedFiles: number
  projects: number
  todos: number
}

export default function HomePage() {
  const [stats, setStats] = useState<SystemStats>({
    totalFiles: 0,
    organizedFiles: 0,
    projects: 0,
    todos: 0
  })
  
  const [isScanning, setIsScanning] = useState(false)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [showAddTodoModal, setShowAddTodoModal] = useState(false)
  const router = useRouter()

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    template: 'personal-project'
  })

  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    due_date: ''
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      })
      const data = await response.json()
      if (data.success) {
        setShowNewProjectModal(false)
        setNewProject({ name: '', description: '', template: 'personal-project' })
        router.push('/projects')
      }
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
      })
      const data = await response.json()
      if (data.success) {
        setShowAddTodoModal(false)
        setNewTodo({ title: '', description: '', priority: 'medium', due_date: '' })
        router.push('/todos')
      }
    } catch (error) {
      console.error('Failed to create todo:', error)
    }
  }

  const modules = [
    {
      title: 'File Scanner',
      description: 'Intelligent file categorization and organization',
      icon: Scan,
      color: 'bg-black',
      href: '/scanner'
    },
    {
      title: 'Project Manager',
      description: 'Template-based project organization',
      icon: FolderOpen,
      color: 'bg-black',
      href: '/projects'
    },
    {
      title: 'Finance Tracker',
      description: 'Financial document organization',
      icon: DollarSign,
      color: 'bg-black',
      href: '/finance'
    },
    {
      title: 'Todo System',
      description: 'Task management with file associations',
      icon: CheckSquare,
      color: 'bg-black',
      href: '/todos'
    },
    {
      title: 'Analytics',
      description: 'System usage and file insights',
      icon: BarChart3,
      color: 'bg-black',
      href: '/analytics'
    },
    {
      title: 'Settings',
      description: 'Customize sorting rules and preferences',
      icon: Settings,
      color: 'bg-black',
      href: '/settings'
    }
  ]

  const handleScanFiles = async () => {
    setIsScanning(true)
    try {
      const response = await fetch('/api/scan-files', { method: 'POST' })
      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error('Scan failed:', error)
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-black mb-4">
            Welcome to Sort System
          </h1>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Your comprehensive file organization platform for projects, finances, and task management
          </p>
        </motion.div>

        {/* Stats Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Total Files</p>
                <p className="text-3xl font-bold text-black">{stats.totalFiles.toLocaleString()}</p>
              </div>
              <FileText className="h-8 w-8 text-black" />
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Organized</p>
                <p className="text-3xl font-bold text-black">{stats.organizedFiles.toLocaleString()}</p>
              </div>
              <Zap className="h-8 w-8 text-black" />
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Projects</p>
                <p className="text-3xl font-bold text-black">{stats.projects}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-black" />
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Active Todos</p>
                <p className="text-3xl font-bold text-black">{stats.todos}</p>
              </div>
              <CheckSquare className="h-8 w-8 text-black" />
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleScanFiles}
                disabled={isScanning}
                className="btn-primary flex items-center gap-2"
              >
                <Scan className="h-5 w-5" />
                {isScanning ? 'Scanning...' : 'Scan All Files'}
              </button>
              <button 
                onClick={() => setShowNewProjectModal(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <FolderOpen className="h-5 w-5" />
                New Project
              </button>
              <button 
                onClick={() => setShowAddTodoModal(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <CheckSquare className="h-5 w-5" />
                Add Todo
              </button>
            </div>
          </div>
        </motion.div>

        {/* Module Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {modules.map((module, index) => {
            const IconComponent = module.icon
            return (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="card p-6 cursor-pointer hover:shadow-xl transition-shadow duration-200"
                onClick={() => window.location.href = module.href}
              >
                <div className={`${module.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {module.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {module.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* New Project Modal */}
        {showNewProjectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-8 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Project</h2>
                <button onClick={() => setShowNewProjectModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="My Awesome Project"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Project description..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Template
                  </label>
                  <select
                    value={newProject.template}
                    onChange={(e) => setNewProject({ ...newProject, template: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="personal-project">Personal Project</option>
                    <option value="web-development">Web Development</option>
                    <option value="design-project">Design Project</option>
                    <option value="finance-project">Finance Project</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewProjectModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Create Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Add Todo Modal */}
        {showAddTodoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-8 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Todo</h2>
                <button onClick={() => setShowAddTodoModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateTodo} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newTodo.title}
                    onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="What needs to be done?"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTodo.description}
                    onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Additional details..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTodo.priority}
                      onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTodo.due_date}
                      onChange={(e) => setNewTodo({ ...newTodo, due_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddTodoModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Add Todo
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
