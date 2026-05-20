import { useEffect, useRef } from 'react'

interface Props {
  gridSize?: number
  color?: string
  decay?: number
}

export function SectionTrail({ gridSize = 32, color = '#DEDBC8', decay = 0.92 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const parent = canvas.parentElement
    if (!parent) return

    let cols = 0, rows = 0, cellW = 0, cellH = 0
    let cssW = 0, cssH = 0
    let grid: Float32Array = new Float32Array(0)

    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      cssW = parent.clientWidth
      cssH = parent.clientHeight
      canvas.width = cssW * dpr
      canvas.height = cssH * dpr
      canvas.style.width = cssW + 'px'
      canvas.style.height = cssH + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = gridSize
      rows = Math.max(1, Math.round((cssH / cssW) * cols))
      cellW = cssW / cols
      cellH = cssH / rows
      grid = new Float32Array(rows * cols)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(parent)

    let mouseX = -1, mouseY = -1

    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }
    const onLeave = () => { mouseX = -1; mouseY = -1 }

    parent.addEventListener('mousemove', onMove)
    parent.addEventListener('mouseleave', onLeave)

    let animId: number

    const loop = () => {
      ctx.clearRect(0, 0, cssW, cssH)

      if (mouseX >= 0 && mouseY >= 0) {
        const col = Math.floor(mouseX / cellW)
        const row = Math.floor(mouseY / cellH)
        if (col >= 0 && col < cols && row >= 0 && row < rows) {
          grid[row * cols + col] = 1
        }
      }

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const i = row * cols + col
          const alpha = grid[i]
          if (alpha > 0.015) {
            ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.7})`
            const gap = Math.max(1, cellW * 0.12)
            ctx.fillRect(col * cellW + gap, row * cellH + gap, cellW - gap * 2, cellH - gap * 2)
            grid[i] *= decay
          } else if (alpha > 0) {
            grid[i] = 0
          }
        }
      }

      animId = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      ro.disconnect()
      parent.removeEventListener('mousemove', onMove)
      parent.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(animId)
    }
  }, [gridSize, color, decay])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}
    />
  )
}
