import { motion, useTransform, type MotionValue } from 'framer-motion'

interface Props {
  scrollProgress: MotionValue<number>
  index: number
  totalChars: number
  char: string
}

export function AnimatedLetter({ scrollProgress, index, totalChars, char }: Props) {
  const charProgress = index / totalChars
  const opacity = useTransform(
    scrollProgress,
    [Math.max(0, charProgress - 0.1), Math.min(1, charProgress + 0.05)],
    [0.2, 1]
  )
  return <motion.span style={{ opacity }}>{char}</motion.span>
}
