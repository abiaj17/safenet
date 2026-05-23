import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, X } from 'lucide-react'
import type { GameProps } from '../Game'

const qs = [
  { q: 'What is the first thing to check in a suspicious email?', opts: ["Font size", "The sender's email address", 'Email length', 'Attachment name'], a: 1 },
  { q: 'Which is the safest way to store passwords?', opts: ['Write in a notebook', 'Use the same one everywhere', 'Password manager', 'Your phone notes'], a: 2 },
  { q: 'What should you do after a data breach?', opts: ['Wait and see', 'Change all related passwords immediately', 'Delete your account', "Nothing, it's fine"], a: 1 },
  { q: 'HTTPS protects your data by…', opts: ['Making it faster', 'Encrypting the connection', 'Blocking ads', 'Hiding your IP'], a: 1 },
  { q: 'Which is NOT a sign of a phishing site?', opts: ['Urgent language', 'Official company domain', 'Misspelled URL', 'Requests personal info immediately'], a: 1 },
]

const PERFECT_POWER = 6
const ANSWER_BG = ['#E84545', '#1368CE', '#D89E00', '#26890C']
const ANSWER_LABELS = ['A', 'B', 'C', 'D']

// Court geometry (relative to 360×230 court)
const BALL_START = { x: 52, y: 190 }   // bottom-left (player)
const HOOP_CENTER = { x: 298, y: 62 }  // top-right (hoop opening center)
const DX = HOOP_CENTER.x - BALL_START.x  // 246
const DY = BALL_START.y - HOOP_CENTER.y  // 128 (ball needs to go up this much)

function getTrajectory(power: number, made: boolean) {
  const peakY = -(DY + 60 + Math.abs(power - PERFECT_POWER) * 8) // higher arc = more power difference
  if (made) {
    return {
      x: [0, DX * 0.48, DX],
      y: [0, peakY, -DY],
      scale: [1, 0.82, 0.72],
    }
  } else {
    // Miss: ball either overshoots rim or lands short
    const overshoot = power > PERFECT_POWER
    return {
      x: [0, DX * 0.48, overshoot ? DX + 28 : DX - 36],
      y: [0, peakY, overshoot ? -DY + 24 : -DY + 40],
      scale: [1, 0.82, 0.74],
    }
  }
}

