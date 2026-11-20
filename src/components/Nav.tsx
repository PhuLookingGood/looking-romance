import { useEffect, useRef, useState } from 'react'
import { name, navigation } from '../content'
import { Menu } from './Menu'
import styles from './Nav.module.css'

const BAR_HEIGHTS = [4, 8, 13, 4, 7, 5, 11, 7, 4]

export function Nav() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setOpen(false)
      menuButton.current?.focus()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])

  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [])
  const offset = -now.getTimezoneOffset() / 60
  const zone = `GMT${offset >= 0 ? '+' : ''}${Number.isInteger(offset) ? offset : offset.toFixed(1)} // LOCAL`

  return (
    <>
      <Menu open={open} onClose={() => setOpen(false)} />
      <nav className={styles.nav} aria-label="Main navigation">
        <div className={styles.clock}>
          <span className={`trim ${styles.zone}`}>{zone}</span>
          <time className="trim">{now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</time>
        </div>
        <button className={styles.menu} aria-expanded={open} aria-controls="menu" ref={menuButton} onClick={() => setOpen(!open)}>
          <span className={styles.bars} aria-hidden="true">
            {BAR_HEIGHTS.map((height, index) => <span key={index} style={{ height: open ? undefined : `calc(${height} * var(--u))` }} />)}
          </span>
          <span className={`trim ${styles.label}`}>{navigation.menu}</span>
        </button>
        <a className="pill" href="/#release"><span className="trim">{navigation.music}</span></a>
      </nav>
    </>
  )
}

const SCROLL_THRESHOLD = 8

export function ScrollNav({ thresholdId = 'top' }: { thresholdId?: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const threshold = document.getElementById(thresholdId)
    if (!threshold) return
    let previousPosition = Math.max(0, window.scrollY)
    let frame = 0

    function update() {
      frame = 0
      const position = Math.max(0, window.scrollY)
      if (!threshold || threshold.getBoundingClientRect().bottom > 0) {
        previousPosition = position
        setVisible(false)
        return
      }
      const distance = position - previousPosition
      if (Math.abs(distance) < SCROLL_THRESHOLD) return
      previousPosition = position
      setVisible(distance < 0)
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [thresholdId])

  return (
    <nav className={styles.scrollNav} data-visible={visible} inert={!visible} aria-label="Section navigation">
      <div className={`frame ${styles.scrollFrame}`}>
        <a className={styles.wordmark} href="/" onClick={() => setVisible(false)}>{name}</a>
        <div className={styles.scrollLinks}>
          {navigation.links.map(({ title, to }) => (
            <a href={to} key={to} onClick={() => setVisible(false)}>{title}</a>
          ))}
        </div>
      </div>
    </nav>
  )
}
