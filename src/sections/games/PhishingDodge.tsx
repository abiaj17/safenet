import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Heart, ArrowLeft, ArrowRight } from 'lucide-react'
import type { GameProps } from '../Game'

interface Item { id: number; x: number; y: number; type: 'shield' | 'threat'; speed: number }
interface GS { player: number; items: Item[]; score: number; lives: number; running: boolean }

const GAME_TIME = 30

// Inline SVG ship — top-down view pointing up
function Ship() {
  return (
    <svg viewBox="0 0 36 40" width="36" height="40" style={{ overflow: 'visible' }}>
      {/* Engine flame */}
      <ellipse cx="18" cy="38" rx="4" ry="5" fill="#60a5fa" opacity="0.5"
        style={{ animation: 'engineFlame 0.18s ease-in-out infinite' }} />
      <ellipse cx="18" cy="36" rx="2.5" ry="3" fill="#bfdbfe" opacity="0.7"
        style={{ animation: 'engineFlame 0.18s ease-in-out infinite 0.06s' }} />
      {/* Wing left */}
      <polygon points="10,24 2,32 8,26" fill="#2563eb" />
      {/* Wing right */}
      <polygon points="26,24 34,32 28,26" fill="#2563eb" />
      {/* Body */}
      <polygon points="18,2 26,26 18,20 10,26" fill="#3b82f6" />
      {/* Cockpit */}
      <ellipse cx="18" cy="12" rx="3.5" ry="5.5" fill="#93c5fd" opacity="0.75" />
      {/* Nose highlight */}
      <ellipse cx="17" cy="9" rx="1.2" ry="2" fill="#e0f2fe" opacity="0.6" />
    </svg>
  )
}

// Glowing orb for shields
function ShieldOrb() {
  return (
    <svg viewBox="0 0 26 26" width="26" height="26" style={{ overflow: 'visible' }}>
      <circle cx="13" cy="13" r="11" fill="none" stroke="#4ade80" strokeWidth="1.2" opacity="0.6" />
      <circle cx="13" cy="13" r="8" fill="none" stroke="#4ade80" strokeWidth="0.7" opacity="0.4" />
      <circle cx="13" cy="13" r="5" fill="#4ade80" opacity="0.25" />
      <circle cx="13" cy="13" r="3" fill="#4ade80" opacity="0.7" />
      <circle cx="11" cy="11" r="1.2" fill="#bbf7d0" opacity="0.9" />
    </svg>
  )
}

// Spiky virus for threats
function ThreatVirus() {
  return (
    <svg viewBox="0 0 28 28" width="24" height="24" style={{ overflow: 'visible' }}>
      <polygon
        points="14,1 17,8 22,4 21,11 28,11 23,15 26,21 20,19 19,26 14,22 9,26 8,19 2,21 5,15 0,11 7,11 6,4 11,8"
        fill="#f87171" opacity="0.9"
      />
      <circle cx="14" cy="14" r="5" fill="#fca5a5" />
      <circle cx="14" cy="14" r="2.5" fill="#fef2f2" opacity="0.6" />
    </svg>
  )
}

// Scrolling star field — generated once, animated via CSS
const STARS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  size: 0.8 + Math.random() * 1.4,
  opacity: 0.12 + Math.random() * 0.3,
  duration: 4 + Math.random() * 6,
  delay: -(Math.random() * 10),
}))

