import { useEffect, useRef } from 'react'
import styles from './Wave.module.css'

const PATTERN = [16, 34, 54, 16, 28, 20, 46, 28, 16, 12, 26, 38, 12, 22, 16, 34, 22, 14, 12, 28, 46, 14, 26, 16, 38, 26, 14, 8, 18, 28, 8, 16, 10, 26, 16, 8, 14, 28, 46, 14]

export function Wave({ playing }: { playing: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const probe = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const surface = canvas.current
    const measure = probe.current
    const context = surface?.getContext('2d')
    if (!playing || !surface || !measure || !context) return
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const start = performance.now()
    const white = getComputedStyle(surface).getPropertyValue('--white').trim()
    let frame = 0
    let width = 0
    let height = 0
    let unit = 0
    let pixelRatio = 1

    function draw(now: number) {
      if (!context || !unit) return
      const seconds = preference.matches ? 0 : (now - start) / 1000
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      context.clearRect(0, 0, width, height)
      context.fillStyle = white
      const limit = Math.ceil(width / (16 * unit)) + 1
      for (let index = -limit; index <= limit; index++) {
        const base = PATTERN[((index % PATTERN.length) + PATTERN.length) % PATTERN.length]
        const pulse = 0.5 + 0.5 * Math.sin(seconds * 6.1 + index * 0.47)
        const swell = 0.5 + 0.5 * Math.sin(seconds * 2.3 - index * 0.11)
        const barHeight = Math.max(4, base * (0.25 + 0.75 * (0.6 * pulse + 0.4 * swell))) * unit
        context.fillRect(width / 2 + (3 + index * 8) * unit, (height - barHeight) / 2, 2 * unit, barHeight)
      }
    }
    function animate(now: number) {
      draw(now)
      frame = requestAnimationFrame(animate)
    }
    function sync() {
      cancelAnimationFrame(frame)
      draw(performance.now())
      if (!preference.matches) frame = requestAnimationFrame(animate)
    }
    const observer = new ResizeObserver(() => {
      const bounds = surface.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      unit = measure.getBoundingClientRect().width / 100
      pixelRatio = Math.min(devicePixelRatio, 2)
      surface.width = Math.round(width * pixelRatio)
      surface.height = Math.round(height * pixelRatio)
      sync()
    })
    observer.observe(surface)
    observer.observe(measure)
    preference.addEventListener('change', sync)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      preference.removeEventListener('change', sync)
    }
  }, [playing])

  return <><div className={styles.probe} ref={probe} /><canvas className={styles.wave} data-playing={playing} aria-hidden="true" ref={canvas} /></>
}
