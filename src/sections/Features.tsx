import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { GradientBackground } from '../components/ui/noisy-gradient-backgrounds'
import { SectionTrail } from '../components/ui/SectionTrail'
import { ShieldWatermark } from '../components/ui/ShieldWatermark'

const SECTION_COLORS = [
  { color: 'rgba(5,12,8,1)', stop: '0%' },
  { color: 'rgba(8,22,14,1)', stop: '30%' },
  { color: 'rgba(10,40,24,1)', stop: '60%' },
  { color: 'rgba(14,56,34,1)', stop: '85%' },
  { color: 'rgba(18,72,44,1)', stop: '100%' },
]

const threats = [
  { num: '01', title: 'Stolen Accounts', desc: "Phishing links and weak passwords make it easier than you'd think to lose access to something important." },
  { num: '02', title: 'Leaked Private Info', desc: "Photos, conversations, personal details. Once it's out, it's out. Knowing where the risk is helps you avoid it." },
  { num: '03', title: 'Financial Scams', desc: "Fake giveaways, gift card requests, offers that are too good to be true. They work because they're designed to." },
  { num: '04', title: 'Damaged Reputation', desc: "A post that shows up years later when you really don't want it to. Screenshots exist forever." },
]

export function Features() {
  const headRef = useRef<HTMLHeadingElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const isHeadInView = useInView(headRef, { once: true, margin: '-60px' })
  const isGridInView = useInView(gridRef, { once: true, margin: '-60px' })

  return (
    <section className="h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)] p-4 md:p-6 bg-black">
      <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-y-auto overflow-x-hidden">
        <GradientBackground gradientOrigin="top-right" gradientSize="160% 160%" colors={SECTION_COLORS} noiseIntensity={0.51} noisePatternSize={100} noisePatternRefreshInterval={8} />
        <SectionTrail gridSize={32} color="#DEDBC8" decay={0.92} />
        <ShieldWatermark className="top-[-10%] left-[-5%]" size="46vw" opacity={0.03} />

        {/* Watermark */}
        <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden flex items-center justify-start pl-6">
          <span className="font-display font-bold leading-none select-none" style={{ fontSize: 'clamp(100px, 20vw, 260px)', color: 'rgba(255,255,255,0.025)' }}>RISKS</span>
        </div>

        {/* Section counter */}
        <div className="absolute top-6 right-8 z-[3] pointer-events-none">
          <span className="text-white/10 text-[10px] tracking-[0.25em] uppercase">02 / 05</span>
        </div>

        <div className="relative z-10 py-6 sm:py-8 px-8 sm:px-14 md:px-20 min-h-full flex flex-col justify-center">
          <p className="text-blue-300/40 text-[10px] tracking-[0.3em] uppercase mb-4">Why this matters</p>

          <motion.h2
            ref={headRef}
            className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl leading-[1.1] mb-3"
            style={{ color: '#E1E0CC' }}
            initial={{ opacity: 0, y: 24 }}
            animate={isHeadInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            Most threats aren't obvious. That's the problem.
          </motion.h2>

          <motion.p
            className="text-blue-100/40 text-sm leading-relaxed max-w-lg mb-8"
            initial={{ opacity: 0 }}
            animate={isHeadInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            They're not some cartoon villain. They're a convincing DM, a too-good-to-be-true giveaway, a quiz that quietly scoops up your info.
          </motion.p>

          <div ref={gridRef} className="grid grid-cols-2 gap-3">
            {threats.map((item, i) => (
              <motion.div
                key={i}
                className="relative group bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.07] hover:border-white/[0.14] rounded-xl p-4 sm:p-5 overflow-hidden cursor-default transition-all duration-300"
                initial={{ opacity: 0, y: 16 }}
                animate={isGridInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="absolute -bottom-3 -right-1 font-display font-bold leading-none text-white/[0.05] group-hover:text-white/[0.09] select-none transition-colors duration-300" style={{ fontSize: 'clamp(52px, 7vw, 80px)' }}>{item.num}</span>
                <h3 className="font-display text-base sm:text-lg mb-2 group-hover:text-white transition-colors duration-300" style={{ color: '#DEDBC8' }}>{item.title}</h3>
                <p className="text-blue-100/40 text-xs sm:text-sm leading-relaxed group-hover:text-blue-100/60 transition-colors duration-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
