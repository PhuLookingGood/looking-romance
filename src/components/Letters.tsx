import type { CSSProperties } from 'react'
import styles from './Letters.module.css'

export function Letters({ word, start = 0, step, roll = false }: {
  word: string
  start?: number
  step: number
  roll?: boolean
}) {
  return Array.from(word, (letter, index) => (
    <span aria-hidden="true" key={index} className={roll ? styles.clip : styles.letter}
      style={{ '--delay': `${start + index * step}ms` } as CSSProperties}>
      {roll ? <span className={styles.track}><span>{letter}</span><span>{letter}</span></span> : letter === ' ' ? '\u00a0' : letter}
    </span>
  ))
}
