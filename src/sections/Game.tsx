import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Grid2x2, ShieldAlert, Zap, Target, Crown, Map,
  Search, LockKeyhole, Smartphone, Link, ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { GradientBackground } from '../components/ui/noisy-gradient-backgrounds'
import { ScamSpotter } from './games/ScamSpotter'
import { SocialMediaSafety } from './games/SocialMediaSafety'
import { LinkDetective } from './games/LinkDetective'
import { PrivacyProtector } from './games/PrivacyProtector'
import { PasswordHero } from './games/PasswordHero'
import { SpeedTrivia } from './games/SpeedTrivia'
import { TileMatch } from './games/TileMatch'
import { PhishingDodge } from './games/PhishingDodge'
import { BasketballShooter } from './games/BasketballShooter'
import { ChessChallenge } from './games/ChessChallenge'
import { SafetyMaze } from './games/SafetyMaze'

export interface GameProps {
  onBack: () => void
  onComplete: (pts: number) => void
  onRestart?: () => void
}

interface GameDef {
  id: string
  Icon: LucideIcon
  name: string
  tagline: string
  pts: number
  accent: string
  artBg: string
}

const GAMES: GameDef[] = [
  { id: 'tile-match',     Icon: Grid2x2,    name: 'Security Tile Match', tagline: 'Match symbols before time runs out',         pts: 140, accent: '#F59E0B', artBg: '#292017' },
  { id: 'phishing-dodge', Icon: ShieldAlert, name: 'Phishing Dodge',     tagline: 'Dodge threats, collect shields, survive',    pts: 150, accent: '#F87171', artBg: '#2a1212' },
  { id: 'speed-trivia',   Icon: Zap,         name: 'Speed Trivia',       tagline: 'Answer fast — every second counts',         pts: 160, accent: '#A78BFA', artBg: '#1e1630' },
  { id: 'basketball',     Icon: Target,      name: 'Basketball Shooter', tagline: 'Answer right then take your shot',          pts: 160, accent: '#FB923C', artBg: '#291a0f' },
  { id: 'chess',          Icon: Crown,       name: 'Chess Challenge',    tagline: 'Knowledge earns your moves on the board',   pts: 180, accent: '#22D3EE', artBg: '#0c2030' },
  { id: 'maze',           Icon: Map,         name: 'Safety Maze',        tagline: 'Navigate to the exit, beat the challenges', pts: 120, accent: '#4ADE80', artBg: '#0d2015' },
  { id: 'scam-spotter',   Icon: Search,      name: 'Scam Spotter',       tagline: 'Real message or total scam? You decide',    pts: 130, accent: '#FBBF24', artBg: '#27200d' },
  { id: 'password-hero',  Icon: LockKeyhole, name: 'Password Hero',      tagline: 'Build the strongest password possible',     pts: 100, accent: '#60A5FA', artBg: '#0e1d30' },
  { id: 'social-media',   Icon: Smartphone,  name: 'Social Media Safety',tagline: 'What to share, what to keep private',      pts: 110, accent: '#F472B6', artBg: '#27101e' },
  { id: 'link-detective', Icon: Link,        name: 'Link Detective',     tagline: 'Spot the dangerous URL before you click',  pts: 130, accent: '#FDE047', artBg: '#25200a' },
  { id: 'privacy',        Icon: ShieldCheck, name: 'Privacy Protector',  tagline: 'Guard your info from cyber criminals',      pts: 140, accent: '#C084FC', artBg: '#1a1030' },
]

const COMPONENTS: Record<string, React.FC<GameProps>> = {
  'tile-match': TileMatch,
  'phishing-dodge': PhishingDodge,
  'speed-trivia': SpeedTrivia,
  basketball: BasketballShooter,
  chess: ChessChallenge,
  maze: SafetyMaze,
  'scam-spotter': ScamSpotter,
  'password-hero': PasswordHero,
  'social-media': SocialMediaSafety,
  'link-detective': LinkDetective,
  privacy: PrivacyProtector,
}

const STORAGE_KEY = 'thesafenet-scores-v1'

