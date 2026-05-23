import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown } from 'lucide-react'
import type { GameProps } from '../Game'

const qs = [
  { q: 'What does "end-to-end encryption" protect?', opts: ['Your password', 'Messages so only sender/receiver can read them', 'Your device hardware', 'Your wifi speed'], a: 1 },
  { q: 'What is a "zero-day vulnerability"?', opts: ['A virus from the 2000s', 'An unpatched flaw unknown to the vendor', 'A firewall setting', 'A type of spam email'], a: 1 },
  { q: 'Which authentication method is most secure?', opts: ['Password only', 'Security question', 'Hardware security key (e.g. YubiKey)', 'Short PIN'], a: 2 },
  { q: 'What is "social engineering" in cybersecurity?', opts: ['Building apps for social media', 'Manipulating people into revealing private info', 'A networking protocol', 'A type of firewall'], a: 1 },
  { q: 'What happens if you use the same password everywhere?', opts: ["It's more convenient and safer", 'One breach exposes all your accounts', 'Passwords stay stronger with reuse', 'Nothing bad usually'], a: 1 },
]

const BOARD_STATES = [
  { wq: [0, 7], bk: [7, 7], desc: 'White Queen starts. Answer to advance.' },
  { wq: [3, 7], bk: [7, 7], desc: 'Queen advances across the board.' },
  { wq: [6, 7], bk: [7, 7], desc: 'Queen threatens. Black King moves.' },
  { wq: [6, 5], bk: [7, 6], desc: 'Queen pins the King.' },
  { wq: [7, 6], bk: [7, 7], desc: 'Final move closing in...' },
  { wq: [6, 7], bk: [7, 7], desc: 'Checkmate!' },
]

