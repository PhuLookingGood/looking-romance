import type { PointerEvent } from 'react'
import { useRef } from 'react'
import { assets, release } from '../content'
import { useInView } from '../lib/useInView'
import type { Player } from '../lib/usePlayer'
import { Letters } from './Letters'
import { Wave } from './Wave'
import styles from './Release.module.css'

const LETTER_STEP = 50
const TILT_X = -24.2
const TILT_Y = 30.8

export function Release({ player }: { player: Player }) {
  const { ref, visible } = useInView(0.22)
  const album = useRef<HTMLButtonElement>(null)
  const playing = player.playback?.id === 'album'

  function move(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== 'mouse' || !matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const section = event.currentTarget
    const bounds = section.getBoundingClientRect()
    const x = event.clientX - bounds.left
    const y = event.clientY - bounds.top
    section.style.setProperty('--cx', `${x}px`)
    section.style.setProperty('--cy', `${y}px`)
    album.current?.style.setProperty('--rx', `${(y / bounds.height - 0.5) * TILT_X}deg`)
    album.current?.style.setProperty('--ry', `${(x / bounds.width - 0.5) * TILT_Y}deg`)
  }

  function resetTilt() {
    album.current?.style.removeProperty('--rx')
    album.current?.style.removeProperty('--ry')
  }

  return (
    <section id="release" className={styles.release} ref={ref} data-visible={visible} onPointerMove={move} onPointerLeave={resetTilt}>
      <Wave playing={playing} />
      <div className="frame">
        <p className={`trim ${styles.kicker}`}>{release.kicker}</p>
        <p className={`trim ${styles.date}`}>{release.date}</p>
        <h2 className={styles.title} aria-label={release.title.join(' ')}>
          <span className="trim-display"><Letters word={release.title[0]} step={LETTER_STEP} /></span>
          <span className="trim-display"><Letters word={release.title[1]} step={LETTER_STEP} start={release.title[0].length * LETTER_STEP} /></span>
          <span className={`trim-display ${styles.format}`} aria-hidden="true">{release.format}</span>
        </h2>
        <button ref={album} className={styles.album} type="button" data-cursor="hide"
          aria-label={playing ? 'Pause the main theme' : 'Play the main theme'} onClick={() => player.toggle('album')}>
          <img className={styles.cover} src={assets.album} alt="" />
          <span className={styles.control} aria-hidden="true">
            {playing ? <span className={styles.pause} aria-hidden="true" /> : <img className={styles.play} src={assets.playLarge} alt="" />}
          </span>
        </button>
        <div className={styles.caption}>
          {release.caption.map((line) => <span className="trim" key={line}>{line}</span>)}
        </div>
      </div>
      <div className={styles.cursor} aria-hidden="true">{release.cursor.map((line) => <span className="trim" key={line}>{line}</span>)}</div>
    </section>
  )
}
