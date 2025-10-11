'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { motion } from 'framer-motion'
import { Mail, MessageSquare, HelpCircle } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold italic text-black mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600">
            GET IN TOUCH WITH THE SORT SYSTEM TEAM
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold italic text-black">EMAIL SUPPORT</h3>
                <p className="text-sm text-gray-600">WE'LL GET BACK TO YOU WITHIN 24 HOURS</p>
              </div>
            </div>
            <a 
              href="mailto:support@sort-system.app" 
              className="text-black hover:underline font-medium"
            >
              support@sort-system.app
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold italic text-black">GENERAL INQUIRIES</h3>
                <p className="text-sm text-gray-600">QUESTIONS, FEEDBACK, OR PARTNERSHIPS</p>
              </div>
            </div>
            <a 
              href="mailto:hello@sort-system.app" 
              className="text-black hover:underline font-medium"
            >
              hello@sort-system.app
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-8 mt-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold italic text-black">SUPPORT CENTER</h3>
              <p className="text-sm text-gray-600">FIND ANSWERS TO COMMON QUESTIONS</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-black mb-2">HOW DO I ORGANIZE MY FILES?</h4>
              <p className="text-sm text-gray-600">
                USE THE FILE SCANNER TO INDEX YOUR LOCAL FILES, THEN ORGANIZE THEM THROUGH THE FILES PAGE WITH OUR CUSTOM UI.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-black mb-2">CAN I SYNC ACROSS DEVICES?</h4>
              <p className="text-sm text-gray-600">
                YOUR ACCOUNT DATA (TODOS, CALENDAR, PROJECTS, FINANCE) SYNCS AUTOMATICALLY. FILE ORGANIZATION WORKS PER-DEVICE.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-black mb-2">IS MY DATA SECURE?</h4>
              <p className="text-sm text-gray-600">
                ALL DATA IS STORED LOCALLY OR ON SECURE SERVERS. WE NEVER ACCESS YOUR FILES WITHOUT PERMISSION.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

