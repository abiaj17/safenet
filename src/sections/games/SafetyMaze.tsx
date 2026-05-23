import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DoorOpen, HelpCircle, CheckCircle, XCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'
import type { GameProps } from '../Game'

// 0=path, 1=wall, 2=checkpoint, 3=exit
const MAZE = [
  [0, 1, 0, 0, 0, 1],
  [0, 0, 0, 1, 2, 0],
  [1, 0, 1, 0, 1, 0],
  [0, 2, 0, 0, 0, 1],
  [0, 1, 1, 1, 0, 0],
  [0, 0, 0, 2, 0, 3],
]

const CHECKPOINTS: Record<string, { q: string; opts: string[]; a: number }> = {
  '1-4': { q: 'What is the main purpose of a firewall?', opts: ['Speed up internet', 'Block unauthorized access', 'Store passwords', 'Encrypt files'], a: 1 },
  '3-1': { q: 'What does "incognito mode" actually hide?', opts: ['Your activity from websites', 'Your local browsing history only', 'Your IP address', 'Everything you do online'], a: 1 },
  '5-3': { q: 'How often should you update your passwords?', opts: ['Never if strong', 'Every 3-6 months or after a breach', 'Only when forced', 'Every week'], a: 1 },
}

type Pos = { r: number; c: number }

// Colors for the maze visual
const CELL_COLORS = {
  wall:    { bg: '#060810', border: '#0e1225' },
  path:    { bg: '#0c1220', border: '#141e35' },
  visited: { bg: '#0f1a2e', border: '#1a2845' },
  checkpoint: { bg: '#1a1a08', border: '#fbbf2430' },
  checkpointPassed: { bg: '#051a0a', border: '#4ade8030' },
  exit:    { bg: '#041a0a', border: '#4ade8040' },
  player:  { bg: '#0d2060', border: '#3b82f6' },
}

