import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { GradientBackground } from '../components/ui/noisy-gradient-backgrounds'
import { SectionTrail } from '../components/ui/SectionTrail'
import { ShieldWatermark } from '../components/ui/ShieldWatermark'

const SECTION_COLORS = [
  { color: 'rgba(10,5,18,1)', stop: '0%' },
  { color: 'rgba(22,10,40,1)', stop: '30%' },
  { color: 'rgba(38,16,68,1)', stop: '60%' },
  { color: 'rgba(54,22,92,1)', stop: '85%' },
  { color: 'rgba(70,28,115,1)', stop: '100%' },
]

const items = [
  { num: '01', title: 'How to read a sketchy link before it costs you something', desc: "Phishing links are designed to look like the real thing. We break down exactly what to look for before you click." },
  { num: '02', title: "Why your dog's name isn't cutting it", desc: "The most preventable problem online. Here's what makes a password actually strong, and how to manage it without memorizing 40 things." },
  { num: '03', title: "Platform-by-platform guides for the apps you're already on", desc: "Instagram, TikTok, Snapchat, Discord — each platform has its own risks and privacy settings worth knowing." },
  { num: '04', title: 'What to do when your account gets hit or info gets leaked', desc: "If it happens, there's a right way to respond. Fast, calm, and without making it worse." },
]

export function WhatWeDo() {
  const headRef = useRef<HTMLHeadingElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const isHeadInView = useInView(headRef, { once: true, margin: '-60px' })
  const isListInView = useInView(listRef, { once: true, margin: '-60px' })

  return (
    <section className="h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)] p-4 md:p-6 bg-black">
      <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-y-auto overflow-x-hidden">
        <GradientBackground gradientOrigin="bottom-right" gradientSize="160% 160%" colors={SECTION_COLORS} noiseIntensity={0.51} noisePatternSize={100} noisePatternRefreshInterval={8} />
        <SectionTrail gridSize={32} color="#DEDBC8" decay={0.92} />
        <ShieldWatermark className="top-[50%] right-[-8%] -translate-y-1/2" size="44vw" opacity={0.03} />

        {/* Watermark */}
        <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden flex items-center justify-end pr-6">
          <span className="font-display font-bold leading-none select-none" style={{ fontSize: 'clamp(80px, 16vw, 220px)', color: 'rgba(255,255,255,0.025)' }}>SAFETY</span>
        </div>

        {/* Section counter */}
        <div className="absolute top-6 right-8 z-[3] pointer-events-none">
          <span className="text-white/10 text-[10px] tracking-[0.25em] uppercase">03 / 05</span>
        </div>

        <div className="relative z-10 py-6 sm:py-8 px-8 sm:px-14 md:px-20 min-h-full flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-16 items-center w-full">

            {/* Left: heading */}
            <div>
              <p className="text-blue-300/40 text-[10px] tracking-[0.3em] uppercase mb-6">What we do</p>
              <motion.h2
                ref={headRef}
                className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl leading-[1.1] mb-5"
                style={{ color: '#E1E0CC' }}
                initial={{ opacity: 0, y: 24 }}
                animate={isHeadInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                Real tips. No jargon. No 47-step PDFs.
              </motion.h2>
              <motion.p
                className="text-blue-100/40 text-sm leading-relaxed"
                initial={{ opacity: 0 }}
                animate={isHeadInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.9, delay: 0.2 }}
              >
                We break online safety down into things you can actually use.
              </motion.p>
            </div>

            {/* Right: items */}
            <div ref={listRef}>
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  className="group flex gap-5 py-4 border-t border-white/[0.07] cursor-default"
                  initial={{ opacity: 0, x: 24 }}
                  animate={isListInView ? { opacity: 1, x: 0 } : {}}
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.6, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="text-[#444] text-xs tracking-widest pt-1 shrink-0 group-hover:text-blue-300 transition-colors duration-300">{item.num}</span>
                  <div>
                    <h3 className="font-display text-base sm:text-lg mb-1 group-hover:text-white transition-colors duration-300" style={{ color: '#DEDBC8' }}>{item.title}</h3>
                    <p className="text-blue-100/40 text-xs sm:text-sm leading-relaxed group-hover:text-blue-100/60 transition-colors duration-300">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
              <div className="border-t border-white/[0.07]" />
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
