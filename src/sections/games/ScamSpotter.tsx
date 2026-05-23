import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, ShieldCheck, ShieldX, Signal, Wifi, Battery } from 'lucide-react'
import type { GameProps } from '../Game'

const TIME_PER_Q = 8

const scenarios = [
  { msg: "Congrats! You've been selected for a FREE iPhone 15. Click here to claim: bit.ly/free-ph0ne", answer: 'scam', sender: 'Unknown', initials: '?', hint: 'Free prize links via SMS are almost always phishing.' },
  { msg: 'Hi, your Amazon order #114-8281-7734 has shipped! Estimated delivery: Friday. Track at amazon.com/orders', answer: 'real', sender: 'Amazon', initials: 'A', hint: 'Legitimate shipping emails link to official domains only.' },
  { msg: 'URGENT: Your bank account has been locked. Verify now at secure-bank-login.net to avoid suspension.', answer: 'scam', sender: 'BANK-ALERT', initials: 'B', hint: 'Banks use their own domains — "secure-bank-login.net" is a red flag.' },
  { msg: 'Mom: Can you grab milk on your way home? Also dinner is at 7.', answer: 'real', sender: 'Mom', initials: 'M', hint: 'Normal, personal message with no suspicious links or requests.' },
  { msg: 'You owe $892 in unpaid taxes. Pay now or face arrest. Call 1-800-555-TAX immediately.', answer: 'scam', sender: 'IRS-Notice', initials: 'I', hint: 'The IRS never threatens arrest via phone or text.' },
  { msg: 'Your Spotify Premium subscription renews on June 1st for $9.99. Manage billing at spotify.com/account', answer: 'real', sender: 'Spotify', initials: 'S', hint: 'Official renewal notices use the real company domain.' },
  { msg: "Hi! I found your number online. I have a business opportunity that pays $500/day from home!", answer: 'scam', sender: '+44 7911 123456', initials: '?', hint: '"Work from home" offers from strangers are almost always scams.' },
  { msg: "Your password was recently changed. If this wasn't you, visit apple.com/account to secure your account.", answer: 'real', sender: 'Apple', initials: 'A', hint: 'Legit security alerts direct you to the official site, never a random link.' },
]

