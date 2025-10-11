'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FolderOpen, 
  FileText, 
  DollarSign, 
  CheckSquare, 
  Settings, 
  Scan,
  BarChart3,
  Zap
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
          <h1 className="text-4xl font-bold italic text-black mb-4">
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
              <button className="btn-secondary flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                New Project
              </button>
              <button className="btn-secondary flex items-center gap-2">
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
      </div>
    </div>
  )
}
