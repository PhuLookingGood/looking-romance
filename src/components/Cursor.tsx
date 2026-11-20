import { useEffect, useRef } from 'react'
import styles from './Cursor.module.css'

export function Cursor() {
  const cursor = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const anchor = cursor.current
    if (!anchor) return
    const node = anchor
    const preference = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)')
    function hide() { delete node.dataset.visible }
    function move(event: PointerEvent) {
      if (!preference.matches || event.pointerType !== 'mouse') return
      node.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      node.dataset.visible = String(!(event.target instanceof Element && event.target.closest('[data-cursor="hide"]')))
    }
    window.addEventListener('pointermove', move)
    document.documentElement.addEventListener('pointerleave', hide)
    window.addEventListener('blur', hide)
    preference.addEventListener('change', hide)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', hide)
      window.removeEventListener('blur', hide)
      preference.removeEventListener('change', hide)
    }
  }, [])
  return <div className={styles.anchor} ref={cursor} aria-hidden="true"><span /></div>
}
