import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, EyeOff, MapPin, Camera, Users, CreditCard, UserRound, ShieldAlert } from 'lucide-react'
import type { GameProps } from '../Game'

const TIME_PER_Q = 7

const scenarios = [
  { req: 'A random quiz app asks for your phone number to "send you your results"', icon: ShieldAlert, share: false, hint: "Quiz results don't require a phone number — this is data harvesting.", app: 'QuizMaster Pro' },
  { req: "Your school's official registration form asks for your student ID number", icon: UserRound, share: true, hint: 'Official school systems legitimately need your student ID.', app: 'School Portal' },
  { req: 'A new social media app asks for camera, microphone, AND location just to sign up', icon: Camera, share: false, hint: 'Triple permissions at signup are excessive. Deny and reconsider using the app.', app: 'SocialSnap' },
  { req: 'A bank form asks for your Social Security number to open an account', icon: CreditCard, share: true, hint: 'Banks are legally required to verify identity. Official bank forms need your SSN.', app: 'SecureBank' },
  { req: 'An online store asks you to save your credit card info "for faster checkout"', icon: CreditCard, share: false, hint: 'Always re-enter payment info. Saved cards can be stolen in data breaches.', app: 'ShopNow' },
  { req: "A doctor's office portal asks for your date of birth on a medical form", icon: UserRound, share: true, hint: 'Medical providers need DOB for accurate patient identification.', app: 'HealthPortal' },
  { req: 'A gaming app asks for access to your full contact list to "find friends"', icon: Users, share: false, hint: "This uploads everyone's info, not just yours. Deny contact access unless essential.", app: 'GameZone' },
  { req: 'A government website asks for your address to mail voter registration info', icon: MapPin, share: true, hint: 'Official government services legitimately need your address for mail.', app: 'VoterGov.gov' },
]

export function PrivacyProtector({ onBack, onComplete }: GameProps) {
  const [step, setStep] = useState(0)
  const [chosen, setChosen] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [bd, setBd] = useState<boolean[]>([])
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stepRef = useRef(step)
  stepRef.current = step

  const q = scenarios[step]
  const ReqIcon = q.icon

  const stopTimer = () => { if (timerRef.current) clearInterval(timerRef.current) }

  const pick = (val: boolean) => {
    if (chosen !== null) return
    stopTimer()
    const correct = val === q.share
    setChosen(val)
    if (correct) setScore(s => s + 17)
    setBd(b => [...b, correct])
  }

  useEffect(() => {
    if (done || chosen !== null) return
    setTimeLeft(TIME_PER_Q)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          stopTimer()
          pick(!scenarios[stepRef.current].share)
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
      <p className="game-label mb-4">Privacy Protector — Results</p>
      <div className="flex items-baseline gap-3 mb-2">
        <span className="game-score-final">{score}</span>
        <span className="game-score-denom">/ {scenarios.length * 17} pts</span>
      </div>
      <p className="game-flavor-text mb-8">
        {score >= 100 ? 'Your data is locked tight. Nice work.' : score >= 60 ? 'Solid instincts with a few gaps.' : "Privacy decisions are hard. You're learning what to watch for."}
      </p>
      <div className="flex gap-1.5 mb-10">
        {bd.map((ok, i) => <div key={i} className="flex-1 h-2 rounded-full" style={{ background: ok ? '#4ade80' : '#f87171' }} />)}
      </div>
      <button onClick={() => onComplete(score)} className="game-claim-btn">Claim {score} pts →</button>
    </div>
  )

  const isCorrect = chosen === q.share

  return (
    <div className="game-screen max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="game-back-btn">← Hub</button>
        <div className="flex items-center gap-4">
          <span className="game-label">{step + 1}/{scenarios.length}</span>
          <span className="font-bold text-[15px]" style={{ color: '#C084FC' }}>{score} pts</span>
        </div>
      </div>

      <div className="flex gap-1.5 mb-6">
        {scenarios.map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-500"
            style={{ background: i < step ? (bd[i] ? '#4ade80' : '#f87171') : i === step ? '#C084FC' : '#1e2236' }} />
        ))}
      </div>

      <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: '#111827' }}>
        <motion.div className="h-full rounded-full"
          animate={{ width: `${(timeLeft / TIME_PER_Q) * 100}%` }}
          transition={{ duration: 0.9, ease: 'linear' }}
          style={{ background: timeLeft <= 2 ? '#f87171' : '#C084FC', boxShadow: `0 0 8px ${timeLeft <= 2 ? '#f87171' : '#C084FC88'}` }}
        />
      </div>
      <p className="font-bold text-[13px] mb-5 tracking-wide" style={{ color: '#8890b0' }}>
        SHOULD YOU SHARE THIS INFO?
      </p>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>

          {/* iOS-style permission sheet */}
          <div className="rounded-3xl mb-6 overflow-hidden relative" style={{ background: '#1c1c1e', border: '1px solid #2c2c2e' }}>
            {/* App identity bar */}
            <div className="px-5 pt-5 pb-4 flex items-center gap-3" style={{ borderBottom: '1px solid #2c2c2e' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#2c2c2e' }}>
                <ReqIcon size={22} strokeWidth={1.5} style={{ color: '#C084FC' }} />
              </div>
              <div>
                <p className="font-bold text-[14px]" style={{ color: '#E8E6D4' }}>{q.app}</p>
                <p className="text-[11px]" style={{ color: '#8e8e93' }}>Requesting access</p>
              </div>
            </div>

            {/* Permission description */}
            <div className="px-5 py-5">
              <p className="text-[15px] leading-relaxed font-medium text-center" style={{ color: '#E8E6D4' }}>
                {q.req}
              </p>
            </div>

            {/* Reveal overlay */}
            <AnimatePresence>
              {chosen !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-3xl"
                  style={{ background: isCorrect ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', backdropFilter: 'blur(1px)' }}
                />
              )}
            </AnimatePresence>
          </div>

          {chosen === null ? (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => pick(true)}
                className="py-5 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{ background: '#16A34A', boxShadow: '0 4px 20px #16A34A44', color: '#fff' }}
              >
                <Share2 size={18} strokeWidth={2} />
                Share It
              </button>
              <button
                onClick={() => pick(false)}
                className="py-5 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{ background: '#7C3AED', boxShadow: '0 4px 20px #7C3AED44', color: '#fff' }}
              >
                <EyeOff size={18} strokeWidth={2} />
                Don't Share
              </button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-xl px-5 py-4 mb-5"
                style={{ background: isCorrect ? '#052e16' : '#450a0a', border: `1px solid ${isCorrect ? '#4ade8030' : '#f8717130'}` }}>
                <p className="font-bold text-[13px] mb-1" style={{ color: isCorrect ? '#4ade80' : '#f87171' }}>
                  {isCorrect ? 'Correct' : 'Wrong'} — You {q.share ? 'SHOULD' : 'SHOULD NOT'} share this
                </p>
                <p className="text-[12px]" style={{ color: '#6b7599' }}>{q.hint}</p>
              </div>
              <button onClick={next} className="game-claim-btn">
                {step + 1 < scenarios.length ? 'Next →' : 'See results →'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
