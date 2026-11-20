import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { assets, statement } from '../content'
import { useInView } from '../lib/useInView'
import styles from './Statement.module.css'

const LINE_DELAY = 110
const FOLLOW_TIME = 140
const MAX_DELTA = 32
const STOP_DISTANCE = 0.1

export function Statement() {
  const { ref, visible } = useInView(0.2)
  const textBlock = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const block = textBlock.current
    if (!block) return
    const surface = block
    const desktopMouse = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)')
    let frame = 0
    let previous = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let initialized = false

    function paint() {
      surface.style.setProperty('--fx', `${currentX}px`)
      surface.style.setProperty('--fy', `${currentY}px`)
    }
    function follow(now: number) {
      frame = 0
      const factor = 1 - Math.exp(-Math.min(now - previous, MAX_DELTA) / FOLLOW_TIME)
      previous = now
      currentX += (targetX - currentX) * factor
      currentY += (targetY - currentY) * factor
      paint()
      if (Math.hypot(targetX - currentX, targetY - currentY) > STOP_DISTANCE) {
        frame = requestAnimationFrame(follow)
      }
    }
    function move(event: PointerEvent) {
      if (!desktopMouse.matches || event.pointerType !== 'mouse') return
      const bounds = surface.getBoundingClientRect()
      targetX = event.clientX - bounds.left
      targetY = event.clientY - bounds.top
      if (!initialized) {
        initialized = true
        currentX = targetX
        currentY = targetY
        paint()
      } else if (!frame) {
        previous = performance.now()
        frame = requestAnimationFrame(follow)
      }
      surface.dataset.hovered = 'true'
    }
    function leave() { delete surface.dataset.hovered }
    surface.addEventListener('pointermove', move)
    surface.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      surface.removeEventListener('pointermove', move)
      surface.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <section id="statement" className={styles.section} ref={ref} data-visible={visible}>
      <div className="frame">
        <p className={`trim ${styles.kicker}`}>{statement.kicker}</p>
        <div className={styles.block} ref={textBlock}>
          <p className={styles.text} aria-label={statement.lines.join(' ')}>
            {statement.lines.map((line, index) => (
              <span className={styles.clip} key={line} aria-hidden="true" style={{ '--delay': `${index * LINE_DELAY}ms` } as CSSProperties}>
                <span className={`trim-display ${styles.line}`}>{line}</span>{' '}
              </span>
            ))}
          </p>
          <img className={styles.photo} src={assets.statement} alt="" />
        </div>
        <p className={`trim ${styles.note}`}>{statement.note.map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</p>
        <div className={styles.equipment}>
          <span className={`trim ${styles.equipmentLabel}`}>{statement.equipmentLabel}</span>
          <div className={styles.pills}>{statement.equipment.map((item) => <span className={styles.pill} key={item}><span className="trim">{item}</span></span>)}</div>
        </div>
      </div>
    </section>
  )
}
