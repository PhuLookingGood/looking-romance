import { navigation } from '../content'
import { Letters } from './Letters'
import styles from './Menu.module.css'

const LETTER_DELAY = 34

export function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div id="menu" className={styles.panel} data-open={open} aria-hidden={!open} inert={!open}>
      <a href="/" onClick={onClose}>Home</a>
      {navigation.links.map(({ title, to }) => (
        <a href={to} key={to} aria-label={title} onClick={onClose}><Letters word={title} step={LETTER_DELAY} roll /></a>
      ))}
    </div>
  )
}
