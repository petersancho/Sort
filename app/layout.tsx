import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: 'Sort System - File Organization Platform',
  description: 'Comprehensive file organization system for projects, finances, and task management',
}

// Force dynamic rendering to avoid static generation issues on some Node versions
export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-serif antialiased">
        <AuthProvider>
          <div className="min-h-screen bg-white">
            <Header />
            <main>
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