export function SafetyMaze({ onBack, onComplete, onRestart }: GameProps) {
  const [pos, setPos] = useState<Pos>({ r: 0, c: 0 })
  const [visited, setVisited] = useState<string[]>(['0-0'])
  const [checkpoint, setCheckpoint] = useState<string | null>(null)
  const [passed, setPassed] = useState<string[]>([])
  const [chosen, setChosen] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [failed, setFailed] = useState(false)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)

  const move = useCallback((dr: number, dc: number) => {
    if (checkpoint || done) return
    setPos(p => {
      const nr = p.r + dr, nc = p.c + dc
      if (nr < 0 || nr >= 6 || nc < 0 || nc >= 6) return p
      if (MAZE[nr][nc] === 1) return p
      const key = `${nr}-${nc}`
      setVisited(v => v.includes(key) ? v : [...v, key])
      if (MAZE[nr][nc] === 3) { setDone(true); return { r: nr, c: nc } }
      if (MAZE[nr][nc] === 2 && !passed.includes(key)) setCheckpoint(key)
      return { r: nr, c: nc }
    })
  }, [checkpoint, done, passed])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') move(-1, 0)
      if (e.key === 'ArrowDown' || e.key === 's') move(1, 0)
      if (e.key === 'ArrowLeft' || e.key === 'a') move(0, -1)
      if (e.key === 'ArrowRight' || e.key === 'd') move(0, 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [move])

  const pickAnswer = (i: number) => {
    if (chosen !== null || !checkpoint) return
    const q = CHECKPOINTS[checkpoint]
    setChosen(i)
    if (i === q.a) {
      setScore(s => s + 30)
      setPassed(p => [...p, checkpoint])
    } else {
      setFailed(true)
      setLives(l => {
        const next = l - 1
        if (next <= 0) setTimeout(() => setGameOver(true), 1400)
        return next
      })
    }
  }

  const continueAfterAnswer = () => {
    if (failed) {
      setPos({ r: 0, c: 0 })
      setVisited(['0-0'])
      setFailed(false)
    }
    setCheckpoint(null)
    setChosen(null)
  }

  if (gameOver) return (
    <div className="game-screen max-w-md mx-auto text-center">
      <button onClick={onBack} className="game-back-btn mb-8 block text-left">← Back to Hub</button>
      <p className="game-label mb-4">Safety Maze — Game Over</p>
      <div className="flex items-baseline gap-3 mb-2 justify-center">
        <span className="game-score-final" style={{ color: '#f87171' }}>{score}</span>
        <span className="game-score-denom">pts</span>
      </div>
      <p className="game-flavor-text mb-8">No lives left. Study up and try again.</p>
      <div className="flex flex-col gap-3 items-center">
        <button onClick={() => onComplete(score)} className="game-claim-btn">Claim {score} pts →</button>
        {onRestart && <button onClick={onRestart} className="game-back-btn">↺ Try Again</button>}
      </div>
    </div>
  )

  if (done) {
    const bonus = passed.length === Object.keys(CHECKPOINTS).length ? 30 : 0
    const total = score + bonus + 30
    return (
      <div className="game-screen max-w-md mx-auto">
        <button onClick={onBack} className="game-back-btn mb-8">← Back to Hub</button>
        <p className="game-label mb-4">Safety Maze — Results</p>
        <div className="flex items-baseline gap-3 mb-2 justify-center">
          <span className="game-score-final">{Math.min(total, 120)}</span>
          <span className="game-score-denom">/ 120</span>
        </div>
        <p className="game-flavor-text mb-8 text-center">
          You made it out! {bonus > 0 ? 'All checkpoints cleared for bonus.' : 'Some checkpoints missed.'}
        </p>
        <div className="text-center flex flex-col gap-3 items-center">
          <button onClick={() => onComplete(Math.min(total, 120))} className="game-claim-btn">
            Claim {Math.min(total, 120)} pts →
          </button>
          {onRestart && (
            <button onClick={onRestart} className="game-back-btn">↺ Play Again</button>
          )}
        </div>
      </div>
    )
  }

  const currentQ = checkpoint ? CHECKPOINTS[checkpoint] : null

  const dpadBtn = (label: React.ReactNode, dr: number, dc: number) => (
    <button
      onClick={() => move(dr, dc)}
      className="aspect-square rounded-xl flex items-center justify-center transition-all active:scale-90"
      style={{
        background: 'linear-gradient(135deg, #0c1628 0%, #080e1e 100%)',
        border: '1.5px solid #1e2a45',
        color: '#4ADE80',
        boxShadow: 'inset 0 1px 0 rgba(74,222,128,0.06)',
      }}
    >
      {label}
    </button>
  )

  return (
    <div className="game-screen max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="game-back-btn">← Hub</button>
        <div className="flex items-center gap-4">
          <span className="game-label">{passed.length}/{Object.keys(CHECKPOINTS).length} checkpoints</span>
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full transition-all duration-300"
                style={{ background: i < lives ? '#f87171' : '#1e2236', boxShadow: i < lives ? '0 0 6px #f87171' : 'none' }} />
            ))}
          </div>
          <span className="font-black text-[15px]" style={{ color: '#4ADE80', textShadow: '0 0 12px #4ade8055' }}>
            {score} pts
          </span>
        </div>
      </div>

      <p className="text-[11px] mb-4 tracking-widest uppercase font-bold" style={{ color: '#3a4565' }}>
        Navigate to the exit — answer checkpoints to pass
      </p>

      {/* Maze grid */}
      <div
        className="rounded-2xl p-3 mb-5 mx-auto relative overflow-hidden"
        style={{
          maxWidth: 320,
          background: '#06080f',
          border: '1.5px solid #111827',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)',
        }}
      >
        {/* Ambient glow for exit */}
        <div className="absolute pointer-events-none" style={{
          bottom: 0, right: 0, width: 80, height: 80,
          background: 'radial-gradient(circle at 100% 100%, #4ade8018 0%, transparent 70%)',
        }} />

        <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
          {MAZE.map((row, r) => row.map((cell, c) => {
            const isPlayer = pos.r === r && pos.c === c
            const key = `${r}-${c}`
            const isVisited = visited.includes(key)
            const isPassed = passed.includes(key)

            let colors = CELL_COLORS.path
            if (cell === 1) colors = CELL_COLORS.wall
            else if (isPlayer) colors = CELL_COLORS.player
            else if (cell === 3) colors = CELL_COLORS.exit
            else if (cell === 2 && isPassed) colors = CELL_COLORS.checkpointPassed
            else if (cell === 2) colors = CELL_COLORS.checkpoint
            else if (isVisited) colors = CELL_COLORS.visited

            return (
              <motion.div
                key={key}
                className="rounded-lg flex items-center justify-center relative overflow-hidden"
                style={{
                  aspectRatio: '1',
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  boxShadow: isPlayer ? '0 0 16px #3b82f688, 0 0 32px #3b82f633' : 'none',
                }}
                animate={isPlayer ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 0.2 }}
              >
                {/* Wall texture */}
                {cell === 1 && (
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 6px)',
                  }} />
                )}

                {/* Player dot */}
                {isPlayer && (
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ background: '#60a5fa', boxShadow: '0 0 12px #60a5fa, 0 0 24px #3b82f688' }}
                  />
                )}

                {/* Exit */}
                {!isPlayer && cell === 3 && (
                  <div style={{ filter: 'drop-shadow(0 0 6px #4ade8099)' }}>
                    <DoorOpen size={14} strokeWidth={1.5} style={{ color: '#4ade80' }} />
                  </div>
                )}

                {/* Checkpoint */}
                {!isPlayer && cell === 2 && (
                  isPassed
                    ? <CheckCircle size={13} strokeWidth={2} style={{ color: '#4ade80', filter: 'drop-shadow(0 0 4px #4ade8099)' }} />
                    : (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <HelpCircle size={13} strokeWidth={1.5} style={{ color: '#fbbf24', filter: 'drop-shadow(0 0 5px #fbbf2488)' }} />
                      </motion.div>
                    )
                )}

                {/* Visited trail */}
                {!isPlayer && cell === 0 && isVisited && (
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#1e3a60', opacity: 0.6 }} />
                )}
              </motion.div>
            )
          }))}
        </div>
      </div>

      {/* D-pad */}
      <div className="grid gap-2 mx-auto mb-3" style={{
        gridTemplateColumns: 'repeat(3, 52px)',
        gridTemplateRows: 'repeat(3, 52px)',
        width: 172,
      }}>
        <div />
        {dpadBtn(<ArrowUp size={20} strokeWidth={2.5} />, -1, 0)}
        <div />
        {dpadBtn(<ArrowLeft size={20} strokeWidth={2.5} />, 0, -1)}
        {dpadBtn(<ArrowDown size={20} strokeWidth={2.5} />, 1, 0)}
        {dpadBtn(<ArrowRight size={20} strokeWidth={2.5} />, 0, 1)}
      </div>

      <p className="text-center text-[10px] tracking-widest uppercase" style={{ color: '#1e2540' }}>
        Arrow keys or D-pad · Yellow = checkpoint · Green = exit
      </p>

      {/* Checkpoint modal */}
      <AnimatePresence>
        {checkpoint && currentQ && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ scale: 0.88, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.88, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="w-full max-w-sm rounded-2xl p-6 relative overflow-hidden"
              style={{ background: '#0f1422', border: '1.5px solid #fbbf2440' }}
            >
              {/* Glow top */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, #fbbf2460, transparent)' }} />

              <div className="flex items-center gap-2 mb-4">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5 }}>
                  <HelpCircle size={16} strokeWidth={1.5} style={{ color: '#fbbf24' }} />
                </motion.div>
                <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: '#fbbf24' }}>
                  Checkpoint — Answer to pass
                </p>
              </div>

              <p className="font-bold text-[15px] mb-5 leading-snug" style={{ color: '#E8E6D4' }}>
                {currentQ.q}
              </p>

              <div className="space-y-2 mb-5">
                {currentQ.opts.map((opt, i) => {
                  const show = chosen !== null
                  const isCorrect = i === currentQ.a
                  const isChosen = chosen === i
                  let bg = '#141e30', borderColor = '#1e2a45', color = '#6b7599'
                  if (show && isCorrect) { bg = '#051a0a'; borderColor = '#4ade8055'; color = '#4ade80' }
                  else if (show && isChosen && !isCorrect) { bg = '#1a0505'; borderColor = '#f8717155'; color = '#f87171' }
                  return (
                    <motion.button
                      key={i}
                      onClick={() => pickAnswer(i)}
                      whileTap={chosen === null ? { scale: 0.98 } : {}}
                      className="w-full text-left px-4 py-3 rounded-xl text-[13px] font-medium transition-all"
                      style={{ background: bg, border: `1px solid ${borderColor}`, color, cursor: chosen !== null ? 'default' : 'pointer' }}
                    >
                      <span className="font-bold mr-2" style={{ color: chosen !== null && isCorrect ? '#4ade80' : '#3a4565' }}>
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {opt}
                    </motion.button>
                  )
                })}
              </div>

              {chosen !== null && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center gap-2 mb-4">
                    {failed
                      ? <XCircle size={16} strokeWidth={1.5} style={{ color: '#f87171' }} />
                      : <CheckCircle size={16} strokeWidth={1.5} style={{ color: '#4ade80' }} />
                    }
                    <p className="text-[13px] font-bold" style={{ color: failed ? '#f87171' : '#4ade80' }}>
                      {failed
                        ? `Wrong — lost a life. ${lives > 0 ? `${lives} left. Back to start.` : 'No lives left!'}`
                        : 'Correct! +30 pts. Path cleared.'}
                    </p>
                  </div>
                  <button onClick={continueAfterAnswer} className="game-claim-btn w-full text-center">
                    {failed ? 'Back to Start' : 'Continue →'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
