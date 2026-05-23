import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Check, X } from 'lucide-react'
import type { GameProps } from '../Game'

const qs = [
  { q: 'What does "phishing" mean online?', opts: ['Catching fish with apps', 'Tricking people into giving personal info', 'Fast internet browsing', 'Downloading files illegally'], a: 1 },
  { q: 'A good password should be…', opts: ['Your birthday', 'At least 8 chars with symbols and numbers', "Your pet's name", 'Easy to remember'], a: 1 },
  { q: 'Two-factor authentication (2FA) means…', opts: ['Two usernames', 'Password + second verification step', 'Two passwords', 'Login twice'], a: 1 },
  { q: 'What is malware?', opts: ['A type of hardware', 'Software designed to harm your device', 'A slow WiFi connection', 'A broken keyboard'], a: 1 },
  { q: 'Public WiFi is risky because…', opts: ["It's too slow", 'Others can see your traffic', 'It uses more battery', 'It costs money'], a: 1 },
  { q: 'A VPN helps you…', opts: ['Speed up your internet', 'Encrypt your connection and hide your IP', 'Free streaming', 'Charge faster'], a: 1 },
  { q: 'What should you do if you get a suspicious email?', opts: ['Reply asking who they are', 'Click the link to check', "Delete it, don't click anything", 'Forward it to friends'], a: 2 },
  { q: 'HTTPS means the website is…', opts: ['Fast', 'Encrypted and secure', 'Free to use', 'Government-approved'], a: 1 },
  { q: 'Which is most at risk from hackers?', opts: ['Offline journal', 'Reused password across sites', 'Strong unique password', 'Physical cash'], a: 1 },
  { q: 'What is a "data breach"?', opts: ['A broken dam', 'Unauthorized access to private data', 'A type of virus', 'Slow loading website'], a: 1 },
]

const TIME_PER_Q = 5

const ANSWER_STYLES = [
  { bg: '#E84545', shape: '▲' },
  { bg: '#1368CE', shape: '◆' },
  { bg: '#D89E00', shape: '●' },
  { bg: '#26890C', shape: '■' },
]

