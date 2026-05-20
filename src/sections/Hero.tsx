import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { WordsPullUp } from '../components/WordsPullUp'
import type { Page } from '../App'

interface Props {
  onNavigate: (page: Page) => void
}

export function Hero({ onNavigate }: Props) {
  return (
    <section className="h-screen p-4 md:p-6 bg-black">
      <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden">
        <video
          src="/hero-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="noise-overlay absolute inset-0 opacity-[0.7] mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        {/* Bottom content grid */}
        <div className="absolute bottom-0 left-0 right-0 grid grid-cols-12 items-end px-6 md:px-8 pb-8 md:pb-12 gap-x-4 gap-y-4">
          <div className="col-span-12 lg:col-span-8">
            <h1
              className="font-gelasio text-[11vw] sm:text-[10vw] lg:text-[9vw] font-medium leading-[0.85] tracking-[-0.03em]"
              style={{ color: '#E1E0CC' }}
            >
              <WordsPullUp text="The Safe Net" showAsterisk />
            </h1>
          </div>

          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 pb-2 lg:pb-4">
            <motion.p
              className="text-primary/70 text-xs sm:text-sm md:text-base"
              style={{ lineHeight: 1.2 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Nobody warned us. So we're warning you. Real advice on staying safe online, from
              teens who actually use the internet.
            </motion.p>

            <motion.button
              onClick={() => onNavigate('who-we-are')}
              className="group flex items-center gap-2 hover:gap-3 bg-primary rounded-full pl-5 pr-1 py-1 font-medium text-sm sm:text-base text-black w-fit transition-all duration-300"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              See What We've Got
              <span className="bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0">
                <ArrowRight className="w-4 h-4" style={{ color: '#E1E0CC' }} />
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}
