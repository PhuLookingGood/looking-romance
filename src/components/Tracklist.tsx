import type { CSSProperties } from 'react'
import { assets, tracklist, tracks } from '../content'
import { useInView } from '../lib/useInView'
import type { Player } from '../lib/usePlayer'
import styles from './Tracklist.module.css'

const FIRST_ROW_DELAY = 160
const ROW_STEP = 85

function formatTime(seconds: number) {
  const wholeSeconds = Math.ceil(seconds)
  const minutes = Math.floor(wholeSeconds / 60)
  return `${String(minutes).padStart(2, '0')}:${String(wholeSeconds % 60).padStart(2, '0')}`
}

export function Tracklist({ player }: { player: Player }) {
  const { ref, visible } = useInView(0.5)
  return (
    <section className={styles.section} aria-label={tracklist.label} ref={ref} data-visible={visible}>
      <div className={styles.sunset} />
      <div className={`frame ${styles.frame}`}>
        <h2 className={`trim ${styles.kicker}`}>{tracklist.kicker}</h2>
        <div className={styles.table} role="table" aria-label={tracklist.label}>
          <div className={styles.header} role="row">
            {tracklist.columns.map((column) => <span className="trim" role="columnheader" key={column}>{column}</span>)}
          </div>
          {tracks.map((track, index) => {
            const playback = player.playback?.id === index ? player.playback : null
            const style = {
              '--delay': `${FIRST_ROW_DELAY + index * ROW_STEP}ms`,
              '--progress': `${(playback?.progress ?? 0) * 100}%`,
            } as CSSProperties
            return (
              <div className={styles.row} key={track.title} role="row" style={style}>
                <span className={`trim ${styles.number}`} role="cell">{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.control} role="cell">
                  <button type="button" aria-label={`${playback ? 'Pause' : 'Play'} the excerpt of ${track.title}`} onClick={() => player.toggle(index)}>
                    {playback ? <span className={styles.pause} aria-hidden="true" /> : <img src={assets.play} alt="" />}
                  </button>
                </span>
                <span className={`trim ${styles.title}`} role="cell">{track.title}</span>
                <span className={`trim ${styles.excerpt}`} role="cell" data-playing={Boolean(playback)}>{formatTime(playback?.remaining ?? track.seconds)}</span>
                <span className={`trim ${styles.duration}`} role="cell">{track.duration}</span>
                <span className={styles.fill} aria-hidden="true" />
              </div>
            )
          })}
        </div>
        <div className={styles.bottom}>
          <span className="trim">{tracklist.live}</span>
          <a className={`pill ${styles.schedule}`} href="#tour"><span className="trim">{tracklist.schedule}</span></a>
        </div>
      </div>
    </section>
  )
}
