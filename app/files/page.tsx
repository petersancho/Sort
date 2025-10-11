'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Folder,
  FolderOpen,
  File,
  FileText,
  Image,
  Film,
  Music,
  Archive,
  Code,
  ChevronRight,
  ChevronDown,
  Search,
  Grid3x3,
  List,
  SortAsc,
  Eye,
  ExternalLink,
  Trash2,
  FolderInput
} from 'lucide-react'

interface FileNode {
  id: number
  name: string
  path: string
  extension?: string
  size: number
  category?: string
  type: 'file' | 'folder'
  modified_at: string
  children?: FileNode[]
}

export default function FilesPage() {
  const [files, setFiles] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [selectedFile, setSelectedFile] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      const response = await fetch('/api/files?limit=500')
      const data = await response.json()
      if (data.success) {
        setFiles(data.files)
      }
    } catch (error) {
      console.error('Failed to load files:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getFileIcon = (file: any) => {
    const ext = file.extension?.toLowerCase() || ''
    const category = file.category?.toLowerCase() || ''

    if (category.includes('image') || ['.jpg', '.png', '.gif'].includes(ext)) {
      return <Image className="h-5 w-5 text-blue-500" />
    }
    if (category.includes('media') || category.includes('video')) {
      return <Film className="h-5 w-5 text-purple-500" />
    }
    if (category.includes('audio') || ['.mp3', '.wav'].includes(ext)) {
      return <Music className="h-5 w-5 text-green-500" />
    }
    if (category.includes('code')) {
      return <Code className="h-5 w-5 text-orange-500" />
    }
    if (category.includes('archive') || ['.zip', '.rar'].includes(ext)) {
      return <Archive className="h-5 w-5 text-gray-500" />
    }
    return <FileText className="h-5 w-5 text-gray-600" />
  }

  const handleOpenFile = async (filePath: string, app?: string) => {
    try {
      await fetch('/api/files/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: filePath, app })
      })
    } catch (error) {
      console.error('Failed to open file:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold italic text-gray-900 dark:text-white mb-2">
              Files
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              BROWSE AND ORGANIZE YOUR LOCAL FILES
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white border border-gray-200'}`}
            >
              <List className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white border border-gray-200'}`}
            >
              <Grid3x3 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search and Sort */}
        <div className="card p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="SEARCH FILES..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-bold"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-bold"
            >
              <option value="name">SORT BY NAME</option>
              <option value="date">SORT BY DATE</option>
              <option value="size">SORT BY SIZE</option>
              <option value="type">SORT BY TYPE</option>
            </select>
          </div>
        </div>

        {/* Files Display */}
        {viewMode === 'list' ? (
          <div className="card p-6">
            <div className="space-y-2">
              {filteredFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all cursor-pointer"
                  onClick={() => setSelectedFile(file)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getFileIcon(file)}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white truncate">
                        {file.name}{file.extension}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {file.category} • {formatFileSize(file.size)} • {new Date(file.modified_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenFile(file.path)
                      }}
                      className="text-primary-600 hover:text-primary-700 p-2"
                      title="Open file"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedFile(file)
                      }}
                      className="text-gray-600 hover:text-gray-700 p-2"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredFiles.length === 0 && (
              <div className="text-center py-12">
                <Folder className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">
                  NO FILES FOUND. RUN THE SCANNER TO INDEX YOUR FILES.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredFiles.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ scale: 1.05 }}
                className="card p-4 cursor-pointer text-center"
                onClick={() => setSelectedFile(file)}
              >
                {getFileIcon(file)}
                <p className="text-xs font-bold text-gray-900 dark:text-white mt-2 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

