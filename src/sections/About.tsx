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

const pillars = [
  {
    label: 'Awareness',
    desc: 'Educating teens about online threats through real stories and practical examples',
  },
  {
    label: 'Community',
    desc: 'Building a supportive network that prioritizes digital safety for everyone',
  },
  {
    label: 'Support',
    desc: 'Fundraising to help organizations that assist victims of online scams',
  },
]

const officers = [
  { name: 'Nivedhya Rajesh Nair', title: 'President & Founder' },
  { name: 'Bhavya Maddali', title: 'Vice President' },
  { name: 'Sanaika Nandigam', title: 'Secretary' },
  { name: 'Ria Rastogi', title: 'Outreach Coordinator' },
  { name: 'Shreya Sreekath', title: 'Director of Partnerships' },
  { name: 'Bindu Sree Kata', title: 'Treasurer' },
  { name: 'Prisha Shah', title: 'Social Media Manager' },
  { name: 'Joshita Guggulla', title: 'Social Media Manager' },
  { name: 'Sai Sahasra Balabhadra', title: 'Social Media Manager' },
]

export function About() {
  const headRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const teamRef = useRef<HTMLDivElement>(null)

  const isHeadInView = useInView(headRef, { once: true, margin: '-60px' })
  const isBodyInView = useInView(bodyRef, { once: true, margin: '-60px' })
  const isTeamInView = useInView(teamRef, { once: true, margin: '-60px' })

  return (
    <section className="h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)] p-4 md:p-6 bg-black">
      {/* scroll container — clips for rounded corners only */}
      <div className="w-full h-full rounded-2xl md:rounded-[2rem] overflow-y-auto overflow-x-hidden">
        {/* content wrapper — gradient positioned relative to this, stretches with content */}
        <div className="relative min-h-full">
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

          {/* WHO watermark */}
          <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden flex items-start justify-end pr-8 pt-10">
            <span
              className="font-display font-bold leading-none select-none"
              style={{ fontSize: 'clamp(120px, 22vw, 280px)', color: 'rgba(255,255,255,0.025)' }}
            >
              WHO
            </span>
          </div>

          {/* Section counter */}
          <div className="sticky top-0 z-[3] pointer-events-none flex justify-end px-8 pt-6 pb-0">
            <span className="text-white/10 text-[10px] tracking-[0.25em] uppercase">01 / 05</span>
          </div>

          <div className="relative z-10 pt-8 pb-14 sm:pb-16 px-8 sm:px-14 md:px-20">
            <div className="max-w-6xl mx-auto w-full">

              {/* Hero */}
              <p className="text-blue-300/40 text-[10px] tracking-[0.3em] uppercase mb-8">Who we are</p>

              <motion.h2
                ref={headRef}
                className="font-display font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-10 md:mb-12"
                style={{ color: '#E1E0CC' }}
                initial={{ opacity: 0, y: 24 }}
                animate={isHeadInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                Building a safer digital world together.
              </motion.h2>

              <motion.div
                ref={bodyRef}
                initial={{ opacity: 0, y: 20 }}
                animate={isBodyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Mission */}
                <div className="mb-14">
                  <p className="text-blue-300/35 text-[9px] tracking-[0.3em] uppercase mb-4">Our Mission</p>
                  <p className="text-base sm:text-lg leading-relaxed text-blue-100/50 max-w-2xl">
                    The Safe Net is a project dedicated to empowering teens to navigate the digital world safely and
                    effectively. We achieve this by sharing real stories, practical tips, and important warnings about
                    online deception. We will also host fundraisers to support organizations helping scam victims. Every
                    post and initiative is designed to raise awareness and make the digital world safer for our community.
                  </p>
                </div>

                {/* Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-white/[0.07] mb-20">
                  {pillars.map((p, i) => (
                    <div key={p.label} className={`pt-8 pb-6 ${i < 2 ? 'sm:pr-12' : ''}`}>
                      <p className="font-display font-semibold text-xl sm:text-2xl mb-2.5" style={{ color: '#E1E0CC' }}>
                        {p.label}
                      </p>
                      <p className="text-blue-100/35 text-sm leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Officers */}
              <motion.div
                ref={teamRef}
                initial={{ opacity: 0, y: 20 }}
                animate={isTeamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-blue-300/35 text-[9px] tracking-[0.3em] uppercase mb-6">Our Team</p>

                {/* President card — full width, elevated */}
                <div
                  className="rounded-2xl px-6 py-5 mb-3 flex items-center justify-between gap-6 border border-white/[0.12] bg-white/[0.04] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.2] hover:bg-white/[0.06]"
                >
                  <div className="flex items-center gap-5">
                    <span className="font-mono text-[11px] tracking-[0.2em]" style={{ color: 'rgba(225,224,204,0.2)' }}>01</span>
                    <div>
                      <p className="font-semibold text-[16px] leading-snug mb-1.5" style={{ color: '#E1E0CC' }}>
                        {officers[0].name}
                      </p>
                      <span
                        className="inline-block text-[9px] tracking-[0.2em] uppercase px-2.5 py-0.5 rounded-full border border-blue-300/20 bg-blue-300/[0.06]"
                        style={{ color: 'rgba(147,197,253,0.65)' }}
                      >
                        {officers[0].title}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 w-8 h-8 rounded-full border border-white/[0.1] flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'rgba(225,224,204,0.3)' }}>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                </div>

                {/* Rest of team — 2-col then 3-col grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                  {officers.slice(1, 5).map((o, i) => (
                    <div
                      key={o.name}
                      className="rounded-2xl px-5 pt-4 pb-5 border border-white/[0.08] bg-white/[0.025] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.045]"
                    >
                      <span className="block font-mono text-[10px] tracking-[0.2em] mb-4" style={{ color: 'rgba(225,224,204,0.18)' }}>
                        {String(i + 2).padStart(2, '0')}
                      </span>
                      <p className="font-medium text-[13px] leading-snug mb-2.5" style={{ color: '#E1E0CC' }}>
                        {o.name}
                      </p>
                      <span
                        className="inline-block text-[8px] tracking-[0.18em] uppercase px-2 py-0.5 rounded-full border border-blue-300/15 bg-blue-300/[0.04]"
                        style={{ color: 'rgba(147,197,253,0.45)' }}
                      >
                        {o.title}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {officers.slice(5).map((o, i) => (
                    <div
                      key={o.name}
                      className="rounded-2xl px-5 pt-4 pb-5 border border-white/[0.08] bg-white/[0.025] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.045]"
                    >
                      <span className="block font-mono text-[10px] tracking-[0.2em] mb-4" style={{ color: 'rgba(225,224,204,0.18)' }}>
                        {String(i + 6).padStart(2, '0')}
                      </span>
                      <p className="font-medium text-[13px] leading-snug mb-2.5" style={{ color: '#E1E0CC' }}>
                        {o.name}
                      </p>
                      <span
                        className="inline-block text-[8px] tracking-[0.18em] uppercase px-2 py-0.5 rounded-full border border-blue-300/15 bg-blue-300/[0.04]"
                        style={{ color: 'rgba(147,197,253,0.45)' }}
                      >
                        {o.title}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-14" />
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
