import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Features } from './sections/Features'
import { WhatWeDo } from './sections/WhatWeDo'
import { HowToHelp } from './sections/HowToHelp'
import { Closing } from './sections/Closing'

export type Page = 'home' | 'who-we-are' | 'why-it-matters' | 'what-we-do' | 'how-to-help' | 'get-involved'

const navItems: { label: string; page: Page }[] = [
  { label: 'Who We Are', page: 'who-we-are' },
  { label: 'Why It Matters', page: 'why-it-matters' },
  { label: 'What We Do', page: 'what-we-do' },
  { label: 'How To Help', page: 'how-to-help' },
  { label: 'Get Involved', page: 'get-involved' },
]

function App() {
  const [activePage, setActivePage] = useState<Page>('home')

  const navigate = (page: Page) => {
    setActivePage(page)
    window.scrollTo(0, 0)
  }

  return (
    <div className="bg-black min-h-screen overflow-x-hidden">
      {/* Back to home button */}
      <AnimatePresence>
        {activePage !== 'home' && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => navigate('home')}
            aria-label="Home"
            className="fixed top-2.5 left-4 z-50 bg-black rounded-full p-1.5 opacity-70 hover:opacity-100 transition-opacity"
          >
            <img src="/favicon.svg" alt="" className="w-6 h-6 sm:w-7 sm:h-7" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Persistent fixed navbar */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50">
        <nav className="bg-black rounded-b-2xl md:rounded-b-3xl px-4 py-2 md:px-8 flex items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className="text-[10px] sm:text-xs md:text-sm font-medium transition-colors whitespace-nowrap"
              style={{
                color: activePage === item.page ? '#E1E0CC' : 'rgba(225, 224, 204, 0.55)',
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Routed view */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePage}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={activePage !== 'home' ? 'pt-12 sm:pt-14' : ''}
        >
          {activePage === 'home'          && <Hero onNavigate={navigate} />}
          {activePage === 'who-we-are'    && <About />}
          {activePage === 'why-it-matters'&& <Features />}
          {activePage === 'what-we-do'    && <WhatWeDo />}
          {activePage === 'how-to-help'   && <HowToHelp />}
          {activePage === 'get-involved'  && <Closing />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default App