export function PhishingDodge({ onBack, onComplete, onRestart }: GameProps) {
  const [gs, setGs] = useState<GS>({ player: 50, items: [], score: 0, lives: 3, running: false })
  const [timeLeft, setTimeLeft] = useState(GAME_TIME)
  const [done, setDone] = useState(false)
  const [flashKey, setFlashKey] = useState(0)
  const keysRef = useRef<Set<string>>(new Set())
  const mobileLeft = useRef(false)
  const mobileRight = useRef(false)
  const startRef = useRef<number | null>(null)
  const idRef = useRef(0)
  const prevLivesRef = useRef(3)
  const arenaControls = useAnimation()

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.type === 'keydown') keysRef.current.add(e.key)
    else keysRef.current.delete(e.key)
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    window.addEventListener('keyup', handleKey)
    return () => { window.removeEventListener('keydown', handleKey); window.removeEventListener('keyup', handleKey) }
  }, [handleKey])

  useEffect(() => {
    if (!gs.running || done) return
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { setDone(true); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [gs.running, done])

  // Life lost → flash + arena shake
  useEffect(() => {
    if (gs.lives < prevLivesRef.current && gs.running) {
      setFlashKey(k => k + 1)
      arenaControls.start({
        x: [0, -10, 10, -7, 7, -3, 3, 0],
        transition: { duration: 0.38, ease: 'easeOut' },
      })
    }
    prevLivesRef.current = gs.lives
  }, [gs.lives, gs.running, arenaControls])

  useEffect(() => {
    if (!gs.running || done) return
    const loop = setInterval(() => {
      setGs(prev => {
        if (!prev.running) return prev

        let player = prev.player
        if (keysRef.current.has('ArrowLeft') || keysRef.current.has('a') || mobileLeft.current)
          player = Math.max(3, player - 3)
        if (keysRef.current.has('ArrowRight') || keysRef.current.has('d') || mobileRight.current)
          player = Math.min(97, player + 3)

        const elapsed = startRef.current ? (Date.now() - startRef.current) / 1000 : 0
        const spawnRate = Math.min(0.17, 0.05 + elapsed * 0.003)
        const baseSpeed = 1.0 + elapsed * 0.05

        let items = prev.items.map(i => ({ ...i, y: i.y + i.speed }))
        if (Math.random() < spawnRate) {
          items.push({
            id: idRef.current++,
            x: 5 + Math.random() * 90,
            y: -6,
            type: Math.random() < 0.4 ? 'shield' : 'threat',
            speed: baseSpeed + Math.random() * 1.5,
          })
        }

        let score = prev.score
        let lives = prev.lives
        items = items.filter(item => {
          if (item.y > 105) return false
          if (item.y > 78 && item.y < 95 && Math.abs(item.x - player) < 10) {
            if (item.type === 'shield') score += 5
            else lives = Math.max(0, lives - 1)
            return false
          }
          return true
        })

        if (lives === 0) { setDone(true); return { ...prev, lives: 0, items: [], running: false } }
        return { ...prev, player, items, score, lives }
      })
    }, 50)
    return () => clearInterval(loop)
  }, [gs.running, done])

  const start = () => {
    startRef.current = Date.now()
    setGs(p => ({ ...p, running: true }))
  }

  const timerPct = (timeLeft / GAME_TIME) * 100
  const timerColor = timeLeft <= 5 ? '#f87171' : timeLeft <= 10 ? '#fbbf24' : '#4ade80'

  if (done) return (
    <div className="game-screen max-w-xl mx-auto">
      <button onClick={onBack} className="game-back-btn mb-8">← Back to Hub</button>
      <p className="game-label mb-4">Phishing Dodge — Results</p>
      <div className="flex items-baseline gap-3 mb-2">
        <span className="game-score-final">{gs.score}</span>
        <span className="game-score-denom">pts</span>
      </div>
      <p className="game-flavor-text mb-8">
        {gs.score >= 100 ? 'Untouchable. Threats had no chance.' : gs.score >= 50 ? 'Nice reflexes. A few slipped through.' : 'Every dodge counts. Try again!'}
      </p>
      <div className="flex flex-col gap-3">
        <button onClick={() => onComplete(Math.min(gs.score, 150))} className="game-claim-btn">
          Claim {Math.min(gs.score, 150)} pts →
        </button>
        {onRestart && (
          <button onClick={onRestart} className="game-back-btn text-center mt-1">↺ Play Again</button>
        )}
      </div>
    </div>
  )

  return (
    <div className="game-screen max-w-xl mx-auto">
      {/* HUD */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onBack} className="game-back-btn">← Hub</button>
        <div className="flex items-center gap-5">
          {/* Score with glow */}
          <span className="font-black text-[16px] tabular-nums" style={{
            color: '#F87171',
            textShadow: '0 0 16px #f8717188',
          }}>
            {gs.score} <span className="text-[11px] font-bold opacity-60">PTS</span>
          </span>
          {/* Lives */}
          <div className="flex gap-1.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                animate={i < gs.lives ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  size={16}
                  strokeWidth={2}
                  fill={i < gs.lives ? '#f87171' : 'transparent'}
                  style={{
                    color: i < gs.lives ? '#f87171' : '#2a2f4a',
                    filter: i < gs.lives ? 'drop-shadow(0 0 6px #f87171)' : 'none',
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-1.5 rounded-full overflow-hidden mb-1" style={{ background: '#111827' }}>
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${timerPct}%` }}
          transition={{ duration: 0.95, ease: 'linear' }}
          style={{ background: timerColor, boxShadow: `0 0 10px ${timerColor}` }}
        />
      </div>
      <div className="flex justify-between mb-3">
        <span className="text-[10px] tracking-widest uppercase" style={{ color: '#2a3050' }}>Collect orbs · dodge viruses</span>
        <span className="font-black tabular-nums text-[14px]" style={{ color: timerColor, textShadow: `0 0 10px ${timerColor}88` }}>
          {String(timeLeft).padStart(2, '0')}s
        </span>
      </div>

      {/* Arena */}
      <motion.div
        animate={arenaControls}
        className="relative w-full rounded-2xl overflow-hidden mb-4"
        style={{
          height: 300,
          background: '#03040e',
          border: `1.5px solid ${gs.running ? '#1a2040' : '#2a3050'}`,
          boxShadow: gs.running ? `0 0 30px rgba(96,165,250,0.06), inset 0 0 60px rgba(0,0,20,0.8)` : 'none',
        }}
      >
        {/* Star field */}
        {STARS.map(s => (
          <div
            key={s.id}
            className="absolute pointer-events-none rounded-full"
            style={{
              left: `${s.x}%`,
              width: s.size,
              height: s.size,
              background: '#fff',
              opacity: s.opacity,
              animation: `starFall ${s.duration}s ${s.delay}s linear infinite`,
            }}
          />
        ))}

        {/* Horizontal speed lines (subtle) */}
        {gs.running && Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="absolute pointer-events-none" style={{
            top: `${20 + i * 18}%`,
            left: 0,
            right: 0,
            height: 1,
            background: `linear-gradient(90deg, transparent, rgba(96,165,250,0.04), transparent)`,
          }} />
        ))}

        {/* Scanline overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.09) 0px, rgba(0,0,0,0.09) 1px, transparent 1px, transparent 3px)',
          zIndex: 2,
        }} />

        {/* Hit flash */}
        <AnimatePresence>
          {flashKey > 0 && (
            <motion.div
              key={flashKey}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{ background: 'radial-gradient(ellipse at center, #f87171 0%, #ef4444 100%)', zIndex: 16 }}
            />
          )}
        </AnimatePresence>

        {/* Start screen */}
        {!gs.running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-5"
            style={{ background: 'rgba(3,4,14,0.92)', backdropFilter: 'blur(6px)' }}>
            <div style={{ filter: 'drop-shadow(0 0 24px #4ade8077)' }}>
              <Ship />
            </div>
            <div className="text-center">
              <p className="font-black text-[18px] mb-1" style={{ color: '#E8E6D4', letterSpacing: '-0.01em' }}>
                Phishing Dodge
              </p>
              <p className="text-[12px]" style={{ color: '#4a5578' }}>Arrow keys or hold buttons below</p>
            </div>
            <button onClick={start} className="game-claim-btn" style={{ background: '#4ade80', color: '#0a0b14', fontWeight: 900 }}>
              Launch →
            </button>
          </div>
        )}

        {/* Items */}
        {gs.items.map(item => (
          <div
            key={item.id}
            className="absolute pointer-events-none"
            style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -50%)', zIndex: 4 }}
          >
            {item.type === 'shield'
              ? (
                <div style={{ filter: 'drop-shadow(0 0 10px #4ade8099) drop-shadow(0 0 20px #4ade8044)' }}>
                  <ShieldOrb />
                </div>
              )
              : (
                <div style={{ filter: 'drop-shadow(0 0 8px #f8717199) drop-shadow(0 0 16px #f8717155)' }}>
                  <ThreatVirus />
                </div>
              )
            }
          </div>
        ))}

        {/* Player ship */}
        {gs.running && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${gs.player}%`,
              top: '82%',
              transform: 'translate(-50%, -50%)',
              transition: 'left 0.05s linear',
              zIndex: 5,
              filter: 'drop-shadow(0 0 16px #60a5fa88) drop-shadow(0 0 30px #3b82f644)',
            }}
          >
            <Ship />
          </div>
        )}

        {/* Player thrust trail */}
        {gs.running && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${gs.player}%`,
              top: '88%',
              transform: 'translateX(-50%)',
              zIndex: 4,
              width: 8,
              height: 22,
              background: 'linear-gradient(to bottom, #93c5fd88, transparent)',
              filter: 'blur(3px)',
              borderRadius: 4,
              animation: 'engineFlame 0.18s ease-in-out infinite',
              transition: 'left 0.05s linear',
            }}
          />
        )}
      </motion.div>

      {/* Controls — hold for continuous movement */}
      <div className="flex gap-3">
        <button
          onPointerDown={() => { mobileLeft.current = true }}
          onPointerUp={() => { mobileLeft.current = false }}
          onPointerLeave={() => { mobileLeft.current = false }}
          className="flex-1 py-5 rounded-2xl flex items-center justify-center transition-all active:scale-95 select-none"
          style={{
            background: '#080d1a',
            border: '1.5px solid #1e2a40',
            color: '#60a5fa',
            boxShadow: 'inset 0 1px 0 rgba(96,165,250,0.05)',
          }}
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <button
          onPointerDown={() => { mobileRight.current = true }}
          onPointerUp={() => { mobileRight.current = false }}
          onPointerLeave={() => { mobileRight.current = false }}
          className="flex-1 py-5 rounded-2xl flex items-center justify-center transition-all active:scale-95 select-none"
          style={{
            background: '#080d1a',
            border: '1.5px solid #1e2a40',
            color: '#60a5fa',
            boxShadow: 'inset 0 1px 0 rgba(96,165,250,0.05)',
          }}
        >
          <ArrowRight size={22} strokeWidth={2} />
        </button>
      </div>

      {/* Control hint */}
      <p className="text-center text-[10px] mt-2 tracking-widest uppercase" style={{ color: '#1e2540' }}>
        Hold to steer continuously
      </p>
    </div>
  )
}
