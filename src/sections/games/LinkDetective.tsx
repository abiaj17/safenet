import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, LockOpen, ShieldCheck, ShieldX } from 'lucide-react'
import type { GameProps } from '../Game'

const links = [
  { url: 'https://paypa1.com/account/verify', safe: false, danger: 'paypa1', hint: '"paypa1" uses the number 1 instead of the letter l — classic typosquat.' },
  { url: 'https://www.amazon.com/orders/track', safe: true, danger: null, hint: 'amazon.com is the real Amazon domain with https.' },
  { url: 'http://secure-netflix-login.info/signin', safe: false, danger: 'secure-netflix-login.info', hint: 'Netflix uses netflix.com only. "secure-netflix-login.info" is fake.' },
  { url: 'https://accounts.google.com/signin', safe: true, danger: null, hint: 'google.com subdomain with https is legitimate.' },
  { url: 'https://apple.com.login-secure.net/id', safe: false, danger: 'login-secure.net', hint: '"apple.com.login-secure.net" is a subdomain of login-secure.net — not Apple.' },
  { url: 'https://www.irs.gov/payments', safe: true, danger: null, hint: '.gov domains in the US are government-controlled and legitimate.' },
  { url: 'https://bit.ly/3xK9p-claim-prize', safe: false, danger: 'bit.ly', hint: 'Shortened URLs hide the real destination — treat them as suspicious.' },
  { url: 'https://github.com/anthropics/claude', safe: true, danger: null, hint: 'github.com is the real GitHub domain.' },
]

function parseDomain(url: string) {
  try {
    const u = new URL(url)
    return { protocol: u.protocol.replace(':', ''), host: u.host, path: u.pathname + u.search }
  } catch {
    return { protocol: 'http', host: url, path: '' }
  }
}

export function LinkDetective({ onBack, onComplete }: GameProps) {
  const [step, setStep] = useState(0)
  const [chosen, setChosen] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [bd, setBd] = useState<boolean[]>([])

  const q = links[step]
  const { protocol, host, path } = parseDomain(q.url)
  const isHttps = protocol === 'https'

  const pick = (choice: boolean) => {
    if (chosen !== null) return
    const correct = choice === q.safe
    setChosen(choice)
    if (correct) setScore(s => s + 15)
    setBd(b => [...b, correct])
  }

  const next = () => {
    if (step + 1 >= links.length) setDone(true)
    else { setStep(s => s + 1); setChosen(null) }
  }

  if (done) return (
    <div className="game-screen max-w-xl mx-auto">
      <button onClick={onBack} className="game-back-btn mb-8">← Back to Hub</button>
      <p className="game-label mb-4">Link Detective — Results</p>
      <div className="flex items-baseline gap-3 mb-2">
        <span className="game-score-final">{score}</span>
        <span className="game-score-denom">/ {links.length * 15} pts</span>
      </div>
      <p className="game-flavor-text mb-8">
        {score >= 100 ? "Sharp eye. You'd be hard to fool." : score >= 60 ? 'Decent detective skills. Keep practicing.' : 'Links are tricky — now you know the patterns.'}
      </p>
      <div className="flex gap-1.5 mb-10">
        {bd.map((ok, i) => <div key={i} className="flex-1 h-2 rounded-full" style={{ background: ok ? '#4ade80' : '#f87171' }} />)}
      </div>
      <button onClick={() => onComplete(score)} className="game-claim-btn">Claim {score} pts →</button>
    </div>
  )

  const isCorrect = chosen === q.safe

  return (
    <div className="game-screen max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="game-back-btn">← Hub</button>
        <div className="flex items-center gap-4">
          <span className="game-label">{step + 1}/{links.length}</span>
          <span className="font-bold text-[15px]" style={{ color: '#FDE047' }}>{score} pts</span>
        </div>
      </div>

      <div className="flex gap-1.5 mb-6">
        {links.map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-500"
            style={{ background: i < step ? (bd[i] ? '#4ade80' : '#f87171') : i === step ? '#FDE047' : '#1e2236' }} />
        ))}
      </div>

      <p className="font-bold text-[13px] mb-5 tracking-wide" style={{ color: '#8890b0' }}>
        IS THIS LINK SAFE TO CLICK?
      </p>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>

          {/* Browser address bar mockup */}
          <div className="rounded-2xl mb-6 overflow-hidden" style={{ background: '#141826', border: '1px solid #1e2340' }}>
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: '#0e1018', borderBottom: '1px solid #1e2340' }}>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#2a3050' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#2a3050' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#2a3050' }} />
              </div>
            </div>
            {/* Address bar */}
            <div className="flex items-center gap-2 px-4 py-3.5" style={{ background: '#1a1d2e' }}>
              {isHttps
                ? <Lock size={14} strokeWidth={2} style={{ color: '#4ade80' }} className="shrink-0" />
                : <LockOpen size={14} strokeWidth={2} style={{ color: '#f87171' }} className="shrink-0" />
              }
              <div className="flex items-baseline gap-0 font-mono text-[13px] overflow-x-auto whitespace-nowrap">
                <span style={{ color: '#4a5578' }}>{protocol}://</span>
                <span style={{ color: q.safe ? '#4ade80' : chosen !== null ? '#f87171' : '#E8E6D4', fontWeight: 700 }}>{host}</span>
                <span style={{ color: '#4a5578' }}>{path}</span>
              </div>
            </div>
          </div>

          {/* Verdict */}
          {chosen === null ? (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => pick(true)}
                className="py-5 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{ background: '#16A34A', boxShadow: '0 4px 20px #16A34A44', color: '#fff' }}
              >
                <ShieldCheck size={18} strokeWidth={2} />
                Safe
              </button>
              <button
                onClick={() => pick(false)}
                className="py-5 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{ background: '#DC2626', boxShadow: '0 4px 20px #DC262644', color: '#fff' }}
              >
                <ShieldX size={18} strokeWidth={2} />
                Dangerous
              </button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-xl px-5 py-4 mb-5"
                style={{ background: isCorrect ? '#052e16' : '#450a0a', border: `1px solid ${isCorrect ? '#4ade8030' : '#f8717130'}` }}>
                <p className="font-bold text-[13px] mb-1" style={{ color: isCorrect ? '#4ade80' : '#f87171' }}>
                  {isCorrect ? 'Correct' : 'Wrong'} — This link is {q.safe ? 'SAFE' : 'DANGEROUS'}
                </p>
                <p className="text-[12px]" style={{ color: '#6b7599' }}>{q.hint}</p>
              </div>
              <button onClick={next} className="game-claim-btn">
                {step + 1 < links.length ? 'Next link →' : 'See results →'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
