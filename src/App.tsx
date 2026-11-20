import { useEffect, useState } from 'react'
import { assets } from './content'
import { Hero } from './components/Hero'
import { Statement } from './components/Statement'
import { Cursor } from './components/Cursor'
import { ScrollNav } from './components/Nav'
import { Release } from './components/Release'
import { Tracklist } from './components/Tracklist'
import { Tour } from './components/Tour'
import { Merch } from './components/Merch'
import { SiteFooter } from './components/SiteFooter'
import { usePlayer } from './lib/usePlayer'

const INTRO_TIMEOUT = 4000
const FONT_FACES = [
  "400 1em 'Road Rage'",
  "semi-condensed 500 1em 'Mona Sans'",
  "semi-condensed 200 1em 'Mona Sans'",
  "semi-condensed 600 1em 'Mona Sans'",
  '400 1em Geist',
  '500 1em Geist',
]

export default function App() {
  const [source, setSource] = useState<string>()
  const [photoDone, setPhotoDone] = useState(false)
  const [fontsDone, setFontsDone] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const player = usePlayer()

  useEffect(() => {
    const section = document.getElementById(window.location.hash.slice(1))
    section?.scrollIntoView({ behavior: 'instant' })
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let objectUrl: string | undefined

    async function loadPhoto() {
      try {
        const response = await fetch(assets.hero, { signal: controller.signal })
        if (!response.ok) throw new Error(`Hero photo request returned ${response.status}`)
        const blob = await response.blob()
        if (controller.signal.aborted) return
        objectUrl = URL.createObjectURL(blob)
        setSource(objectUrl)
      } catch (error) {
        if (controller.signal.aborted) return
        console.warn('Could not fetch the hero photo.', error)
        setSource(assets.hero)
      }
    }
    void loadPhoto()
    void Promise.allSettled(FONT_FACES.map((font) => document.fonts.load(font))).then(() => {
      if (!controller.signal.aborted) setFontsDone(true)
    })
    const timer = window.setTimeout(() => setTimedOut(true), INTRO_TIMEOUT)
    return () => {
      controller.abort()
      window.clearTimeout(timer)
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [])

  return (
    <>
      <main>
        <Hero source={source} ready={timedOut || (fontsDone && photoDone)} onPhotoDone={() => setPhotoDone(true)} />
        <Statement />
        <Release player={player} />
        <Tracklist player={player} />
        <Tour />
        <Merch />
        <ScrollNav />
        <Cursor />
      </main>
      <SiteFooter />
    </>
  )
}
