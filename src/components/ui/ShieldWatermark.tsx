interface Props {
  className?: string
  opacity?: number
  size?: string | number
}

export function ShieldWatermark({ className = '', opacity = 0.03, size = '40vw' }: Props) {
  return (
    <div
      className={`absolute pointer-events-none z-[1] ${className}`}
      style={{ opacity, width: size, height: size }}
    >
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <path
          d="M16 5L8 8.5V15c0 4.7 3.4 9.1 8 10.5 4.6-1.4 8-5.8 8-10.5V8.5L16 5z"
          fill="white"
        />
      </svg>
    </div>
  )
}