export function SpeedTrivia({ onBack, onComplete, onRestart }: GameProps) {
  // Shuffle answer options once on mount so correct index isn't always 1
  const [questions] = useState(() =>
    qs.map(q => {
      const order = [0, 1, 2, 3]
      for (let i = 3; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[order[i], order[j]] = [order[j], order[i]]
      }
      return { ...q, opts: order.map(i => q.opts[i]), a: order.indexOf(q.a) }
    })
  )
  const [step, setStep] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [done, setDone] = useState(false)
  const [bd, setBd] = useState<boolean[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const q = questions[step]

  const stopTimer = () => { if (timerRef.current) clearInterval(timerRef.current) }

  useEffect(() => {
    if (done || chosen !== null) return
    setTimeLeft(TIME_PER_Q)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          stopTimer()
          setChosen(-1)
          setStreak(0)
          setBd(b => [...b, false])
          return 0
        }
        return t - 1
      })
    }, 1000)
    return stopTimer
  }, [step, done])  // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (idx: number) => {
    if (chosen !== null) return
    stopTimer()
    const correct = idx === q.a
    setChosen(idx)
    if (correct) {
      const bonus = timeLeft >= 4 ? 20 : timeLeft >= 2 ? 15 : 10
      const multi = streak >= 2 ? 2 : streak >= 1 ? 1.5 : 1
      setScore(s => s + Math.round(bonus * multi))
      setStreak(s => s + 1)
    } else {
      setStreak(0)
    }
    setBd(b => [...b, correct])
  }

  const next = () => {
    if (step + 1 >= questions.length) setDone(true)
    else { setStep(s => s + 1); setChosen(null) }
  }

  if (done) return (
    <div className="game-screen max-w-xl mx-auto">
      <button onClick={onBack} className="game-back-btn mb-8">← Back to Hub</button>
      <p className="game-label mb-4">Speed Trivia — Results</p>
      <div className="flex items-baseline gap-3 mb-2">
        <span className="game-score-final">{score}</span>
        <span className="game-score-denom">/ {questions.length * 20} pts</span>
      </div>
      <p className="game-flavor-text mb-8">
        {score >= 130 ? 'Lightning fast AND accurate. Dangerous combo.' : score >= 80 ? 'Solid score. Speed answers need practice.' : 'The 5-second pressure is real. Keep going.'}
      </p>
      <div className="flex gap-1.5 mb-10">
        {bd.map((ok, i) => (
          <div key={i} className="flex-1 h-2 rounded-full" style={{ background: ok ? '#4ade80' : '#f87171' }} />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <button onClick={() => onComplete(Math.min(score, 160))} className="game-claim-btn">
          Claim {Math.min(score, 160)} pts →
        </button>
        {onRestart && (
          <button onClick={onRestart} className="game-back-btn text-center">↺ Play Again</button>
        )}
      </div>
    </div>
  )

  const timerPct = (timeLeft / TIME_PER_Q) * 100
  const timerColor = timeLeft <= 1 ? '#f87171' : timeLeft <= 2 ? '#fbbf24' : '#4ade80'

  return (
    <div className="game-screen max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="game-back-btn">← Hub</button>
        <div className="flex items-center gap-4">
          {streak >= 2 && (
            <span className="flex items-center gap-1 text-[12px] font-bold" style={{ color: '#fbbf24' }}>
              <Flame size={13} strokeWidth={1.5} />
              x{streak >= 2 ? '2' : '1.5'}
            </span>
          )}
          <span className="game-label">{step + 1}/{questions.length}</span>
          <span className="font-bold text-[15px]" style={{ color: '#A78BFA' }}>{score} pts</span>
        </div>
      </div>

      <div className="flex gap-1.5 mb-6">
        {questions.map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-500"
            style={{ background: i < step ? '#4ade80' : bd[i] === false ? '#f87171' : i === step ? '#A78BFA' : '#1e2236' }} />
        ))}
      </div>

      {/* Timer */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: '#1e2236' }}>
          <motion.div
            className="h-full rounded-full"
            animate={{ width: `${timerPct}%` }}
            transition={{ duration: 0.9, ease: 'linear' }}
            style={{ background: timerColor, boxShadow: `0 0 8px ${timerColor}66` }}
          />
        </div>
        <span className="absolute font-bold text-lg tabular-nums" style={{ color: timerColor, textShadow: '0 0 10px currentColor' }}>
          {timeLeft}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          <div className="rounded-2xl px-6 py-5 mb-6 text-center" style={{ background: '#1a1d2e', border: '1px solid #2a2f4a' }}>
            <p className="font-bold text-lg sm:text-xl leading-snug" style={{ color: '#E8E6D4' }}>{q.q}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {q.opts.map((opt, i) => {
              const style = ANSWER_STYLES[i]
              const show = chosen !== null
              const isCorrect = i === q.a
              const isChosen = chosen === i
              const isTimedOut = chosen === -1
              let opacity = 1
              let ring = ''
              if (show) {
                if (isCorrect) ring = '0 0 0 3px rgba(255,255,255,0.6)'
                else if (isChosen && !isCorrect) opacity = 0.35
                else if (!isCorrect && !isChosen) opacity = isTimedOut ? 0.35 : 0.5
              }
              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  disabled={chosen !== null}
                  className="relative flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-[13px] text-white text-left transition-all duration-200 active:scale-95"
                  style={{ background: style.bg, opacity, boxShadow: ring || `0 4px 14px ${style.bg}55`, cursor: chosen !== null ? 'default' : 'pointer' }}
                >
                  <span className="text-xl shrink-0 leading-none">{style.shape}</span>
                  <span className="leading-tight flex-1">{opt}</span>
                  {show && isCorrect && <Check size={16} strokeWidth={2.5} className="shrink-0" />}
                  {show && isChosen && !isCorrect && <X size={16} strokeWidth={2.5} className="shrink-0" />}
                </button>
              )
            })}
          </div>

          {chosen !== null && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
              <button onClick={next} className="game-claim-btn">
                {step + 1 < questions.length ? 'Next question →' : 'See results →'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
