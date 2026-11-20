import { useEffect, useRef } from 'react'
import type { PointerEvent } from 'react'
import styles from './admit-one-ticket.module.css'

type TicketProps = {
  name: string
  presenter: string
  event: string
  venue: string
  dates: string
  stubText: string
  edition: { id: string; code: string; motif: string; localName: string; language: string }
  cityImage: string
}

const vertexSource = `#version 300 es
void main() {
  vec2 corner = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}`

const fragmentSource = `#version 300 es
precision highp float;
uniform vec2 resolution;
uniform float time;
out vec4 color;
void main() {
  vec2 point = (gl_FragCoord.xy - resolution * .5) / resolution.x * 3.0;
  for (float wave = 1.0; wave < 6.0; wave++) {
    point.x += .6 / wave * cos(wave * 2.5 * point.y + time);
    point.y += .6 / wave * cos(wave * 1.5 * point.x + time);
  }
  float warp = smoothstep(.02, 1.0, .15 / max(.001, abs(sin(time - point.y - point.x))));
  float grain = fract(sin(dot(floor(gl_FragCoord.xy), vec2(12.9898, 78.233))) * 43758.5453);
  vec3 base = vec3(.94, .40, .11);
  vec3 ink = vec3(1., .78, .57);
  color = vec4(mix(base, ink, warp * .48 + step(.65, grain) * .16), 1.);
}`

const reducedMotion = '(prefers-reduced-motion: reduce)'
const tiltLimit = 9

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader
  gl.deleteShader(shader)
  return null
}

function TicketTexture() {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = host.current
    if (!container) return
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false })
    if (!gl) return
    const context = gl
    const program = gl.createProgram()
    const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource)
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource)
    if (program && vertex && fragment) {
      gl.attachShader(program, vertex)
      gl.attachShader(program, fragment)
      gl.linkProgram(program)
    }
    gl.deleteShader(vertex)
    gl.deleteShader(fragment)
    if (!program || !gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      return
    }

    gl.useProgram(program)
    const resolution = gl.getUniformLocation(program, 'resolution')
    const time = gl.getUniformLocation(program, 'time')
    const motion = matchMedia(reducedMotion)
    const start = performance.now()
    let frame = 0

    function draw(now: number) {
      context.uniform1f(time, motion.matches ? 0 : (now - start) * 0.0004)
      context.drawArrays(context.TRIANGLES, 0, 3)
      if (!motion.matches && !document.hidden) frame = requestAnimationFrame(draw)
    }

    function sync() {
      cancelAnimationFrame(frame)
      draw(performance.now())
    }

    function resize() {
      if (!container) return
      const ratio = Math.min(devicePixelRatio, 2)
      canvas.width = Math.max(1, Math.round(container.clientWidth * ratio))
      canvas.height = Math.max(1, Math.round(container.clientHeight * ratio))
      context.viewport(0, 0, canvas.width, canvas.height)
      context.uniform2f(resolution, canvas.width, canvas.height)
      sync()
    }

    const observer = new ResizeObserver(resize)
    container.append(canvas)
    observer.observe(container)
    motion.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      motion.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
      context.deleteProgram(program)
      context.getExtension('WEBGL_lose_context')?.loseContext()
      canvas.remove()
    }
  }, [])

  return <div ref={host} className={styles.texture} aria-hidden="true" />
}

export function AdmitOneTicket({ name, presenter, event, venue, dates, stubText, edition, cityImage }: TicketProps) {
  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || matchMedia(reducedMotion).matches) return
    const { currentTarget: surface, clientX, clientY } = event
    const card = surface.firstElementChild
    if (!(card instanceof HTMLElement)) return
    const bounds = surface.getBoundingClientRect()
    const horizontal = (clientX - bounds.left) / bounds.width
    const vertical = (clientY - bounds.top) / bounds.height
    card.style.setProperty('--rotate-x', `${(0.5 - vertical) * tiltLimit * 2}deg`)
    card.style.setProperty('--rotate-y', `${(horizontal - 0.5) * tiltLimit * 2}deg`)
    card.style.setProperty('--glare-x', `${horizontal * 100}%`)
    card.style.setProperty('--glare-y', `${vertical * 100}%`)
  }

  function reset(event: PointerEvent<HTMLDivElement>) {
    const card = event.currentTarget.firstElementChild
    if (card instanceof HTMLElement) card.removeAttribute('style')
  }

  return (
    <div className={styles.surface} onPointerMove={tilt} onPointerLeave={reset}>
      <article className={styles.card} data-edition={edition.id}>
        <TicketTexture />
        <div className={styles.cityPrint} aria-hidden="true">
          <img src={cityImage} alt="" />
        </div>
        <div className={styles.main}>
          <div className={styles.label}>
            <p>{presenter}</p>
            <p className={styles.localName} lang={edition.language}>{edition.localName}</p>
          </div>
          <h3 className={styles.name}>{name}</h3>
          <div className={styles.details}>
            <p className={styles.stop}>{event}</p>
            <p>{venue} <span>·</span> {dates}</p>
          </div>
        </div>
        <div className={styles.stub}>
          <div className={styles.edition}>
            <span className={styles.motif} role="img" aria-label={edition.motif} />
            <span className={styles.editionCode}>{edition.code}</span>
          </div>
          <span className={styles.stubText}>{stubText}</span>
        </div>
      </article>
    </div>
  )
}

export default AdmitOneTicket
