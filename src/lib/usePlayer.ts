import { useCallback, useEffect, useRef, useState } from 'react'
import { MAIN_THEME, tracks } from '../content'

export type PlayerId = 'album' | number
type Playback = { id: PlayerId; progress: number; remaining: number }
type Session = { id: PlayerId; frame: number; audio: HTMLAudioElement | null }

export function usePlayer() {
  const [playback, setPlayback] = useState<Playback | null>(null)
  const active = useRef<Session | null>(null)

  const clear = useCallback(() => {
    const session = active.current
    active.current = null
    if (!session) return
    cancelAnimationFrame(session.frame)
    if (session.audio) {
      session.audio.onended = null
      session.audio.onerror = null
      session.audio.pause()
    }
  }, [])

  const stop = useCallback(() => {
    clear()
    setPlayback(null)
  }, [clear])

  useEffect(() => clear, [clear])

  const toggle = useCallback((id: PlayerId) => {
    if (active.current?.id === id) {
      stop()
      return
    }
    clear()
    const track = id === 'album' ? null : tracks[id]
    const length = track?.seconds ?? Infinity
    const source = id === 'album' ? MAIN_THEME : track?.preview
    const session: Session = { id, frame: 0, audio: source ? new Audio(source) : null }
    active.current = session
    let start = performance.now()
    setPlayback({ id, progress: 0, remaining: length })

    function fallBackToDemo() {
      if (active.current !== session || !session.audio) return
      start = performance.now() - session.audio.currentTime * 1000
      session.audio.onended = null
      session.audio.onerror = null
      session.audio.pause()
      session.audio = null
    }

    if (session.audio) {
      session.audio.onended = stop
      session.audio.onerror = fallBackToDemo
      void session.audio.play().catch(fallBackToDemo)
    }

    function update(now: number) {
      if (active.current !== session) return
      const audioDuration = session.audio?.duration
      const duration = audioDuration && Number.isFinite(audioDuration) ? audioDuration : length
      const elapsed = session.audio?.currentTime ?? (now - start) / 1000
      if (!session.audio && elapsed >= duration) {
        stop()
        return
      }
      if (id !== 'album') {
        setPlayback({ id, progress: Math.min(1, elapsed / duration), remaining: Math.max(0, duration - elapsed) })
      }
      session.frame = requestAnimationFrame(update)
    }
    session.frame = requestAnimationFrame(update)
  }, [clear, stop])

  return { playback, toggle }
}

export type Player = ReturnType<typeof usePlayer>
