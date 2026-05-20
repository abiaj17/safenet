import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Segment {
  text: string
  className?: string
}

interface Props {
  segments: Segment[]
  containerClassName?: string
  delay?: number
}

export function WordsPullUpMultiStyle({ segments, containerClassName = '', delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  const allWords = segments.flatMap((seg) =>
    seg.text
      .split(' ')
      .filter(Boolean)
      .map((word) => ({ word, className: seg.className ?? '' }))
  )

  return (
    <div
      ref={ref}
      className={`inline-flex flex-wrap justify-center gap-x-[0.25em] gap-y-[0.1em] ${containerClassName}`}
    >
      {allWords.map((item, i) => (
        <span key={i} className="inline-block" style={{ clipPath: 'inset(-0.35em -0.1em 0em -0.1em)' }}>
          <motion.span
            className={`inline-block ${item.className}`}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: delay + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            {item.word}
          </motion.span>
        </span>
      ))}
    </div>
  )
}