export function BasketballShooter({ onBack, onComplete }: GameProps) {
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState<'question' | 'shoot' | 'result'>('question')
  const [chosen, setChosen] = useState<number | null>(null)
  const [power, setPower] = useState(5)
  const [shooting, setShooting] = useState(false)
  const [scored, setScored] = useState(false)
  const [shotTrajectory, setShotTrajectory] = useState<ReturnType<typeof getTrajectory> | null>(null)
  const [pts, setPts] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [_bd, setBd] = useState<boolean[]>([])
  const [done, setDoneState] = useState(false)

  const q = qs[step]

  const pickAnswer = (i: number) => {
    if (chosen !== null) return
    setChosen(i)
    setBd(b => [...b, i === q.a])
  }

  const nextPhase = () => {
    if (chosen === q.a) setPhase('shoot')
    else {
      if (step + 1 >= qs.length) setDoneState(true)
      else { setStep(s => s + 1); setChosen(null); setPhase('question') }
    }
  }

  const shoot = () => {
    if (shooting) return
    const diff = Math.abs(power - PERFECT_POWER)
    const made = diff === 0 || Math.random() < (0.38 - diff * 0.1)
    const shotPts = made ? (power === PERFECT_POWER ? 30 : 24) : 8
    const traj = getTrajectory(power, made)
    setShotTrajectory(traj)
    setShooting(true)
    setTimeout(() => {
      setScored(made)
      setPts(shotPts)
      setTotalScore(s => s + shotPts)
      setPhase('result')
      setShooting(false)
    }, 950)
  }

  const next = () => {
    if (step + 1 >= qs.length) setDoneState(true)
    else {
      setStep(s => s + 1)
      setChosen(null)
      setPhase('question')
      setPower(5)
      setScored(false)
      setShotTrajectory(null)
    }
  }

  if (done) return (
    <div className="game-screen max-w-xl mx-auto">
      <button onClick={onBack} className="game-back-btn mb-8">← Back to Hub</button>
      <p className="game-label mb-4">Basketball Shooter — Results</p>
      <div className="flex items-baseline gap-3 mb-2">
        <span className="game-score-final">{totalScore}</span>
        <span className="game-score-denom">pts</span>
      </div>
      <p className="game-flavor-text mb-8">
        {totalScore >= 130 ? 'Perfect scorer. Knowledge and accuracy.' : totalScore >= 80 ? 'Solid game. A few missed shots.' : 'Knowledge + aim need work!'}
      </p>
      <button onClick={() => onComplete(Math.min(totalScore, 160))} className="game-claim-btn">
        Claim {Math.min(totalScore, 160)} pts →
      </button>
    </div>
  )

  return (
    <div className="game-screen max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="game-back-btn">← Hub</button>
        <div className="flex items-center gap-4">
          <span className="game-label">{step + 1}/{qs.length}</span>
          <span className="font-bold text-[15px]" style={{ color: '#FB923C' }}>{totalScore} pts</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'question' && (
          <motion.div key="q" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>
            <p className="font-bold text-[13px] mb-5 tracking-wide" style={{ color: '#8890b0' }}>ANSWER CORRECTLY TO SHOOT</p>
            <div className="rounded-2xl px-5 py-4 mb-5" style={{ background: '#141826', border: '1px solid #1e2340' }}>
              <p className="font-bold text-[16px] leading-snug" style={{ color: '#E8E6D4' }}>{q.q}</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              {q.opts.map((opt, i) => {
                const show = chosen !== null
                const isCorrect = i === q.a
                const isChosen = chosen === i
                let opacity = 1
                if (show) {
                  if (isCorrect) opacity = 1
                  else if (isChosen) opacity = 0.4
                  else opacity = 0.3
                }
                return (
                  <button key={i} onClick={() => pickAnswer(i)} disabled={chosen !== null}
                    className="flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-[13px] text-white text-left transition-all active:scale-95"
                    style={{ background: ANSWER_BG[i], opacity, boxShadow: `0 3px 12px ${ANSWER_BG[i]}44`, cursor: chosen !== null ? 'default' : 'pointer' }}>
                    <span className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center text-[11px] shrink-0">{ANSWER_LABELS[i]}</span>
                    <span className="leading-tight">{opt}</span>
                  </button>
                )
              })}
            </div>
            {chosen !== null && (
              <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} onClick={nextPhase} className="game-claim-btn">
                {chosen === q.a ? 'Correct — Take your shot' : 'Wrong — Next question'}
              </motion.button>
            )}
          </motion.div>
        )}

        {phase === 'shoot' && (
          <motion.div key="shoot" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>
            <p className="font-bold text-[13px] mb-3 tracking-wide" style={{ color: '#4ade80' }}>CORRECT — SET POWER AND SHOOT</p>

            {/* Court — side-angle view like GamePigeon */}
            <div
              className="relative w-full rounded-2xl mb-5 overflow-hidden select-none"
              style={{ height: 230, background: '#0e0906' }}
            >
              {/* Bleachers / background gradient */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #1a0f05 0%, #0e0906 60%, #1a1008 100%)' }} />

              {/* Floor */}
              <div className="absolute bottom-0 left-0 right-0" style={{ height: 45, background: '#7c4a1c' }}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="absolute top-0 bottom-0 w-px" style={{ left: `${(i + 1) * 8.33}%`, background: 'rgba(0,0,0,0.12)' }} />
                ))}
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
              </div>

              {/* ── BACKBOARD ── */}
              <div
                className="absolute"
                style={{ right: 28, top: 18, width: 10, height: 54, background: '#d1d5db', borderRadius: 2, boxShadow: '0 0 10px rgba(255,255,255,0.25)' }}
              />
              {/* Backboard inner rectangle (target square) */}
              <div
                className="absolute"
                style={{ right: 30, top: 26, width: 6, height: 22, border: '1.5px solid #FB923C88', background: 'transparent', borderRadius: 1 }}
              />

              {/* ── RIM — rendered as two arcs for 3D effect ── */}
              {/* Back half of rim (rendered behind the ball) */}
              <div
                className="absolute"
                style={{
                  right: 38,
                  top: 57,
                  width: 46,
                  height: 14,
                  borderTop: '3px solid #c2580c',
                  borderLeft: '3px solid #c2580c',
                  borderRight: '3px solid #c2580c',
                  borderBottom: 'none',
                  borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
                }}
              />
              {/* Net */}
              <div
                className="absolute"
                style={{
                  right: 41,
                  top: 70,
                  width: 40,
                  height: 22,
                  borderLeft: '1.5px solid rgba(220,220,220,0.35)',
                  borderRight: '1.5px solid rgba(220,220,220,0.35)',
                  borderBottom: '1.5px solid rgba(220,220,220,0.35)',
                  borderRadius: '0 0 6px 6px',
                }}
              />
              {/* Net inner lines */}
              {[0.33, 0.66].map((x, i) => (
                <div key={i} className="absolute" style={{ right: 41 + 40 * x, top: 70, width: 1, height: 22, background: 'rgba(220,220,220,0.2)' }} />
              ))}
              {/* Net horizontal lines */}
              {[7, 14].map((y, i) => (
                <div key={i} className="absolute" style={{ right: 41, top: 70 + y, width: 40, height: 1, background: 'rgba(220,220,220,0.18)' }} />
              ))}

              {/* ── BALL ── */}
              <motion.div
                style={{
                  position: 'absolute',
                  left: BALL_START.x,
                  top: BALL_START.y,
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, #fb923c, #c2580c)',
                  boxShadow: '0 3px 12px rgba(0,0,0,0.5), inset 0 -2px 4px rgba(0,0,0,0.3)',
                  zIndex: 5,
                }}
                animate={shotTrajectory ? {
                  x: shotTrajectory.x,
                  y: shotTrajectory.y,
                  scale: shotTrajectory.scale,
                } : { x: 0, y: 0, scale: 1 }}
                transition={shotTrajectory ? {
                  duration: 0.92,
                  times: [0, 0.47, 1],
                  x: { ease: 'linear' },
                  y: { ease: 'linear' },
                  scale: { ease: 'linear' },
                } : {}}
              >
                {/* Basketball seam lines */}
                <svg width="30" height="30" viewBox="0 0 30 30" className="absolute inset-0" style={{ borderRadius: '50%', overflow: 'hidden' }}>
                  <path d="M 15 2 Q 8 10, 8 18 Q 8 24, 15 28" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" fill="none" />
                  <path d="M 15 2 Q 22 10, 22 18 Q 22 24, 15 28" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" fill="none" />
                  <path d="M 2 13 Q 10 10, 18 13 Q 24 15, 28 15" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" fill="none" />
                </svg>
              </motion.div>

              {/* Front half of rim (rendered in front of ball) */}
              <div
                className="absolute"
                style={{
                  right: 38,
                  top: 57,
                  width: 46,
                  height: 14,
                  borderBottom: '3px solid #FB923C',
                  borderLeft: '3px solid #e07020',
                  borderRight: '3px solid #e07020',
                  borderTop: 'none',
                  borderRadius: '0 0 50% 50% / 0 0 100% 100%',
                  zIndex: 10,
                  boxShadow: '0 2px 8px rgba(251,146,60,0.3)',
                }}
              />

              {/* Pole */}
              <div className="absolute" style={{ right: 32, top: 72, bottom: 45, width: 4, background: '#555', borderRadius: 2 }} />

              {/* Player silhouette (left side) */}
              <div className="absolute" style={{ left: 38, bottom: 45, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#d1d5db', boxShadow: '0 0 6px rgba(255,255,255,0.2)' }} />
                <div style={{ width: 20, height: 26, background: '#1a5cb5', borderRadius: '4px 4px 0 0' }} />
              </div>
            </div>

            {/* Power slider */}
            <div className="mb-5">
              <div className="flex justify-between mb-2">
                <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: '#8890b0' }}>Power</span>
                <span className="font-bold text-[13px]" style={{ color: power === PERFECT_POWER ? '#4ade80' : '#E8E6D4' }}>
                  {power}/10{power === PERFECT_POWER ? ' — Perfect!' : ''}
                </span>
              </div>
              <input type="range" min={1} max={10} value={power}
                onChange={e => { if (!shooting) setPower(Number(e.target.value)) }}
                className="w-full cursor-pointer"
                style={{ accentColor: '#FB923C' }}
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px]" style={{ color: '#2a3050' }}>Too weak</span>
                <span className="text-[10px]" style={{ color: '#2a3050' }}>Too strong</span>
              </div>
            </div>

            <button
              onClick={shoot}
              disabled={shooting}
              className="game-claim-btn disabled:opacity-40"
              style={{ background: '#FB923C', color: '#0a0b14' }}
            >
              {shooting ? 'In flight...' : 'Shoot!'}
            </button>
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div key="res" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="text-center py-8">
            <div className="flex justify-center mb-4">
              {scored
                ? <Trophy size={52} strokeWidth={1.2} style={{ color: '#fbbf24', filter: 'drop-shadow(0 0 20px #fbbf2466)' }} />
                : <X size={52} strokeWidth={1.5} style={{ color: '#f87171' }} />
              }
            </div>
            <p className="font-bold text-3xl mb-2" style={{ color: '#E8E6D4' }}>{scored ? 'Swish!' : 'Missed'}</p>
            <p className="font-bold text-[15px] mb-8" style={{ color: scored ? '#fbbf24' : '#4a5578' }}>+{pts} pts</p>
            <button onClick={next} className="game-claim-btn">
              {step + 1 < qs.length ? 'Next Question →' : 'See Results →'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
