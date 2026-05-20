import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { GradientBackground } from '../components/ui/noisy-gradient-backgrounds'
import { SectionTrail } from '../components/ui/SectionTrail'
import { ShieldWatermark } from '../components/ui/ShieldWatermark'

const SECTION_COLORS = [
  { color: 'rgba(5,6,18,1)', stop: '0%' },
  { color: 'rgba(10,13,40,1)', stop: '30%' },
  { color: 'rgba(16,22,68,1)', stop: '60%' },
  { color: 'rgba(24,34,95,1)', stop: '85%' },
  { color: 'rgba(32,48,118,1)', stop: '100%' },
]

export function About() {
  const headRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  const isHeadInView = useInView(headRef, { once: true, margin: '-60px' })
  const isBodyInView = useInView(bodyRef, { once: true, margin: '-60px' })

  return (
    <section className="h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)] p-4 md:p-6 bg-black">
      <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-y-auto overflow-x-hidden">
        <GradientBackground
          gradientOrigin="bottom-middle"
          gradientSize="160% 160%"
          colors={SECTION_COLORS}
          noiseIntensity={0.51}
          noisePatternSize={100}
          noisePatternRefreshInterval={8}
        />
        <SectionTrail gridSize={32} color="#DEDBC8" decay={0.92} />

        <ShieldWatermark className="bottom-[-8%] right-[-6%]" size="52vw" opacity={0.03} />

        {/* Watermark */}
        <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden flex items-center justify-end pr-8">
          <span className="font-display font-bold leading-none select-none" style={{ fontSize: 'clamp(120px, 22vw, 280px)', color: 'rgba(255,255,255,0.025)' }}>WHO</span>
        </div>

        {/* Section counter */}
        <div className="absolute top-6 right-8 z-[3] pointer-events-none">
          <span className="text-white/10 text-[10px] tracking-[0.25em] uppercase">01 / 05</span>
        </div>

        <div className="relative z-10 min-h-full flex flex-col justify-center py-10 sm:py-12 px-8 sm:px-14 md:px-20">
          <div className="max-w-6xl mx-auto w-full">

            <p className="text-blue-300/40 text-[10px] tracking-[0.3em] uppercase mb-8">Who we are</p>

            <motion.h2
              ref={headRef}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-12 md:mb-16 max-w-4xl"
              style={{ color: '#E1E0CC' }}
              initial={{ opacity: 0, y: 24 }}
              animate={isHeadInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              We're high schoolers who actually use the internet the way you do.
            </motion.h2>

            <motion.div
              ref={bodyRef}
              initial={{ opacity: 0, y: 20 }}
              animate={isBodyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-base sm:text-lg leading-relaxed text-blue-100/50 max-w-2xl mb-16">
                We're on the same apps, in the same group chats, dealing with the same internet you are. The Safe Net exists because most online safety content feels like it was made by people who last used the internet in 2009. We wanted something different: honest, useful, and written for the people who actually need it.
              </p>

              <div className="flex flex-wrap gap-x-16 gap-y-8 border-t border-white/[0.07] pt-10">
                {[
                  { val: '100%', label: 'Student-run' },
                  { val: 'Free', label: 'Always will be' },
                  { val: 'Gen Z', label: 'Written by, for' },
                  { val: '2024', label: 'Founded' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-3xl sm:text-4xl mb-1" style={{ color: '#E1E0CC' }}>{s.val}</p>
                    <p className="text-blue-100/30 text-xs tracking-widest uppercase">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}
