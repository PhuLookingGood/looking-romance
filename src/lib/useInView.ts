import { useEffect, useRef, useState } from 'react'

export function useInView(threshold: number) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const section = ref.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold })
    observer.observe(section)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}
