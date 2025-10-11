'use client'

import Link from 'next/link'
import { Github, Mail, FileText } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-black font-serif italic">
                Sort System
              </span>
            </div>
            <p className="text-sm text-gray-600">
              COMPREHENSIVE FILE ORGANIZATION PLATFORM FOR PROJECTS, FINANCES, AND TASK MANAGEMENT
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-black mb-4 font-serif italic">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/projects" className="text-gray-600 hover:text-black transition-colors">Projects</Link></li>
              <li><Link href="/calendar" className="text-gray-600 hover:text-black transition-colors">Calendar</Link></li>
              <li><Link href="/todos" className="text-gray-600 hover:text-black transition-colors">Todos</Link></li>
              <li><Link href="/analytics" className="text-gray-600 hover:text-black transition-colors">Analytics</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-bold text-black mb-4 font-serif italic">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/settings" className="text-gray-600 hover:text-black transition-colors">Settings</Link></li>
              <li><Link href="/support" className="text-gray-600 hover:text-black transition-colors">Support</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-black transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-black mb-4 font-serif italic">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-black transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-600 hover:text-black transition-colors">Support Center</Link>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Github className="h-4 w-4" />
                <a href="https://github.com/petersancho/Sort" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-600">
            © {currentYear} SORT SYSTEM. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  )
}

