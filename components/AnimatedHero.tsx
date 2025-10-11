'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function AnimatedHero() {
  const [particles, setParticles] = useState<{ x: number; y: number; delay: number }[]>([])

  useEffect(() => {
    // Generate particle positions
    const newParticles = Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-3xl overflow-hidden shadow-2xl">
      {/* Animated particles/grid */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="grid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.line
            key={`h-${i}`}
            x1="0"
            y1={`${i * 10}%`}
            x2="100%"
            y2={`${i * 10}%`}
            stroke="url(#grid)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 2, delay: i * 0.1, repeat: Infinity, repeatType: 'reverse' }}
          />
        ))}
        
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.line
            key={`v-${i}`}
            x1={`${i * 10}%`}
            y1="0"
            x2={`${i * 10}%`}
            y2="100%"
            stroke="url(#grid)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 2, delay: i * 0.1, repeat: Infinity, repeatType: 'reverse' }}
          />
        ))}

        {/* Floating particles */}
        {particles.map((p, i) => (
          <motion.circle
            key={i}
            cx={`${p.x}%`}
            cy={`${p.y}%`}
            r="2"
            fill="white"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.5, 0.5],
              y: [0, -20, 0]
            }}
            transition={{ 
              duration: 3, 
              delay: p.delay, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </svg>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white"
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-4 font-serif italic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Sort
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl font-bold tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif" }}
          >
            ORGANIZE EVERYTHING. CONTROL YOUR LIFE.
          </motion.p>
        </motion.div>
      </div>

      {/* Animated waves */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/20 to-transparent"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}