function Board({ state, animate }: { state: typeof BOARD_STATES[0]; animate: boolean }) {
  return (
    <div className="rounded-xl overflow-hidden mx-auto" style={{ maxWidth: 280, border: '2px solid #2a3050' }}>
      <div className="grid grid-cols-8 gap-0">
        {Array.from({ length: 64 }).map((_, idx) => {
          const row = Math.floor(idx / 8), col = idx % 8
          const isDark = (row + col) % 2 === 1
          const isWQ = state.wq[0] === col && state.wq[1] === row
          const isBK = state.bk[0] === col && state.bk[1] === row
          return (
            <div
              key={idx}
              className="aspect-square flex items-center justify-center"
              style={{ background: isDark ? '#2e4a8a' : '#0d1a30' }}
            >
              {isWQ && (
                <motion.div
                  animate={animate ? { scale: [1, 1.4, 1] } : {}}
                  transition={{ duration: 0.35 }}
                  className="flex items-center justify-center"
                >
                  <Crown size={13} strokeWidth={2} style={{ color: '#fbbf24', filter: 'drop-shadow(0 0 4px #fbbf2488)' }} />
                </motion.div>
              )}
              {isBK && (
                <motion.div
                  animate={animate ? { x: [0, 3, -3, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  className="w-3 h-3 rounded-full"
                  style={{ background: '#f87171', boxShadow: '0 0 6px #f8717188' }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ANSWER_BG = ['#E84545', '#1368CE', '#D89E00', '#26890C']

export function ChessChallenge({ onBack, onComplete }: GameProps) {
  const [step, setStep] = useState(0)
  const [boardIdx, setBoardIdx] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const [animated, setAnimated] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [bd, setBd] = useState<boolean[]>([])

  const q = qs[step]

  const pick = (i: number) => {
    if (chosen !== null) return
    const correct = i === q.a
    setChosen(i)
    setBd(b => [...b, correct])
    if (correct) {
      setScore(s => s + 32)
      setAnimated(true)
      setTimeout(() => { setBoardIdx(b => Math.min(b + 1, BOARD_STATES.length - 1)); setAnimated(false) }, 400)
    }
  }

  const next = () => {
    if (step + 1 >= qs.length) setDone(true)
    else { setStep(s => s + 1); setChosen(null) }
  }

  if (done) return (
    <div className="game-screen max-w-xl mx-auto">
      <button onClick={onBack} className="game-back-btn mb-8">← Back to Hub</button>
      <p className="game-label mb-4">Chess Challenge — Results</p>
      <div className="flex items-center justify-center gap-3 mb-3">
        <Crown size={32} strokeWidth={1.2} style={{ color: '#fbbf24', filter: 'drop-shadow(0 0 12px #fbbf2466)' }} />
        {boardIdx >= BOARD_STATES.length - 1 && (
          <span className="font-bold tracking-widest uppercase text-[13px]" style={{ color: '#fbbf24' }}>Checkmate!</span>
        )}
      </div>
      <div className="flex items-baseline gap-3 mb-2 justify-center">
        <span className="game-score-final">{score}</span>
        <span className="game-score-denom">/ {qs.length * 32} pts</span>
      </div>
      <p className="game-flavor-text mb-8 text-center">
        {score >= 140 ? 'Full checkmate. Flawless security knowledge.' : score >= 80 ? 'Solid moves. A few questions tripped you up.' : 'The opponent survived. Study up and try again.'}
      </p>
      <div className="flex gap-1.5 mb-10">
        {bd.map((ok, i) => <div key={i} className="flex-1 h-2 rounded-full" style={{ background: ok ? '#4ade80' : '#f87171' }} />)}
      </div>
      <div className="text-center">
        <button onClick={() => onComplete(score)} className="game-claim-btn">Claim {score} pts →</button>
      </div>
    </div>
  )

  return (
    <div className="game-screen max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="game-back-btn">← Hub</button>
        <div className="flex items-center gap-4">
          <span className="game-label">Move {boardIdx}/{qs.length}</span>
          <span className="font-bold text-[15px]" style={{ color: '#22D3EE' }}>{score} pts</span>
        </div>
      </div>

      {/* Board state label */}
      <div className="flex items-center gap-2 mb-3">
        <Crown size={13} strokeWidth={1.5} style={{ color: '#fbbf24' }} />
        <p className="text-[12px] font-medium" style={{ color: '#4a5578' }}>{BOARD_STATES[boardIdx].desc}</p>
      </div>

      <Board state={BOARD_STATES[boardIdx]} animate={animated} />

      {/* Board legend */}
      <div className="flex items-center justify-center gap-4 mt-2 mb-5">
        <div className="flex items-center gap-1.5">
          <Crown size={11} strokeWidth={2} style={{ color: '#fbbf24' }} />
          <span className="text-[10px]" style={{ color: '#4a5578' }}>White Queen (you)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#f87171' }} />
          <span className="text-[10px]" style={{ color: '#4a5578' }}>Black King</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
          <div className="rounded-2xl px-5 py-4 mb-4" style={{ background: '#141826', border: '1px solid #1e2340' }}>
            <p className="font-bold text-[15px] leading-snug" style={{ color: '#E8E6D4' }}>{q.q}</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {q.opts.map((opt, i) => {
              const show = chosen !== null
              const isCorrect = i === q.a
              const isChosen = chosen === i
              let bg = ANSWER_BG[i], opacity = 1
              if (show) {
                if (isCorrect) { opacity = 1 }
                else if (isChosen) { opacity = 0.4 }
                else { opacity = 0.3 }
              }
              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  disabled={chosen !== null}
                  className="text-left px-4 py-3.5 rounded-2xl text-[13px] font-bold text-white transition-all active:scale-95"
                  style={{ background: bg, opacity, boxShadow: `0 3px 12px ${bg}44`, cursor: chosen !== null ? 'default' : 'pointer' }}
                >
                  {opt}
                </button>
              )
            })}
          </div>

          {chosen !== null && (
            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={next}
              className="game-claim-btn"
            >
              {chosen === q.a ? 'Piece moved! Next →' : 'Opponent holds. Next →'}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
