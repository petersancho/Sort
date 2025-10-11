'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Save, 
  RotateCcw,
  Download,
  Upload,
  Trash2,
  Shield,
  Bell,
  Palette,
  Folder,
  Database,
  Globe
} from 'lucide-react'

interface SystemSettings {
  autoScan: boolean
  scanInterval: string
  notifications: boolean
  theme: 'light' | 'dark' | 'system'
  language: string
  defaultProjectPath: string
  backupEnabled: boolean
  backupInterval: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    autoScan: true,
    scanInterval: 'daily',
    notifications: true,
    theme: 'system',
    language: 'en',
    defaultProjectPath: '~/Projects',
    backupEnabled: false,
    backupInterval: 'weekly'
  })

  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    // In a real app, this would load from localStorage or API
    // For now, we'll use the default settings
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false)
      setHasChanges(false)
      // Show success message
    }, 1000)
  }

  const handleReset = () => {
    setSettings({
      autoScan: true,
      scanInterval: 'daily',
      notifications: true,
      theme: 'system',
      language: 'en',
      defaultProjectPath: '~/Projects',
      backupEnabled: false,
      backupInterval: 'weekly'
    })
    setHasChanges(true)
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = 'sort-system-settings.json'
    link.click()
    
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string)
          setSettings(importedSettings)
          setHasChanges(true)
        } catch (error) {
          console.error('Failed to import settings:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  const updateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Customize your Sort System experience
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="btn-secondary flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* File Scanner Settings */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Folder className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                File Scanner
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Auto Scan</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Automatically scan for new files
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoScan}
                    onChange={(e) => updateSetting('autoScan', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Scan Interval
                </label>
                <select
                  value={settings.scanInterval}
                  onChange={(e) => updateSetting('scanInterval', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="manual">Manual Only</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Project Path
                </label>
                <input
                  type="text"
                  value={settings.defaultProjectPath}
                  onChange={(e) => updateSetting('defaultProjectPath', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="~/Projects"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Notifications
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Enable Notifications</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Receive notifications for system events
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => updateSetting('notifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="h-6 w-6 text-purple-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Appearance
              </h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => updateSetting('theme', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => updateSetting('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </div>

          {/* Backup & Data */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Database className="h-6 w-6 text-green-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Backup & Data
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Auto Backup</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Automatically backup your data
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.backupEnabled}
                    onChange={(e) => updateSetting('backupEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Backup Interval
                </label>
                <select
                  value={settings.backupInterval}
                  onChange={(e) => updateSetting('backupInterval', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleExport}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export Settings
                </button>
                
                <label className="btn-secondary flex items-center gap-2 cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Import Settings
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* System Actions */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-red-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                System Actions
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Clear Cache</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Clear temporary files and cached data
                  </p>
                </div>
                <button className="btn-secondary">
                  Clear
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
                <div>
                  <h3 className="font-medium text-red-900 dark:text-red-100">Reset All Data</h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    This will permanently delete all your data
                  </p>
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Indicator */}
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 bg-primary-600 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            You have unsaved changes
          </motion.div>
        )}
      </div>
    </div>
  )
}
