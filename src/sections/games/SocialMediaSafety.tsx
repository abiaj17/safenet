import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserRound, Globe, ThumbsUp, ThumbsDown, MessageCircle, Share2, Bookmark, Heart } from 'lucide-react'
import type { GameProps } from '../Game'

const posts = [
  { post: "Just arrived at LAX! 2 weeks in Europe starting now! House all empty. Can't wait!", safe: false, hint: "Announcing you're away with dates tells burglars your home is empty.", likes: 47, comments: 12 },
  { post: 'Finally finished my homework. Coffee time.', safe: true, hint: 'Generic relatable content with no personal details is fine.', likes: 203, comments: 8 },
  { post: "My school's address is 4721 Oak Street. Come visit the art show Friday 6pm!", safe: false, hint: "Posting your school's exact address publicly isn't necessary and can be misused.", likes: 31, comments: 5 },
  { post: 'Just discovered this amazing hiking trail near me. Views are insane!', safe: true, hint: 'Vague location references without a pinned address are generally safe.', likes: 892, comments: 64 },
  { post: 'Got my new ID card! Here\'s the photo [shows full name, DOB, ID number]', safe: false, hint: 'ID documents contain personal info that enables identity theft.', likes: 12, comments: 3 },
  { post: 'Had the best day at the mall with my friends!', safe: true, hint: 'General activity posts without personal info are fine.', likes: 156, comments: 22 },
  { post: 'Here\'s my daily routine: leave home 7:30am, school ends 3pm, usually home alone until 6pm', safe: false, hint: 'Predictable schedules + "home alone" creates safety risks.', likes: 9, comments: 2 },
  { post: 'Just read an amazing book about cybersecurity. Highly recommend!', safe: true, hint: 'Sharing interests and recommendations is normal and safe.', likes: 344, comments: 18 },
]

const AVATAR_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#84cc16']

export function SocialMediaSafety({ onBack, onComplete }: GameProps) {
  const [step, setStep] = useState(0)
  const [chosen, setChosen] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [bd, setBd] = useState<boolean[]>([])

  const q = posts[step]
  const avatarColor = AVATAR_COLORS[step % AVATAR_COLORS.length]

  const pick = (val: boolean) => {
    if (chosen !== null) return
    const correct = val === q.safe
    setChosen(val)
    if (correct) setScore(s => s + 13)
    setBd(b => [...b, correct])
  }

  const next = () => {
    if (step + 1 >= posts.length) setDone(true)
    else { setStep(s => s + 1); setChosen(null) }
  }

  if (done) return (
    <div className="game-screen max-w-xl mx-auto">
      <button onClick={onBack} className="game-back-btn mb-8">← Back to Hub</button>
      <p className="game-label mb-4">Social Media Safety — Results</p>
      <div className="flex items-baseline gap-3 mb-2">
        <span className="game-score-final">{score}</span>
        <span className="game-score-denom">/ {posts.length * 13} pts</span>
      </div>
      <p className="game-flavor-text mb-8">
        {score >= 88 ? 'You post smart. Your feed is safe.' : score >= 50 ? 'Good awareness with a few blind spots.' : 'Online oversharing is common — now you know where the lines are.'}
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
          <span className="game-label">{step + 1}/{posts.length}</span>
          <span className="font-bold text-[15px]" style={{ color: '#F472B6' }}>{score} pts</span>
        </div>
      </div>

      <div className="flex gap-1.5 mb-6">
        {posts.map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-500"
            style={{ background: i < step ? (bd[i] ? '#4ade80' : '#f87171') : i === step ? '#F472B6' : '#1e2236' }} />
        ))}
      </div>

      <p className="font-bold text-[13px] mb-5 tracking-wide" style={{ color: '#8890b0' }}>
        SAFE TO POST PUBLICLY?
      </p>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>

          {/* Instagram-style post */}
          <div className="rounded-2xl mb-6 overflow-hidden" style={{ background: '#0f0f0f', border: '1px solid #262626' }}>
            {/* Post header */}
            <div className="flex items-center justify-between px-3 py-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0" style={{ background: avatarColor }}>
                  <UserRound size={16} strokeWidth={1.5} style={{ color: '#fff' }} />
                </div>
                <div>
                  <p className="font-bold text-[13px]" style={{ color: '#E8E6D4' }}>you</p>
                  <div className="flex items-center gap-1">
                    <Globe size={9} strokeWidth={1.5} style={{ color: '#8e8e8e' }} />
                    <p className="text-[10px]" style={{ color: '#8e8e8e' }}>Public · 1m</p>
                  </div>
                </div>
              </div>
              <span className="text-[18px] font-bold" style={{ color: '#8e8e8e', letterSpacing: '0.05em' }}>···</span>
            </div>

            {/* Post content */}
            <div className="px-3 pb-3 relative">
              <p className="text-[14px] leading-relaxed" style={{ color: '#E8E6D4' }}>
                <span className="font-bold" style={{ color: '#E8E6D4' }}>you </span>
                {q.post}
              </p>
            </div>

            {/* Action bar */}
            <div className="px-3 py-2 flex items-center justify-between" style={{ borderTop: '1px solid #1a1a1a' }}>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Heart size={16} strokeWidth={1.5} style={{ color: '#8e8e8e' }} />
                  <span className="text-[12px]" style={{ color: '#8e8e8e' }}>{q.likes.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle size={16} strokeWidth={1.5} style={{ color: '#8e8e8e' }} />
                  <span className="text-[12px]" style={{ color: '#8e8e8e' }}>{q.comments}</span>
                </div>
                <Share2 size={16} strokeWidth={1.5} style={{ color: '#8e8e8e' }} />
              </div>
              <Bookmark size={16} strokeWidth={1.5} style={{ color: '#8e8e8e' }} />
            </div>

            {/* Reveal overlay */}
            <AnimatePresence>
              {chosen !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-2xl flex items-center justify-center pointer-events-none"
                  style={{ background: isCorrect ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)' }}
                >
                  {isCorrect
                    ? <ThumbsUp size={40} strokeWidth={1.5} style={{ color: '#4ade80', filter: 'drop-shadow(0 0 16px #4ade8088)' }} />
                    : <ThumbsDown size={40} strokeWidth={1.5} style={{ color: '#f87171', filter: 'drop-shadow(0 0 16px #f8717188)' }} />
                  }
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Verdict buttons */}
          {chosen === null ? (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => pick(true)}
                className="py-5 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{ background: '#16A34A', boxShadow: '0 4px 20px #16A34A44', color: '#fff' }}
              >
                <ThumbsUp size={18} strokeWidth={2} />
                Safe to Post
              </button>
              <button
                onClick={() => pick(false)}
                className="py-5 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{ background: '#DC2626', boxShadow: '0 4px 20px #DC262644', color: '#fff' }}
              >
                <ThumbsDown size={18} strokeWidth={2} />
                Don't Post
              </button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-xl px-5 py-4 mb-5"
                style={{ background: isCorrect ? '#052e16' : '#450a0a', border: `1px solid ${isCorrect ? '#4ade8030' : '#f8717130'}` }}>
                <p className="font-bold text-[13px] mb-1" style={{ color: isCorrect ? '#4ade80' : '#f87171' }}>
                  {isCorrect ? 'Correct' : 'Wrong'} — This post is {q.safe ? 'SAFE' : 'RISKY'}
                </p>
                <p className="text-[12px]" style={{ color: '#6b7599' }}>{q.hint}</p>
              </div>
              <button onClick={next} className="game-claim-btn">
                {step + 1 < posts.length ? 'Next post →' : 'See results →'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
