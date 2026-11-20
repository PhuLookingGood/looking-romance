import { Fragment, useEffect, useRef, useState } from 'react'
import type { PointerEvent, SyntheticEvent } from 'react'
import { artist, hero, name } from '../content'
import { HeroRipple } from './HeroRipple'
import { Letters } from './Letters'
import { Nav } from './Nav'
import styles from './Hero.module.css'

const DECODE_TIMEOUT = 1500
const LETTER_STEP = 100
const PARALLAX_SCALE = 0.2
const PARALLAX_SHIFT = 7

export function Hero({ source, ready, onPhotoDone }: {
  source: string | undefined
  ready: boolean
  onPhotoDone: () => void
}) {
  const section = useRef<HTMLElement>(null)
  const media = useRef<HTMLDivElement>(null)
  const decodeTimer = useRef<number>(0)
  const alive = useRef(false)
  const [photo, setPhoto] = useState<HTMLImageElement>()
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
      window.clearTimeout(decodeTimer.current)
    }
  }, [])

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    function update() {
      frame = 0
      const bounds = section.current?.getBoundingClientRect()
      if (!bounds || !media.current) return
      const progress = preference.matches ? 0 : Math.max(0, Math.min(1, -bounds.top / bounds.height))
      media.current.style.setProperty('--scale', String(1 + PARALLAX_SCALE * progress))
      media.current.style.setProperty('--shift', `${-PARALLAX_SHIFT * progress}%`)
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    preference.addEventListener('change', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      preference.removeEventListener('change', schedule)
    }
  }, [])

  async function decodePhoto(event: SyntheticEvent<HTMLImageElement>) {
    const image = event.currentTarget
    await Promise.race([
      image.decode().catch(() => undefined),
      new Promise<void>((resolve) => { decodeTimer.current = window.setTimeout(resolve, DECODE_TIMEOUT) }),
    ])
    window.clearTimeout(decodeTimer.current)
    if (!alive.current) return
    setPhoto(image)
    onPhotoDone()
  }

  function moveGlow(event: PointerEvent<HTMLElement>) {
    if (!fallback || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--x', `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty('--y', `${event.clientY - bounds.top}px`)
  }

  return (
    <section id="top" ref={section} className={styles.hero} data-ready={ready} onPointerMove={moveGlow}>
      <div className={styles.media} ref={media}>
        {source && <img className={styles.photo} data-loaded={Boolean(photo)} src={source} alt="The two members of looking romance"
          onLoad={decodePhoto} onError={onPhotoDone} />}
        {photo && <HeroRipple image={photo} section={section} onUnavailable={setFallback} />}
      </div>
      <div className={styles.shade} />
      {fallback && <div className={styles.glow} />}
      <div className="frame">
        <Nav />
        <h1 className={styles.name} aria-label={name}>
          <span className="trim-display"><Letters word={artist[0]} start={380} step={LETTER_STEP} /></span>
          <span className={`trim-display ${styles.surname}`}>
            <Letters word={artist[1]} start={380 + artist[0].length * LETTER_STEP} step={LETTER_STEP} />
          </span>
        </h1>
        <div className={styles.subrow}><span className="trim">{hero.subtitle}</span><span className="trim">{hero.spec}</span></div>
        <p className={`trim ${styles.notes}`}>
          {hero.notes.map((line, index) => <Fragment key={index}>{index > 0 && <br />}{line}</Fragment>)}
        </p>
        <a className={`pill ${styles.cta}`} href="#statement"><span className="trim">{hero.schedule}</span></a>
      </div>
    </section>
  )
}
