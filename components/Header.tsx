'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import SortLogo from './SortLogo'
import { 
  Home, 
  Scan, 
  FolderOpen, 
  DollarSign, 
  CheckSquare, 
  BarChart3, 
  Settings,
  Calendar as CalendarIcon,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react'

const navigation = [
  { name: 'HOME', href: '/', icon: Home },
  { name: 'FILES', href: '/files', icon: Scan },
  { name: 'PROJECTS', href: '/projects', icon: FolderOpen },
  { name: 'FINANCE', href: '/finance', icon: DollarSign },
  { name: 'CALENDAR', href: '/calendar', icon: CalendarIcon },
  { name: 'TODOS', href: '/todos', icon: CheckSquare },
  { name: 'ANALYTICS', href: '/analytics', icon: BarChart3 },
  { name: 'SETTINGS', href: '/settings', icon: Settings },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNavDropdown, setShowNavDropdown] = useState(false)

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <SortLogo className="w-10 h-10" />
              <span className="text-2xl font-bold text-black font-serif italic">
                Sort
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Dropdown */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setShowNavDropdown(!showNavDropdown)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors hover:bg-gray-100 border border-gray-200 shadow-sm"
            >
              <span>NAVIGATE</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showNavDropdown ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showNavDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50"
                >
                  <div className="py-2">
                    {navigation.map((item) => {
                      const IconComponent = item.icon
                      const isActive = pathname === item.href
                      
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setShowNavDropdown(false)}
                          className={`flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors ${
                            isActive
                              ? 'bg-gray-100 text-black'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <IconComponent className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="animate-pulse bg-gray-300 h-8 w-8 rounded-full"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold text-black hover:bg-gray-100 border border-gray-200 shadow-sm"
                >
                  <User className="h-5 w-5" />
                  <span>{user.username.toUpperCase()}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-black rounded-lg shadow-lg z-50">
                    <div className="p-3 border-b border-black">
                      <p className="text-sm font-medium text-black">{user.username}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-black hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="btn-primary flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-black hover:text-white hover:bg-black border border-black p-2 rounded"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200"
          >
            <div className="py-2 space-y-1">
              {navigation.map((item) => {
                const IconComponent = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-colors border shadow-sm ${
                      isActive
                        ? 'bg-black text-white border-transparent'
                        : 'text-black hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  )
}
