import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Props {
  text: string
  className?: string
  showAsterisk?: boolean
  delay?: number
}

export function WordsPullUp({ text, className = '', showAsterisk = false, delay = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const words = text.split(' ').filter(Boolean)

  return (
    <span ref={ref} className={`inline-flex flex-wrap justify-center gap-x-[0.15em] ${className}`}>
      {words.map((word, i) => {
        const isLast = showAsterisk && i === words.length - 1
        return isLast ? (
          <span key={i} className="relative">
            <span className="inline-block" style={{ clipPath: 'inset(-0.35em -0.1em 0em -0.1em)' }}>
              <motion.span
                className="inline-block"
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: delay + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
              </motion.span>
            </span>
            <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
          </span>
        ) : (
          <span key={i} className="inline-block" style={{ clipPath: 'inset(-0.35em -0.1em 0em -0.1em)' }}>
            <motion.span
              className="inline-block"
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: delay + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
            </motion.span>
          </span>
        )
      })}
    </span>
  )
}
