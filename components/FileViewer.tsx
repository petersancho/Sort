'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Download, 
  ExternalLink, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive,
  Code,
  File,
  Eye,
  EyeOff
} from 'lucide-react'

interface FileViewerProps {
  file: {
    id: number
    name: string
    path: string
    extension: string
    category?: string
    size: number
  }
  isOpen: boolean
  onClose: () => void
}

export default function FileViewer({ file, isOpen, onClose }: FileViewerProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const getFileIcon = (extension: string, category?: string) => {
    const ext = extension.toLowerCase()
    
    // Images
    if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.tiff'].includes(ext)) {
      return <Image className="h-8 w-8 text-blue-500" />
    }
    
    // Videos
    if (['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'].includes(ext)) {
      return <Video className="h-8 w-8 text-purple-500" />
    }
    
    // Audio
    if (['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'].includes(ext)) {
      return <Music className="h-8 w-8 text-green-500" />
    }
    
    // Archives
    if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(ext)) {
      return <Archive className="h-8 w-8 text-orange-500" />
    }
    
    // Code files
    if (['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.php', '.rb', '.go', '.rs'].includes(ext)) {
      return <Code className="h-8 w-8 text-yellow-500" />
    }
    
    // Documents
    if (['.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt'].includes(ext)) {
      return <FileText className="h-8 w-8 text-red-500" />
    }
    
    return <File className="h-8 w-8 text-gray-500" />
  }

  const canPreview = () => {
    const ext = file.extension.toLowerCase()
    return [
      '.txt', '.md', '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.php', '.rb', '.go', '.rs',
      '.json', '.xml', '.html', '.css', '.scss', '.yaml', '.yml', '.toml', '.ini', '.conf',
      '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.tiff'
    ].includes(ext)
  }

  const openFileInSystem = async () => {
    try {
      const response = await fetch('/api/files/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: file.path })
      })
      
      if (!response.ok) {
        // Fallback: try to open in browser for web-safe files
        if (file.extension.toLowerCase() === '.pdf' || 
            ['.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(file.extension.toLowerCase())) {
          window.open(`file://${file.path}`, '_blank')
        }
      }
    } catch (error) {
      console.error('Failed to open file:', error)
      // Show error message to user
    }
  }

  const downloadFile = async () => {
    try {
      const response = await fetch('/api/files/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: file.path, name: file.name })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Failed to download file:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-black"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b-2 border-black">
              <div className="flex items-center space-x-4">
                {getFileIcon(file.extension, file.category)}
                <div>
                  <h2 className="text-xl font-bold text-black">
                    {file.name}
                  </h2>
                  <p className="text-sm text-black">
                    {formatFileSize(file.size)} • {file.category || 'File'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {canPreview() && (
                  <button
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    title={isPreviewMode ? 'Hide Preview' : 'Show Preview'}
                  >
                    {isPreviewMode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                )}
                
                <button
                  onClick={downloadFile}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  title="Download"
                >
                  <Download className="h-5 w-5" />
                </button>
                
                <button
                  onClick={openFileInSystem}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  title="Open in System"
                >
                  <ExternalLink className="h-5 w-5" />
                </button>
                
                <button
                  onClick={onClose}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* File Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    File Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Name:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{file.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Path:</span>
                      <span className="text-gray-900 dark:text-white font-mono text-sm">{file.path}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Size:</span>
                      <span className="text-gray-900 dark:text-white">{formatFileSize(file.size)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Category:</span>
                      <span className="text-gray-900 dark:text-white">{file.category || 'Unknown'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={openFileInSystem}
                      className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open in Default App
                    </button>
                    
                    <button
                      onClick={downloadFile}
                      className="w-full btn-secondary flex items-center justify-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download File
                    </button>
                    
                    <button
                      onClick={() => navigator.clipboard.writeText(file.path)}
                      className="w-full btn-secondary flex items-center justify-center gap-2"
                    >
                      <File className="h-4 w-4" />
                      Copy Path
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview */}
              {isPreviewMode && canPreview() && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Preview
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-auto">
                    {file.extension.toLowerCase() === '.txt' || 
                     ['.md', '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.php', '.rb', '.go', '.rs', '.json', '.xml', '.html', '.css', '.scss', '.yaml', '.yml'].includes(file.extension.toLowerCase()) ? (
                      <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                        {/* In a real implementation, this would fetch and display file content */}
                        Preview not available in development mode.
                        Click "Open in Default App" to view the file content.
                      </pre>
                    ) : file.extension.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|svg|webp|tiff)$/) ? (
                      <div className="text-center text-gray-600 dark:text-gray-300">
                        <Image className="h-16 w-16 mx-auto mb-2 text-gray-400" />
                        <p>Image preview not available in development mode.</p>
                        <p>Click "Open in Default App" to view the image.</p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-600 dark:text-gray-300">
                        <File className="h-16 w-16 mx-auto mb-2 text-gray-400" />
                        <p>Preview not available for this file type.</p>
                        <p>Click "Open in Default App" to view the file.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
