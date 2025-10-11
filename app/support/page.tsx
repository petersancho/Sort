'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { motion } from 'framer-motion'
import Link from 'next/link'
import { HelpCircle, Book, MessageCircle, Shield } from 'lucide-react'

export default function SupportPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold italic text-black mb-4">
            Support Center
          </h1>
          <p className="text-lg text-gray-600">
            GET HELP WITH YOUR SORT SYSTEM
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-8"
          >
            <Book className="h-12 w-12 text-black mb-4" />
            <h3 className="text-xl font-bold italic text-black mb-4">DOCUMENTATION</h3>
            <p className="text-sm text-gray-600 mb-4">
              LEARN HOW TO USE ALL FEATURES OF SORT SYSTEM
            </p>
            <Link href="/settings" className="btn-primary inline-block">
              VIEW DOCS
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-8"
          >
            <MessageCircle className="h-12 w-12 text-black mb-4" />
            <h3 className="text-xl font-bold italic text-black mb-4">CONTACT US</h3>
            <p className="text-sm text-gray-600 mb-4">
              REACH OUT TO OUR SUPPORT TEAM
            </p>
            <Link href="/contact" className="btn-primary inline-block">
              GET IN TOUCH
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-8"
        >
          <h2 className="text-2xl font-bold italic text-black mb-6">FREQUENTLY ASKED QUESTIONS</h2>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-black mb-2">HOW DO I GET STARTED?</h4>
              <p className="text-sm text-gray-600">
                CREATE AN ACCOUNT, THEN USE THE FILE SCANNER TO INDEX YOUR LOCAL FILES. FROM THERE, YOU CAN ORGANIZE THEM USING PROJECTS, TRACK FINANCES, AND MANAGE TODOS.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-black mb-2">CAN I USE SORT ON MULTIPLE COMPUTERS?</h4>
              <p className="text-sm text-gray-600">
                YES! YOUR TODOS, CALENDAR, PROJECTS, AND FINANCE DATA SYNC ACROSS ALL DEVICES WHEN YOU'RE LOGGED IN. FILE ORGANIZATION IS PER-DEVICE.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-black mb-2">IS THERE A MOBILE APP?</h4>
              <p className="text-sm text-gray-600">
                CURRENTLY SORT IS WEB-BASED AND WORKS ON ANY DEVICE WITH A BROWSER. A DEDICATED MOBILE APP IS IN DEVELOPMENT.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-black mb-2">HOW DO I DELETE MY ACCOUNT?</h4>
              <p className="text-sm text-gray-600">
                EMAIL US AT SUPPORT@SORT-SYSTEM.APP AND WE'LL REMOVE ALL YOUR DATA WITHIN 24 HOURS.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-8 mt-8 text-center"
        >
          <Shield className="h-16 w-16 text-black mx-auto mb-4" />
          <h3 className="text-xl font-bold italic text-black mb-2">NEED MORE HELP?</h3>
          <p className="text-gray-600 mb-6">
            CONTACT OUR SUPPORT TEAM DIRECTLY
          </p>
          <a href="mailto:support@sort-system.app" className="btn-primary inline-block">
            EMAIL SUPPORT
          </a>
        </motion.div>
      </div>
    </div>
  )
}

