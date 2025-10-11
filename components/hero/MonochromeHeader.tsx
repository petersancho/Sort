'use client'

import { useMemo } from 'react'

export default function MonochromeHeader() {
  const lines = useMemo(() => {
    const arr = []
    for (let i = 0; i < 8; i++) {
      arr.push({
        y: 12 + i * 10,
        speed: 8 + i * 1.2,
        offset: i * 60,
        opacity: 0.25 + i * 0.06,
      })
    }
    return arr
  }, [])

  return (
    <header className="header-hero hero-anim">
      <div className="shell">
        <h1 style={{ margin: '0 0 8px 0', letterSpacing: '-0.02em', fontFamily: "'Times New Roman', Times, serif", fontStyle: 'italic', fontWeight: 700, fontSize: '3rem' }}>
          SORT
        </h1>
        <p style={{ color: 'var(--muted)', margin: 0, textTransform: 'uppercase', fontWeight: 700 }}>
          ORGANIZE EVERYTHING. CONTROL YOUR LIFE.
        </p>
      </div>
      <div className="hero-lines" aria-hidden="true">
        <svg viewBox="0 0 1200 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="bwStroke" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0.14)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.65)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.14)" />
            </linearGradient>
          </defs>
          {lines.map((ln, idx) => (
            <path
              key={idx}
              d={`M0,${ln.y} C 200,${ln.y + 10} 400,${ln.y - 8} 600,${ln.y + 12} 800,${ln.y - 6} 1000,${ln.y + 10} 1200,${ln.y}`}
              fill="none"
              stroke="url(#bwStroke)"
              strokeWidth={1.2}
              style={{
                opacity: ln.opacity,
                filter: 'drop-shadow(0 0 1px rgba(255,255,255,0.2))',
              }}
            >
              <animate
                attributeName="stroke-dashoffset"
                from={0}
                to={ln.offset + 200}
                dur={`${ln.speed}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-dasharray"
                values="8 180; 14 160; 10 180"
                dur={`${ln.speed * 1.5}s`}
                repeatCount="indefinite"
              />
            </path>
          ))}
        </svg>
      </div>
    </header>
  )
}

