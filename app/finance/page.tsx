'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  Receipt, 
  FileText, 
  TrendingUp,
  Calendar,
  Plus,
  Search,
  Filter,
  Download,
  PieChart,
  FolderPlus,
  FolderOpen,
  ExternalLink,
  Eye,
  Edit,
  Trash2,
  X
} from 'lucide-react'
import FileViewer from '@/components/FileViewer'

interface FinanceDocument {
  id: number
  name: string
  type: 'receipt' | 'invoice' | 'statement' | 'contract' | 'tax' | 'budget' | 'other'
  amount?: number
  currency: string
  date?: string
  category: string
  file_path?: string
  project_id?: number
  created_at: string
  metadata?: any
}

interface FinanceProject {
  id: number
  name: string
  description: string
  budget?: number
  currency: string
  start_date?: string
  end_date?: string
  status: 'active' | 'completed' | 'archived'
  created_at: string
  updated_at: string
  metadata?: any
}

interface FinancialSummary {
  totalDocuments: number
  totalAmount: number
  byType: { [key: string]: { count: number; amount: number } }
  byCategory: { [key: string]: { count: number; amount: number } }
  monthlySpending: { month: string; amount: number }[]
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

export default function FinancePage() {
  const [documents, setDocuments] = useState<FinanceDocument[]>([])
  const [projects, setProjects] = useState<FinanceProject[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingDocument, setEditingDocument] = useState<FinanceDocument | null>(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showFileModal, setShowFileModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isFileViewerOpen, setIsFileViewerOpen] = useState(false)
  
  const [newDocument, setNewDocument] = useState({
    name: '',
    type: 'receipt' as const,
    amount: '',
    currency: 'USD',
    date: new Date().toISOString().split('T')[0],
    category: '',
    file_path: ''
  })

  useEffect(() => {
    loadDocuments()
    loadSummary()
  }, [])

  const loadDocuments = async () => {
    try {
      const params = new URLSearchParams()
      if (filterType) params.append('type', filterType)
      
      const response = await fetch(`/api/finance/documents?${params}`)
      const data = await response.json()
      if (data.success) {
        setDocuments(data.documents)
      }
    } catch (error) {
      console.error('Failed to load documents:', error)
    }
  }

  const loadSummary = async () => {
    try {
      const response = await fetch('/api/finance/summary')
      const data = await response.json()
      if (data.success) {
        setSummary(data.summary)
      }
    } catch (error) {
      console.error('Failed to load summary:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/finance/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDocument,
          amount: newDocument.amount ? parseFloat(newDocument.amount) : undefined
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setDocuments([data.document, ...documents])
        setShowAddModal(false)
        setNewDocument({
          name: '',
          type: 'receipt',
          amount: '',
          currency: 'USD',
          date: new Date().toISOString().split('T')[0],
          category: '',
          file_path: ''
        })
        loadSummary() // Refresh summary
      }
    } catch (error) {
      console.error('Failed to add document:', error)
    }
  }

  const handleDeleteDocument = async (id: number) => {
    if (!confirm('Delete this document?')) return
    try {
      const response = await fetch(`/api/finance/documents/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setDocuments(documents.filter(d => d.id !== id))
        loadSummary()
      }
    } catch (error) {
      console.error('Failed to delete document:', error)
    }
  }

  const openEditModal = (doc: FinanceDocument) => {
    setEditingDocument(doc)
    setShowEditModal(true)
  }

  const submitEditDocument = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDocument) return
    try {
      const response = await fetch(`/api/finance/documents/${editingDocument.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingDocument)
      })
      if (response.ok) {
        setDocuments(documents.map(d => d.id === editingDocument.id ? editingDocument : d))
        setShowEditModal(false)
        setEditingDocument(null)
        loadSummary()
      }
    } catch (error) {
      console.error('Failed to update document:', error)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'receipt': return <Receipt className="h-4 w-4 text-green-500" />
      case 'invoice': return <FileText className="h-4 w-4 text-blue-500" />
      case 'statement': return <TrendingUp className="h-4 w-4 text-purple-500" />
      case 'tax': return <DollarSign className="h-4 w-4 text-red-500" />
      default: return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'receipt': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'invoice': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'statement': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'tax': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Finance Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your financial documents and track expenses
            </p>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Document
          </button>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Documents</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{summary.totalDocuments}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Amount</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${summary.totalAmount.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {Object.keys(summary.byCategory).length}
                  </p>
                </div>
                <PieChart className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${summary.monthlySpending[0]?.amount.toLocaleString() || '0'}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Types</option>
                <option value="receipt">Receipts</option>
                <option value="invoice">Invoices</option>
                <option value="statement">Statements</option>
                <option value="tax">Tax Documents</option>
                <option value="budget">Budget</option>
                <option value="other">Other</option>
              </select>
              
              <button
                onClick={loadDocuments}
                className="btn-secondary flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Financial Documents
          </h2>
          
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="h-24 w-24 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No documents found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Add your first financial document to start tracking
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary"
              >
                Add Document
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocuments.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getTypeIcon(doc.type)}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {doc.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {doc.category} • {new Date(doc.date || doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(doc.type)}`}>
                      {doc.type}
                    </span>
                    {doc.amount && (
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${doc.amount.toLocaleString()} {doc.currency}
                      </span>
                    )}
                    <button
                      onClick={() => openEditModal(doc)}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Add Document Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-8 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Add Financial Document
                </h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleAddDocument} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Document Name
                  </label>
                  <input
                    type="text"
                    value={newDocument.name}
                    onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Receipt from Store X"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type
                    </label>
                    <select
                      value={newDocument.type}
                      onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="receipt">Receipt</option>
                      <option value="invoice">Invoice</option>
                      <option value="statement">Statement</option>
                      <option value="tax">Tax Document</option>
                      <option value="budget">Budget</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newDocument.amount}
                      onChange={(e) => setNewDocument({ ...newDocument, amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency
                    </label>
                    <select
                      value={newDocument.currency}
                      onChange={(e) => setNewDocument({ ...newDocument, currency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CAD">CAD</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newDocument.date}
                      onChange={(e) => setNewDocument({ ...newDocument, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newDocument.category}
                    onChange={(e) => setNewDocument({ ...newDocument, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Food, Travel, Office, etc."
                    required
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Add Document
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Document Modal */}
        {showEditModal && editingDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-8 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit Financial Document
                </h2>
                <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={submitEditDocument} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Document Name
                  </label>
                  <input
                    type="text"
                    value={editingDocument.name}
                    onChange={(e) => setEditingDocument({ ...editingDocument, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingDocument.amount || ''}
                      onChange={(e) => setEditingDocument({ ...editingDocument, amount: parseFloat(e.target.value) || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={editingDocument.category}
                      onChange={(e) => setEditingDocument({ ...editingDocument, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Save Changes
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
