import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, ShieldX } from 'lucide-react'
import type { GameProps } from '../Game'

const rounds = [
  { a: 'password123', b: 'P@ssw0rd!9xK', stronger: 'b', hint: 'Symbols, mixed case, and unpredictable pattern always beats common words.' },
  { a: 'Tr0ub4dor&3', b: 'qwerty', stronger: 'a', hint: 'Even a "weird" looking password beats a keyboard row.' },
  { a: 'ilovemycat2005', b: 'kX!m9#Lq2', stronger: 'b', hint: 'Personal info + a year is predictable. Random short wins here.' },
  { a: 'correct-horse-battery-staple', b: 'P4$$w0rd', stronger: 'a', hint: '4 random words = ~44 bits of entropy. Way stronger than letter-swaps.' },
  { a: '12345678', b: 'Summer2024!', stronger: 'b', hint: 'Any real word is better than sequential numbers.' },
  { a: 'J&k9#Lm!2vQ', b: 'MyDog!sNameIsBuddy22', stronger: 'a', hint: 'High-entropy random characters beat long but predictable phrases.' },
  { a: 'abc123', b: 'sunshine', stronger: 'a', hint: '"abc123" is marginally harder than a single dictionary word, but both are weak.' },
  { a: 'n$Kp!7Xw@2qL', b: 'N$Kp!7Xw@2qL8', stronger: 'b', hint: 'Same pattern but one character longer = exponentially harder to crack.' },
]

function strengthScore(pw: string): number {
  let s = 0
  if (pw.length >= 8) s++
  if (pw.length >= 12) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

const STRENGTH_LABELS = ['Very Weak', 'Weak', 'Weak', 'Medium', 'Strong', 'Very Strong']
const STRENGTH_COLORS = ['#f87171', '#f87171', '#f87171', '#fbbf24', '#fbbf24', '#4ade80']

export function PasswordHero({ onBack, onComplete }: GameProps) {
  const [step, setStep] = useState(0)
  const [chosen, setChosen] = useState<'a' | 'b' | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [bd, setBd] = useState<boolean[]>([])

  const q = rounds[step]

  const pick = (val: 'a' | 'b') => {
    if (chosen) return
    const correct = val === q.stronger
    setChosen(val)
    if (correct) setScore(s => s + 12)
    setBd(b => [...b, correct])
  }

  const next = () => {
    if (step + 1 >= rounds.length) setDone(true)
    else { setStep(s => s + 1); setChosen(null) }
  }

  if (done) return (
    <div className="game-screen max-w-xl mx-auto">
      <button onClick={onBack} className="game-back-btn mb-8">← Back to Hub</button>
      <p className="game-label mb-4">Password Hero — Results</p>
      <div className="flex items-baseline gap-3 mb-2">
        <span className="game-score-final">{score}</span>
        <span className="game-score-denom">/ {rounds.length * 12} pts</span>
      </div>
      <p className="game-flavor-text mb-8">
        {score >= 84 ? 'You understand password security deeply.' : score >= 48 ? 'Solid understanding with a few surprises.' : 'Password strength is counterintuitive — now you know.'}
      </p>
      <div className="flex gap-1.5 mb-10">
        {bd.map((ok, i) => <div key={i} className="flex-1 h-2 rounded-full" style={{ background: ok ? '#4ade80' : '#f87171' }} />)}
      </div>
      <button onClick={() => onComplete(score)} className="game-claim-btn">Claim {score} pts →</button>
    </div>
  )

  return (
    <div className="game-screen max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="game-back-btn">← Hub</button>
        <div className="flex items-center gap-4">
          <span className="game-label">{step + 1}/{rounds.length}</span>
          <span className="font-bold text-[15px]" style={{ color: '#60a5fa' }}>{score} pts</span>
        </div>
      </div>

      <div className="flex gap-1.5 mb-6">
        {rounds.map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-500"
            style={{ background: i < step ? (bd[i] ? '#4ade80' : '#f87171') : i === step ? '#60a5fa' : '#1e2236' }} />
        ))}
      </div>

      <p className="font-bold text-[13px] mb-5 tracking-wide" style={{ color: '#8890b0' }}>
        WHICH PASSWORD IS STRONGER?
      </p>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>
          <div className="flex flex-col gap-3 mb-6">
            {(['a', 'b'] as const).map(key => {
              const pw = q[key]
              const str = strengthScore(pw)
              const isStronger = key === q.stronger
              const isChosen = chosen === key
              const show = chosen !== null

              let bg = '#141826'
              let borderColor = '#1e2340'
              let labelColor = '#8890b0'

              if (show && isStronger) { bg = '#052e16'; borderColor = '#4ade8055'; labelColor = '#4ade80' }
              else if (show && isChosen && !isStronger) { bg = '#450a0a'; borderColor = '#f8717155'; labelColor = '#f87171' }

              return (
                <button
                  key={key}
                  onClick={() => pick(key)}
                  disabled={chosen !== null}
                  className="w-full text-left rounded-2xl px-5 py-4 transition-all duration-200"
                  style={{ background: bg, border: `2px solid ${borderColor}`, cursor: chosen ? 'default' : 'pointer' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold tracking-widest" style={{ color: labelColor }}>
                      {key.toUpperCase()}
                      {show && isStronger && ' — STRONGER'}
                      {show && isChosen && !isStronger && ' — WEAKER'}
                    </span>
                    {show && (isStronger
                      ? <ShieldCheck size={16} strokeWidth={1.5} style={{ color: '#4ade80' }} />
                      : isChosen && <ShieldX size={16} strokeWidth={1.5} style={{ color: '#f87171' }} />
                    )}
                  </div>
                  <code className="block text-[14px] font-mono mb-3 break-all leading-relaxed" style={{ color: '#E8E6D4' }}>
                    {pw}
                  </code>
                  <div className="flex gap-1 items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-300"
                        style={{ background: i < str ? STRENGTH_COLORS[str] : '#1e2340' }} />
                    ))}
                    <span className="ml-2 text-[10px] font-bold" style={{ color: str >= 4 ? '#4ade80' : str >= 3 ? '#fbbf24' : '#f87171' }}>
                      {STRENGTH_LABELS[str]}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {chosen && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-xl px-5 py-4 mb-5"
                style={{ background: '#0d1b0d', border: '1px solid #1e4020' }}>
                <p className="text-[13px] leading-relaxed" style={{ color: '#6b9970' }}>{q.hint}</p>
              </div>
              <button onClick={next} className="game-claim-btn">
                {step + 1 < rounds.length ? 'Next →' : 'See Results →'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
