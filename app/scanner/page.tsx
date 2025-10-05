'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Scan, 
  FileText, 
  FolderOpen,
  Settings,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  ExternalLink,
  Eye
} from 'lucide-react'
import FileViewer from '@/components/FileViewer'

interface ScanResult {
  totalFiles: number
  organizedFiles: number
  categories: { [key: string]: number }
  recentFiles: any[]
}

interface File {
  id: number
  name: string
  path: string
  extension: string
  size: number
  category?: string
  created_at: string
  modified_at: string
}

export default function ScannerPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResults, setScanResults] = useState<ScanResult | null>(null)
  const [scanProgress, setScanProgress] = useState(0)
  const [recentFiles, setRecentFiles] = useState<File[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isFileViewerOpen, setIsFileViewerOpen] = useState(false)

  useEffect(() => {
    loadRecentFiles()
  }, [])

  const loadRecentFiles = async () => {
    try {
      const response = await fetch('/api/files?recent=true&limit=10')
      const data = await response.json()
      if (data.success) {
        setRecentFiles(data.files)
      }
    } catch (error) {
      console.error('Failed to load recent files:', error)
    }
  }

  const handleScan = async () => {
    setIsScanning(true)
    setScanProgress(0)
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 500)

    try {
      const response = await fetch('/api/scan-files', { method: 'POST' })
      const data = await response.json()
      
      if (data.success) {
        setScanResults({
          totalFiles: data.filesScanned,
          organizedFiles: data.stats.organizedFiles,
          categories: {},
          recentFiles: []
        })
        setScanProgress(100)
        loadRecentFiles() // Reload recent files after scan
      }
    } catch (error) {
      console.error('Scan failed:', error)
    } finally {
      setIsScanning(false)
      clearInterval(progressInterval)
    }
  }

  const handleFileClick = (file: File) => {
    setSelectedFile(file)
    setIsFileViewerOpen(true)
  }

  const handleOpenFile = async (file: File) => {
    try {
      const response = await fetch('/api/files/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: file.path })
      })
      
      if (!response.ok) {
        console.error('Failed to open file')
      }
    } catch (error) {
      console.error('Failed to open file:', error)
    }
  }

  const categories = [
    { name: 'Documents', count: 245, color: 'bg-black' },
    { name: 'Images', count: 189, color: 'bg-black' },
    { name: 'Code', count: 156, color: 'bg-black' },
    { name: 'Media', count: 98, color: 'bg-black' },
    { name: 'Archives', count: 34, color: 'bg-black' },
    { name: 'Other', count: 67, color: 'bg-black' }
  ]

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">
              File Scanner
            </h1>
            <p className="text-black">
              Intelligent file categorization and organization
            </p>
          </div>
          
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="btn-primary flex items-center gap-2"
          >
            {isScanning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            {isScanning ? 'Scanning...' : 'Scan Files'}
          </button>
        </div>

        {/* Scan Progress */}
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <Scan className="h-8 w-8 text-primary-600 animate-pulse" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Scanning Files
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Analyzing and categorizing your files...
                </p>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div
                className="bg-primary-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${scanProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              {scanProgress}% complete
            </p>
          </motion.div>
        )}

        {/* Scan Results */}
        {scanResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Scan Complete
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Found and organized {scanResults.totalFiles} files
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{scanResults.totalFiles}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Files</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{scanResults.organizedFiles}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Organized</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round((scanResults.organizedFiles / scanResults.totalFiles) * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Organization Rate</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* File Categories */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              File Categories
            </h2>
            <button className="btn-secondary flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Customize Rules
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-4 h-4 rounded-full ${category.color}`} />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {category.count.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  files organized
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Files */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recently Scanned Files
            </h2>
            <button className="btn-secondary">
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {recentFiles.length > 0 ? recentFiles.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => handleFileClick(file)}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {file.category} • {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(file.modified_at).toLocaleDateString()}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOpenFile(file)
                    }}
                    className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                    title="Open in system"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No files found. Run a scan to discover files.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full btn-secondary flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Organize Downloads
              </button>
              <button className="w-full btn-secondary flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Generate Report
              </button>
              <button className="w-full btn-secondary flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configure Rules
              </button>
            </div>
          </div>
          
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              System Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Scanner Status</span>
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Last Scan</span>
                <span className="text-gray-900 dark:text-white">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Auto Scan</span>
                <span className="flex items-center gap-1 text-blue-600">
                  <Clock className="h-4 w-4" />
                  Enabled
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* File Viewer Modal */}
        {selectedFile && (
          <FileViewer
            file={selectedFile}
            isOpen={isFileViewerOpen}
            onClose={() => {
              setIsFileViewerOpen(false)
              setSelectedFile(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