export function ScamSpotter({ onBack, onComplete }: GameProps) {
  const [step, setStep] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [breakdown, setBreakdown] = useState<boolean[]>([])
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stepRef = useRef(step)
  stepRef.current = step

  const q = scenarios[step]

  const stopTimer = () => { if (timerRef.current) clearInterval(timerRef.current) }

  const pick = (choice: string) => {
    if (chosen) return
    stopTimer()
    const correct = choice === q.answer
    setChosen(choice)
    if (correct) setScore(s => s + 15)
    setBreakdown(b => [...b, correct])
  }

  useEffect(() => {
    if (done || chosen) return
    setTimeLeft(TIME_PER_Q)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          stopTimer()
          const cur = scenarios[stepRef.current]
          pick(cur.answer === 'real' ? 'scam' : 'real')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return stopTimer
  }, [step, done]) // eslint-disable-line react-hooks/exhaustive-deps

  const next = () => {
    if (step + 1 >= scenarios.length) setDone(true)
    else { setStep(s => s + 1); setChosen(null) }
  }

  if (done) return (
    <div className="game-screen max-w-xl mx-auto">
      <button onClick={onBack} className="game-back-btn mb-8">← Back to Hub</button>
      <p className="game-label mb-4">Scam Spotter — Results</p>
      <div className="flex items-baseline gap-3 mb-2">
        <span className="game-score-final">{score}</span>
        <span className="game-score-denom">/ {scenarios.length * 15} pts</span>
      </div>
      <p className="game-flavor-text mb-8">
        {score >= 100 ? 'Expert detector. Scammers hate you.' : score >= 60 ? 'Good instincts. A few slipped through.' : 'Tricky stuff. Now you know what to watch for.'}
      </p>
      <div className="flex gap-1.5 mb-10">
        {breakdown.map((ok, i) => (
          <div key={i} className="flex-1 h-2 rounded-full" style={{ background: ok ? '#4ade80' : '#f87171' }} />
        ))}
      </div>
      <button onClick={() => onComplete(score)} className="game-claim-btn">
        Claim {score} pts →
      </button>
    </div>
  )

  const isCorrect = chosen === q.answer

  return (
    <div className="game-screen max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="game-back-btn">← Hub</button>
        <div className="flex items-center gap-4">
          <span className="game-label">{step + 1}/{scenarios.length}</span>
          <span className="font-bold text-[15px]" style={{ color: '#FBBF24' }}>{score} pts</span>
        </div>
      </div>

      <div className="flex gap-1.5 mb-7">
        {scenarios.map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-500"
            style={{ background: i < step ? '#4ade80' : breakdown[i] === false ? '#f87171' : i === step ? '#FBBF24' : '#1e2236' }} />
        ))}
      </div>

      {/* Timer */}
      <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: '#111827' }}>
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${(timeLeft / TIME_PER_Q) * 100}%` }}
          transition={{ duration: 0.9, ease: 'linear' }}
          style={{
            background: timeLeft <= 2 ? '#f87171' : timeLeft <= 4 ? '#fbbf24' : '#FBBF24',
            boxShadow: `0 0 8px ${timeLeft <= 2 ? '#f87171' : '#fbbf24'}88`,
          }}
        />
      </div>

      <p className="game-label mb-5">Is this message real or a scam?</p>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>

          {/* iPhone Messages mockup */}
          <div className="rounded-3xl mb-6 overflow-hidden" style={{ background: '#1c1c1e', border: '1px solid #2c2c2e' }}>
            {/* iOS status bar */}
            <div className="flex items-center justify-between px-5 pt-3 pb-1" style={{ background: '#1c1c1e' }}>
              <span className="text-[11px] font-semibold tabular-nums" style={{ color: '#E8E6D4' }}>9:41</span>
              <div className="flex items-center gap-1.5">
                <Signal size={12} strokeWidth={2} style={{ color: '#E8E6D4' }} />
                <Wifi size={12} strokeWidth={2} style={{ color: '#E8E6D4' }} />
                <Battery size={12} strokeWidth={2} style={{ color: '#E8E6D4' }} />
              </div>
            </div>

            {/* Navigation bar */}
            <div className="flex flex-col items-center py-3 px-4" style={{ background: '#1c1c1e', borderBottom: '1px solid #2c2c2e' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[15px] mb-1"
                style={{ background: '#3a3a3c', color: '#E8E6D4' }}>
                {q.initials}
              </div>
              <p className="font-semibold text-[13px]" style={{ color: '#E8E6D4' }}>{q.sender}</p>
              <p className="text-[11px]" style={{ color: '#8e8e93' }}>Text Message</p>
            </div>

            {/* Messages area */}
            <div className="px-4 pt-4 pb-5 relative" style={{ background: '#000', minHeight: 100 }}>
              <div className="flex justify-start">
                <div className="max-w-[78%] rounded-2xl rounded-tl-md px-4 py-2.5" style={{ background: '#3a3a3c' }}>
                  <p className="text-[14px] leading-relaxed" style={{ color: '#E8E6D4' }}>{q.msg}</p>
                </div>
              </div>
              <p className="text-[10px] mt-2 ml-1" style={{ color: '#48484a' }}>
                Today {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>

              {/* Reveal overlay */}
              <AnimatePresence>
                {chosen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: isCorrect ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)', backdropFilter: 'blur(2px)' }}
                  >
                    {isCorrect
                      ? <CheckCircle2 size={52} strokeWidth={1.5} style={{ color: '#4ade80', filter: 'drop-shadow(0 0 20px #4ade8088)' }} />
                      : <XCircle size={52} strokeWidth={1.5} style={{ color: '#f87171', filter: 'drop-shadow(0 0 20px #f8717188)' }} />
                    }
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Verdict buttons */}
          {!chosen ? (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => pick('real')}
                className="py-5 rounded-2xl font-bold text-[15px] transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
                style={{ background: '#16A34A', boxShadow: '0 4px 20px #16A34A44', color: '#fff' }}
              >
                <ShieldCheck size={18} strokeWidth={2} />
                REAL
              </button>
              <button
                onClick={() => pick('scam')}
                className="py-5 rounded-2xl font-bold text-[15px] transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
                style={{ background: '#DC2626', boxShadow: '0 4px 20px #DC262644', color: '#fff' }}
              >
                <ShieldX size={18} strokeWidth={2} />
                SCAM
              </button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-xl px-5 py-4 mb-5"
                style={{ background: isCorrect ? '#052e16' : '#450a0a', border: `1px solid ${isCorrect ? '#4ade8030' : '#f8717130'}` }}>
                <p className="font-bold text-[13px] mb-1" style={{ color: isCorrect ? '#4ade80' : '#f87171' }}>
                  {isCorrect ? 'Correct' : 'Wrong'} — It was {q.answer.toUpperCase()}
                </p>
                <p className="text-[12px]" style={{ color: '#6b7599' }}>{q.hint}</p>
              </div>
              <button onClick={next} className="game-claim-btn">
                {step + 1 < scenarios.length ? 'Next message →' : 'See results →'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
