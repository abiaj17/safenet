import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Shield, Key, Bug, Laptop, Globe, Wifi, Eye } from 'lucide-react'
import type { GameProps } from '../Game'
import type { LucideIcon } from 'lucide-react'

const SYMBOLS: { Icon: LucideIcon; color: string; label: string; glow: string }[] = [
  { Icon: Lock,   color: '#60a5fa', label: 'Lock',   glow: '#3b82f6' },
  { Icon: Shield, color: '#4ade80', label: 'Shield', glow: '#16a34a' },
  { Icon: Key,    color: '#fbbf24', label: 'Key',    glow: '#d97706' },
  { Icon: Bug,    color: '#f87171', label: 'Bug',    glow: '#dc2626' },
  { Icon: Laptop, color: '#a78bfa', label: 'Device', glow: '#7c3aed' },
  { Icon: Globe,  color: '#34d399', label: 'Web',    glow: '#059669' },
  { Icon: Wifi,   color: '#fb923c', label: 'Wifi',   glow: '#ea580c' },
  { Icon: Eye,    color: '#e879f9', label: 'Eye',    glow: '#a21caf' },
]

const PAIRS = [...SYMBOLS, ...SYMBOLS]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Unique card back pattern per index
function CardBack({ idx }: { idx: number }) {
  const angle = (idx * 37) % 180
  const col1 = `hsl(${220 + (idx * 11) % 40}, 30%, 14%)`
  const col2 = `hsl(${220 + (idx * 19) % 40}, 25%, 10%)`
  return (
    <div className="w-full h-full relative overflow-hidden rounded-xl flex items-center justify-center">
      {/* Diagonal stripe pattern */}
      <div className="absolute inset-0" style={{
        backgroundImage: `repeating-linear-gradient(${angle}deg, ${col1} 0px, ${col1} 2px, ${col2} 2px, ${col2} 10px)`,
      }} />
      {/* Center emblem */}
      <div className="relative flex items-center justify-center" style={{
        width: 22, height: 22,
        borderRadius: '50%',
        border: '1.5px solid #2a3558',
        background: 'radial-gradient(circle, #1a2040 0%, #0e1428 100%)',
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2a3558' }} />
      </div>
      {/* Corner dots */}
      {[[2,2],[2,-2],[-2,2],[-2,-2]].map(([dx, dy], i) => (
        <div key={i} className="absolute" style={{
          width: 3, height: 3, borderRadius: '50%', background: '#2a3558',
          [dy < 0 ? 'bottom' : 'top']: 5,
          [dx < 0 ? 'right' : 'left']: 5,
        }} />
      ))}
    </div>
  )
}

export function TileMatch({ onBack, onComplete, onRestart }: GameProps) {
  const [cards] = useState(() => shuffle(PAIRS).map((s, i) => ({ id: i, ...s })))
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [done, setDone] = useState(false)
  const [locked, setLocked] = useState(false)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const started = useRef(false)

  useEffect(() => {
    if (done && tickRef.current) clearInterval(tickRef.current)
  }, [done])

  const startTimer = () => {
    if (started.current) return
    started.current = true
    tickRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
  }

  const flip = (id: number) => {
    if (locked || flipped.includes(id) || matched.includes(id)) return
    startTimer()
    const newFlipped = [...flipped, id]
    setFlipped(newFlipped)
    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      setLocked(true)
      const [a, b] = newFlipped
      if (cards[a].Icon === cards[b].Icon) {
        const newMatched = [...matched, a, b]
        setMatched(newMatched)
        setFlipped([])
        setLocked(false)
        if (newMatched.length === cards.length) {
          clearInterval(tickRef.current!)
          setDone(true)
        }
      } else {
        setTimeout(() => { setFlipped([]); setLocked(false) }, 900)
      }
    }
  }

  const calcScore = () => Math.max(20, 140 - Math.max(0, elapsed - 20) * 2 - Math.max(0, moves - 8) * 3)

  if (done) {
    const score = calcScore()
    return (
      <div className="game-screen max-w-lg mx-auto">
        <button onClick={onBack} className="game-back-btn mb-8">← Back to Hub</button>
        <p className="game-label mb-4">Security Tile Match — Results</p>
        <div className="flex items-baseline gap-3 mb-2">
          <span className="game-score-final">{score}</span>
          <span className="game-score-denom">/ 140 pts</span>
        </div>
        <div className="flex gap-8 mb-5">
          <div>
            <p className="font-mono font-bold text-xl" style={{ color: '#E8E6D4' }}>{elapsed}s</p>
            <p className="game-label mt-0.5">Time</p>
          </div>
          <div>
            <p className="font-mono font-bold text-xl" style={{ color: '#E8E6D4' }}>{moves}</p>
            <p className="game-label mt-0.5">Moves</p>
          </div>
        </div>
        <p className="game-flavor-text mb-8">
          {score >= 120 ? 'Blazing fast memory.' : score >= 80 ? 'Good recall. Under 20s next time?' : 'Matched them all! Speed up next round.'}
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={() => onComplete(score)} className="game-claim-btn">Claim {score} pts →</button>
          {onRestart && (
            <button onClick={onRestart} className="game-back-btn text-center">↺ Play Again</button>
          )}
        </div>
      </div>
    )
  }

  const pairsLeft = SYMBOLS.length - matched.length / 2

  return (
    <div className="game-screen max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="game-back-btn">← Hub</button>
        <div className="flex gap-4 text-[13px] font-black tabular-nums">
          <span style={{ color: '#fbbf24', textShadow: '0 0 12px #fbbf2466' }}>{elapsed}s</span>
          <span style={{ color: '#a78bfa' }}>{moves} moves</span>
          <span style={{ color: '#4ade80', textShadow: '0 0 12px #4ade8055' }}>{pairsLeft} left</span>
        </div>
      </div>

      <p className="game-label mb-5">Find all 8 matching pairs</p>

      <div className="grid grid-cols-4 gap-2 max-w-[360px] mx-auto">
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.id)
          const isMatched = matched.includes(card.id)
          const CardIcon = card.Icon

          return (
            <motion.button
              key={card.id}
              onClick={() => flip(card.id)}
              disabled={isMatched || (locked && !flipped.includes(card.id))}
              whileTap={!isMatched ? { scale: 0.88 } : {}}
              className="aspect-square rounded-xl overflow-hidden relative"
              style={{
                background: isMatched
                  ? `${card.color}15`
                  : isFlipped
                    ? '#151b30'
                    : '#0c1020',
                border: isMatched
                  ? `1.5px solid ${card.color}55`
                  : isFlipped
                    ? `1.5px solid ${card.color}40`
                    : '1.5px solid #18203a',
                cursor: isMatched ? 'default' : 'pointer',
                boxShadow: isMatched
                  ? `0 0 20px ${card.glow}40, inset 0 0 20px ${card.color}08`
                  : isFlipped
                    ? `0 0 12px ${card.color}20`
                    : 'none',
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isFlipped ? (
                  <motion.div
                    key="front"
                    initial={{ rotateY: -90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    {isMatched && (
                      <div className="absolute inset-0 pointer-events-none" style={{
                        background: `radial-gradient(circle at center, ${card.color}18 0%, transparent 70%)`,
                        animation: 'pulseGlow 2s ease-in-out infinite',
                      }} />
                    )}
                    <CardIcon
                      size={28}
                      strokeWidth={1.4}
                      style={{
                        color: card.color,
                        filter: isMatched
                          ? `drop-shadow(0 0 8px ${card.color}cc) drop-shadow(0 0 16px ${card.glow}66)`
                          : `drop-shadow(0 0 4px ${card.color}66)`,
                        position: 'relative',
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="w-full h-full"
                  >
                    <CardBack idx={idx} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>

      {/* Pair progress bar */}
      <div className="flex gap-1.5 mt-6 max-w-[340px] mx-auto">
        {SYMBOLS.map((sym, i) => {
          const isFound = matched.length / 2 > i
          return (
            <div key={i} className="flex-1 relative">
              <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: '#111827' }}>
                <motion.div
                  className="h-full rounded-full"
                  animate={{ width: isFound ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  style={{ background: sym.color, boxShadow: isFound ? `0 0 8px ${sym.color}88` : 'none' }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
