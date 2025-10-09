'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  FolderOpen,
  DollarSign,
  CheckSquare,
  Calendar,
  Download,
  Filter,
  Clock
} from 'lucide-react'

interface AnalyticsData {
  filesByCategory: { [key: string]: number }
  monthlyGrowth: { month: string; files: number }[]
  projectStats: { [key: string]: number }
  financialSummary: { total: number; monthly: number }
  todoStats: { completed: number; pending: number }
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange])

  const loadAnalyticsData = async () => {
    try {
      // Simulate API call - in real implementation, this would fetch from actual endpoints
      setTimeout(() => {
        setAnalyticsData({
          filesByCategory: {
            'Documents': 1245,
            'Images': 892,
            'Code': 456,
            'Media': 234,
            'Archives': 123,
            'Other': 67
          },
          monthlyGrowth: [
            { month: 'Jan', files: 120 },
            { month: 'Feb', files: 145 },
            { month: 'Mar', files: 178 },
            { month: 'Apr', files: 203 },
            { month: 'May', files: 234 },
            { month: 'Jun', files: 267 }
          ],
          projectStats: {
            'Web Development': 12,
            'Design Projects': 8,
            'Finance Projects': 5,
            'Personal Projects': 15
          },
          financialSummary: {
            total: 45678.90,
            monthly: 3245.67
          },
          todoStats: {
            completed: 89,
            pending: 23
          }
        })
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to load analytics:', error)
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const topCategories = Object.entries(analyticsData?.filesByCategory || {})
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Insights into your file organization and productivity
            </p>
          </div>
          
          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <button className="btn-secondary flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Files</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {Object.values(analyticsData?.filesByCategory || {}).reduce((a, b) => a + b, 0).toLocaleString()}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
                <p className="text-3xl font-bold text-green-600">
                  {Object.values(analyticsData?.projectStats || {}).reduce((a, b) => a + b, 0)}
                </p>
              </div>
              <FolderOpen className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Financial Total</p>
                <p className="text-3xl font-bold text-yellow-600">
                  ${analyticsData?.financialSummary.total.toLocaleString() || '0'}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tasks Completed</p>
                <p className="text-3xl font-bold text-purple-600">
                  {analyticsData?.todoStats.completed || 0}
                </p>
              </div>
              <CheckSquare className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* File Categories Chart */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Files by Category
              </h2>
              <BarChart3 className="h-6 w-6 text-gray-500" />
            </div>
            
            <div className="space-y-4">
              {topCategories.map(([category, count], index) => {
                const total = Object.values(analyticsData?.filesByCategory || {}).reduce((a, b) => a + b, 0)
                const percentage = Math.round((count / total) * 100)
                
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {category}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {count.toLocaleString()} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-primary-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Monthly Growth */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Monthly Growth
              </h2>
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            
            <div className="space-y-4">
              {analyticsData?.monthlyGrowth.map((item, index) => (
                <motion.div
                  key={item.month}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.month}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-green-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.files / 300) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                      {item.files}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Project and Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Project Statistics */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Project Distribution
            </h2>
            
            <div className="space-y-4">
              {Object.entries(analyticsData?.projectStats || {}).map(([project, count], index) => (
                <motion.div
                  key={project}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FolderOpen className="h-5 w-5 text-blue-500" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {project}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {count}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Financial Overview */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Financial Overview
            </h2>
            
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Tracked</p>
                <p className="text-3xl font-bold text-green-600">
                  ${analyticsData?.financialSummary.total.toLocaleString() || '0'}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">This Month</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${analyticsData?.financialSummary.monthly.toLocaleString() || '0'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Documents</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">45</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">12</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Productivity Metrics */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Productivity Metrics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <CheckSquare className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData?.todoStats.completed || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</p>
            </div>
            
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData?.todoStats.pending || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Tasks</p>
            </div>
            
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(((analyticsData?.todoStats.completed || 0) / 
                  ((analyticsData?.todoStats.completed || 0) + (analyticsData?.todoStats.pending || 0))) * 100)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