export function Game() {
  const [active, setActive] = useState<string | null>(null)
  const [activeKey, setActiveKey] = useState(0)
  const [earned, setEarned] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
  })
  const total = Object.values(earned).reduce((a, b) => a + b, 0)
  const ActiveComp = active ? COMPONENTS[active] : null

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(earned)) } catch {}
  }, [earned])

  const complete = (pts: number) => {
    if (active) setEarned(p => ({ ...p, [active]: Math.max(p[active] ?? 0, pts) }))
    setActive(null)
  }

  const restart = () => setActiveKey(k => k + 1)

  const completedCount = Object.keys(earned).length

  return (
    <section className="h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)] p-4 md:p-6 bg-black">
      {/* Outer wrapper: fixed height, clips rounded corners, positions bg */}
      <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden">
        <GradientBackground
          customGradient="radial-gradient(ellipse 200% 160% at 10% 0%, rgba(10,30,110,1) 0%, rgba(5,15,55,1) 40%, rgba(4,8,26,1) 75%, rgba(2,4,14,1) 100%)"
          noisePatternAlpha={40}
          noiseIntensity={0.9}
        />
        {/* Scrollable content layer */}
        <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          {!active ? (
            <motion.div
              key="hub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="pb-16"
            >
              {/* Hub header */}
              <div className="px-6 sm:px-10 md:px-14 pt-8 pb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="game-label mb-2">Games Hub</p>
                  <h2 className="game-hub-title">Pick a game</h2>
                  {completedCount > 0 && (
                    <p className="text-[12px] mt-1" style={{ color: '#4ade8088' }}>
                      {completedCount}/{GAMES.length} completed
                    </p>
                  )}
                </div>
                {total > 0 && (
                  <div className="text-right shrink-0">
                    <p className="game-label mb-1">Total score</p>
                    <p className="game-score-big">{total.toLocaleString()}</p>
                  </div>
                )}
              </div>

              {/* Game grid */}
              <div className="px-6 sm:px-10 md:px-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {GAMES.map((g, idx) => {
                  const best = earned[g.id]
                  const done = best !== undefined
                  return (
                    <motion.div
                      key={g.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.035, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      onClick={() => setActive(g.id)}
                      className="game-card group cursor-pointer flex flex-col rounded-2xl overflow-hidden"
                      style={{ border: `1px solid ${g.accent}18` }}
                    >
                      {/* Art area */}
                      <div
                        className="relative flex items-center justify-center overflow-hidden"
                        style={{ height: 110, background: g.artBg }}
                      >
                        {/* Radial glow from top */}
                        <div className="absolute inset-0 pointer-events-none" style={{
                          background: `radial-gradient(ellipse 130% 90% at 50% -10%, ${g.accent}28 0%, transparent 70%)`,
                        }} />
                        {/* Fine dot grid for depth */}
                        <div className="absolute inset-0 pointer-events-none" style={{
                          backgroundImage: `radial-gradient(circle, ${g.accent}18 1px, transparent 1px)`,
                          backgroundSize: '18px 18px',
                        }} />
                        {/* Scanline overlay */}
                        <div className="absolute inset-0 pointer-events-none" style={{
                          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 3px)',
                        }} />
                        {/* Shimmer on hover */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div style={{
                            position: 'absolute', top: 0, bottom: 0, width: '40%',
                            background: `linear-gradient(90deg, transparent, ${g.accent}18, transparent)`,
                            animation: 'cardShimmer 0.8s ease forwards',
                          }} />
                        </div>
                        {/* Glow orb behind icon */}
                        <div className="absolute pointer-events-none" style={{
                          width: 72, height: 72,
                          borderRadius: '50%',
                          background: `radial-gradient(circle, ${g.accent}28 0%, transparent 70%)`,
                          animation: 'pulseGlow 2.5s ease-in-out infinite',
                          animationDelay: `${idx * 0.2}s`,
                        }} />
                        <g.Icon
                          size={46}
                          strokeWidth={1.3}
                          className="relative transition-all duration-300 group-hover:scale-115 group-active:scale-95"
                          style={{
                            color: g.accent,
                            filter: `drop-shadow(0 0 12px ${g.accent}99) drop-shadow(0 0 28px ${g.accent}44)`,
                          }}
                        />
                        {done && (
                          <div
                            className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                            style={{ background: g.accent, color: '#0a0b14', boxShadow: `0 0 10px ${g.accent}88` }}
                          >
                            ✓
                          </div>
                        )}
                        {/* Fade into card body */}
                        <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none" style={{
                          background: `linear-gradient(to top, #141520, transparent)`,
                        }} />
                        {/* Bottom accent line */}
                        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${g.accent}40, transparent)` }} />
                      </div>

                      {/* Info */}
                      <div className="px-3.5 pt-3 pb-3.5 flex flex-col flex-1">
                        <p className="font-bold text-[13px] leading-tight mb-1" style={{ color: '#E8E6D4' }}>
                          {g.name}
                        </p>
                        <p className="text-[11px] leading-relaxed flex-1 mb-3" style={{ color: '#4a5578' }}>
                          {g.tagline}
                        </p>
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="text-[9px] font-bold tracking-wider px-2 py-1 rounded-full"
                            style={{
                              background: done ? `${g.accent}18` : '#1e2236',
                              color: done ? g.accent : '#3a4060',
                              border: done ? `1px solid ${g.accent}30` : '1px solid #1e2236',
                            }}
                          >
                            {done ? `${best} pts` : `up to ${g.pts}`}
                          </span>
                          <button
                            className="text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all duration-200 group-hover:brightness-115 group-active:scale-95 shrink-0"
                            style={{ background: g.accent, color: '#0a0b14', boxShadow: `0 2px 10px ${g.accent}44` }}
                          >
                            {done ? 'Again' : 'Play'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}

                {/* Coming soon tile */}
                <div
                  className="rounded-2xl flex flex-col items-center justify-center text-center min-h-[160px] gap-3 overflow-hidden relative"
                  style={{ background: '#0a0c16', border: '1px dashed #1e2236' }}
                >
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle, #1e224010 1px, transparent 1px)',
                    backgroundSize: '14px 14px',
                  }} />
                  <Target size={24} strokeWidth={1.2} style={{ color: '#1e2540', position: 'relative' }} />
                  <p className="text-[9px] tracking-widest uppercase" style={{ color: '#1e2540', position: 'relative' }}>
                    Coming soon
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {ActiveComp && <ActiveComp key={`${active}-${activeKey}`} onBack={() => setActive(null)} onComplete={complete} onRestart={restart} />}
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
