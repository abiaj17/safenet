import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { GradientBackground } from '../components/ui/noisy-gradient-backgrounds'
import { SectionTrail } from '../components/ui/SectionTrail'
import { ShieldWatermark } from '../components/ui/ShieldWatermark'

const SECTION_COLORS = [
  { color: 'rgba(14,5,6,1)', stop: '0%' },
  { color: 'rgba(30,8,12,1)', stop: '30%' },
  { color: 'rgba(55,10,18,1)', stop: '60%' },
  { color: 'rgba(80,14,24,1)', stop: '85%' },
  { color: 'rgba(100,18,30,1)', stop: '100%' },
]

export function Closing() {
  const headRef = useRef<HTMLHeadingElement>(null)
  const isHeadInView = useInView(headRef, { once: true, margin: '-60px' })
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 })

  const handleBtnMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setBtnOffset({
      x: (e.clientX - rect.left - rect.width / 2) * 0.25,
      y: (e.clientY - rect.top - rect.height / 2) * 0.25,
    })
  }

  return (
    <section className="h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)] p-4 md:p-6 bg-black">
      <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-y-auto overflow-x-hidden">
        <GradientBackground gradientOrigin="bottom-middle" gradientSize="160% 160%" colors={SECTION_COLORS} noiseIntensity={0.51} noisePatternSize={100} noisePatternRefreshInterval={8} />
        <SectionTrail gridSize={32} color="#DEDBC8" decay={0.92} />

        <ShieldWatermark className="top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2" size="55vw" opacity={0.025} />

        {/* Watermark */}
        <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden flex items-end pb-8 justify-center">
          <span className="font-display font-bold leading-none select-none" style={{ fontSize: 'clamp(80px, 18vw, 240px)', color: 'rgba(255,255,255,0.025)' }}>CARE</span>
        </div>

        {/* Section counter */}
        <div className="absolute top-6 right-8 z-[3] pointer-events-none">
          <span className="text-white/10 text-[10px] tracking-[0.25em] uppercase">05 / 05</span>
        </div>

        <div className="relative z-10 pt-20 pb-10 sm:pt-24 sm:pb-12 px-8 sm:px-14 md:px-20 min-h-full flex flex-col items-center justify-center text-center max-w-3xl mx-auto w-full" style={{ marginTop: '6vh' }}>

          <motion.h2
            ref={headRef}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-4"
            style={{ color: '#E1E0CC' }}
            initial={{ opacity: 0, y: 24 }}
            animate={isHeadInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            You can't control everything online.
          </motion.h2>

          <motion.h2
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-12"
            style={{ color: 'rgba(222,219,200,0.3)' }}
            initial={{ opacity: 0, y: 24 }}
            animate={isHeadInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            But knowing the risks is most of the battle.
          </motion.h2>

          <motion.p
            className="text-blue-100/40 text-sm sm:text-base mb-10 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isHeadInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            Start with one thing. Build from there.
          </motion.p>

          <motion.a
            href="https://www.instagram.com/the_safe_net/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 bg-primary rounded-full pl-6 pr-1 py-1 font-medium text-sm sm:text-base text-black w-fit"
            initial={{ opacity: 0, y: 12 }}
            animate={isHeadInView ? { opacity: 1, y: 0 } : {}}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onMouseMove={handleBtnMove}
            onMouseLeave={() => setBtnOffset({ x: 0, y: 0 })}
            style={{ x: btnOffset.x, y: btnOffset.y }}
          >
            Start Here
            <span className="bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center group-hover:rotate-45 transition-transform duration-300 shrink-0">
              <ArrowRight className="w-4 h-4" style={{ color: '#E1E0CC' }} />
            </span>
          </motion.a>

          <motion.p
            className="text-white/20 text-xs mt-6"
            initial={{ opacity: 0 }}
            animate={isHeadInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Click with care, show you're aware.
          </motion.p>

        </div>
      </div>
    </section>
  )
}
