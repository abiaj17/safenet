import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { GradientBackground } from '../components/ui/noisy-gradient-backgrounds'
import { SectionTrail } from '../components/ui/SectionTrail'
import { ShieldWatermark } from '../components/ui/ShieldWatermark'

const SECTION_COLORS = [
  { color: 'rgba(4,12,14,1)', stop: '0%' },
  { color: 'rgba(6,22,28,1)', stop: '30%' },
  { color: 'rgba(8,36,46,1)', stop: '60%' },
  { color: 'rgba(10,50,64,1)', stop: '85%' },
  { color: 'rgba(12,64,80,1)', stop: '100%' },
]

const steps = [
  { num: '01', title: 'Follow us', desc: "Our content is designed to be shareable and actually worth reading. It won't clutter your feed.", link: { href: 'https://www.instagram.com/the_safe_net/', label: '@the_safe_net' } },
  { num: '02', title: 'Send it to a friend', desc: "If you know someone who could use this, send them the link. That's the whole ask.", link: null },
  { num: '03', title: 'Bring it up at school', desc: "In a club, student org, or group chat? Mention us. The more people who know, the better.", link: null },
]

export function HowToHelp() {
  const headRef = useRef<HTMLHeadingElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const isHeadInView = useInView(headRef, { once: true, margin: '-60px' })
  const isListInView = useInView(listRef, { once: true, margin: '-60px' })

  return (
    <section className="h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)] p-4 md:p-6 bg-black">
      <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-y-auto overflow-x-hidden">
        <GradientBackground gradientOrigin="top-left" gradientSize="160% 160%" colors={SECTION_COLORS} noiseIntensity={0.51} noisePatternSize={100} noisePatternRefreshInterval={8} />
        <SectionTrail gridSize={32} color="#DEDBC8" decay={0.92} />
        <ShieldWatermark className="bottom-[-12%] left-[-4%]" size="50vw" opacity={0.03} />

        {/* Watermark */}
        <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden flex items-center justify-start pl-6">
          <span className="font-display font-bold leading-none select-none" style={{ fontSize: 'clamp(120px, 22vw, 300px)', color: 'rgba(255,255,255,0.025)' }}>HELP</span>
        </div>

        {/* Section counter */}
        <div className="absolute top-6 right-8 z-[3] pointer-events-none">
          <span className="text-white/10 text-[10px] tracking-[0.25em] uppercase">04 / 05</span>
        </div>

        <div className="relative z-10 py-6 sm:py-8 px-8 sm:px-14 md:px-20 min-h-full flex flex-col justify-center">

          <div className="mb-6 sm:mb-8">
            <p className="text-blue-300/40 text-[10px] tracking-[0.3em] uppercase mb-4">How you can help</p>
            <motion.h2
              ref={headRef}
              className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl leading-[1.1]"
              style={{ color: '#E1E0CC' }}
              initial={{ opacity: 0, y: 24 }}
              animate={isHeadInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              You don't have to do anything big.
            </motion.h2>
          </div>

          <div ref={listRef}>
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="group flex items-center gap-6 sm:gap-10 py-5 sm:py-7 border-t border-white/[0.07] cursor-default"
                initial={{ opacity: 0, y: 20 }}
                animate={isListInView ? { opacity: 1, y: 0 } : {}}
                whileHover={{ x: 6 }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <span
                  className="font-display font-bold leading-none text-white/[0.07] group-hover:text-white/[0.18] select-none shrink-0 transition-colors duration-300"
                  style={{ fontSize: 'clamp(44px, 7vw, 88px)', width: '10vw', minWidth: '52px', textAlign: 'right' }}
                >
                  {step.num}
                </span>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-display text-xl sm:text-2xl md:text-3xl mb-1.5 group-hover:text-white transition-colors duration-300 leading-tight"
                    style={{ color: '#DEDBC8' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-blue-100/40 text-sm leading-relaxed group-hover:text-blue-100/60 transition-colors duration-300">{step.desc}</p>
                  {step.link && (
                    <a
                      href={step.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary/50 hover:text-primary text-xs font-medium transition-colors mt-2"
                    >
                      {step.link.label}
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
            <div className="border-t border-white/[0.07]" />
          </div>

        </div>
      </div>
    </section>
  )
}
