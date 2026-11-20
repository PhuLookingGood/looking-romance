import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import styles from './HeroRipple.module.css'

const TRAIL_LENGTH = 9
const CENTER_FOLLOW = 0.075
const STRENGTH_RISE = 0.07
const STRENGTH_FALL = 0.028
const TRAIL_FOLLOW = 0.19
const TRAIL_DECAY = 0.009
const REST_STRENGTH = 0.001
const FRAME_TIME = 16.667
const MAX_DELTA = 64
const MAX_PIXEL_RATIO = 2.25
const PHOTO_POSITION = 0.35

const VERTEX = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAGMENT = `
precision highp float;
varying vec2 vUv;
uniform sampler2D image;
uniform vec2 resolution, imageSize, mouse;
uniform vec2 trail[${TRAIL_LENGTH}];
uniform float strength, time, positionY;

vec2 coverUv(vec2 uv) {
  float rs = resolution.x / resolution.y, is = imageSize.x / imageSize.y;
  vec2 scale = rs < is ? vec2(rs / is, 1.0) : vec2(1.0, is / rs);
  return uv * scale + vec2((1.0 - scale.x) * 0.5, (1.0 - scale.y) * (1.0 - positionY));
}
void main() {
  vec2 uv = vUv;
  vec2 aspect = vec2(resolution.x / resolution.y, 1.0);
  vec2 delta = (uv - mouse) * aspect;
  float dist = length(delta);
  float falloff = (1.0 - smoothstep(0.0, 0.47, dist)) * strength;
  vec2 dir = delta / (dist + 0.0001);
  vec2 tangent = vec2(-dir.y, dir.x);
  float wave = sin(dist * 38.0 - time * 2.15) * falloff;
  float secondary = sin(dist * 19.0 + time * 0.7) * falloff;
  vec2 displacement = dir * (wave * 0.00525 + falloff * 0.004) + tangent * secondary * 0.001875;
  vec2 sampleUv = coverUv(uv + displacement);
  vec2 rgbShift = dir * (falloff * 0.0016 + abs(wave) * 0.0012);
  vec3 color = vec3(texture2D(image, sampleUv + rgbShift).r, texture2D(image, sampleUv).g,
                    texture2D(image, sampleUv - rgbShift).b);
  float glow = falloff * (0.10 + 0.08 * (sin(dist * 28.0 - time * 1.5) * 0.5 + 0.5));
  float trailGlow = 0.0;
  for (int i = 0; i < ${TRAIL_LENGTH}; i++) {
    float d = length((uv - trail[i]) * aspect);
    float age = 1.0 - float(i) / ${TRAIL_LENGTH}.0;
    float shimmer = 0.82 + 0.18 * sin(time * 2.0 - float(i) * 0.72);
    trailGlow += (exp(-d * d * 145.0) * 0.48 + exp(-d * d * 420.0) * 0.28) * age * age * shimmer;
  }
  trailGlow = min(trailGlow, 1.35) * strength * smoothstep(0.035, 0.105, dist);
  color += vec3(0.84, 0.07, 0.13) * glow;
  color += vec3(0.92, 0.08, 0.18) * trailGlow * 0.46;
  color += vec3(1.0, 0.26, 0.33) * pow(trailGlow, 1.65) * 0.11;
  gl_FragColor = vec4(color, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader
  gl.deleteShader(shader)
  return null
}

function createRenderer(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false })
  if (!gl) return null
  const program = gl.createProgram()
  const texture = gl.createTexture()
  const buffer = gl.createBuffer()

  function dispose() {
    if (!gl) return
    gl.deleteProgram(program)
    gl.deleteTexture(texture)
    gl.deleteBuffer(buffer)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX)
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
  if (program && vertex && fragment) {
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
  }
  gl.deleteShader(vertex)
  gl.deleteShader(fragment)
  if (!program || !texture || !buffer || !gl.getProgramParameter(program, gl.LINK_STATUS)) {
    dispose()
    return null
  }

  gl.useProgram(program)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
  const position = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

  try {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  } catch {
    dispose()
    return null
  }
  if (gl.getError() !== gl.NO_ERROR) {
    dispose()
    return null
  }

  gl.uniform2f(gl.getUniformLocation(program, 'imageSize'), image.naturalWidth, image.naturalHeight)
  gl.uniform1f(gl.getUniformLocation(program, 'positionY'), PHOTO_POSITION)
  const resolution = gl.getUniformLocation(program, 'resolution')
  const mouse = gl.getUniformLocation(program, 'mouse')
  const trail = gl.getUniformLocation(program, 'trail[0]')
  const strength = gl.getUniformLocation(program, 'strength')
  const time = gl.getUniformLocation(program, 'time')

  return {
    dispose,
    draw(x: number, y: number, trailPoints: Float32Array<ArrayBuffer>, intensity: number, seconds: number) {
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(resolution, canvas.width, canvas.height)
      gl.uniform2f(mouse, x, y)
      gl.uniform2fv(trail, trailPoints)
      gl.uniform1f(strength, intensity)
      gl.uniform1f(time, seconds)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    },
  }
}

export function HeroRipple({ image, section, onUnavailable }: {
  image: HTMLImageElement
  section: RefObject<HTMLElement | null>
  onUnavailable: (unavailable: boolean) => void
}) {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = host.current
    const hero = section.current
    if (!container || !hero) return
    const media = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)')

    function mount(container: HTMLDivElement, hero: HTMLElement) {
      const canvas = document.createElement('canvas')
      const renderer = createRenderer(canvas, image)
      onUnavailable(!renderer)
      if (!renderer) return
      container.append(canvas)
      let frame = 0
      let visible = true
      let previous = performance.now()
      let centerX = 0.5
      let centerY = 0.5
      let targetX = 0.5
      let targetY = 0.5
      let strength = 0
      let targetStrength = 0
      const trail = new Float32Array(TRAIL_LENGTH * 2).fill(0.5)

      function schedule() {
        if (visible && !frame) {
          previous = performance.now()
          frame = requestAnimationFrame(draw)
        }
      }

      function draw(now: number) {
        frame = 0
        if (!renderer) return
        const frames = Math.min(MAX_DELTA, now - previous) / FRAME_TIME
        previous = now
        const ease = (rate: number) => 1 - (1 - rate) ** frames
        const follow = ease(CENTER_FOLLOW)
        centerX += (targetX - centerX) * follow
        centerY += (targetY - centerY) * follow
        strength += (targetStrength - strength) * ease(targetStrength ? STRENGTH_RISE : STRENGTH_FALL)

        for (let point = 0; point < TRAIL_LENGTH; point++) {
          const index = point * 2
          const rate = ease(TRAIL_FOLLOW - point * TRAIL_DECAY)
          const previousX = point === 0 ? centerX : trail[index - 2]
          const previousY = point === 0 ? centerY : trail[index - 1]
          trail[index] += (previousX - trail[index]) * rate
          trail[index + 1] += (previousY - trail[index + 1]) * rate
        }

        const moving = targetStrength > 0 || strength > REST_STRENGTH
        if (!moving) strength = 0
        renderer.draw(centerX, centerY, trail, strength, now / 1000)
        canvas.dataset.drawn = 'true'
        if (visible && moving) frame = requestAnimationFrame(draw)
      }

      function move(event: PointerEvent) {
        if (event.pointerType !== 'mouse') return
        const bounds = canvas.getBoundingClientRect()
        targetX = (event.clientX - bounds.left) / bounds.width
        targetY = 1 - (event.clientY - bounds.top) / bounds.height
        targetStrength = 1
        schedule()
      }

      function leave() {
        targetStrength = 0
        schedule()
      }

      function contextLost() {
        cancelAnimationFrame(frame)
        frame = 0
        visible = false
        canvas.remove()
        onUnavailable(true)
      }

      const resize = new ResizeObserver(([entry]) => {
        const pixelRatio = Math.min(devicePixelRatio, MAX_PIXEL_RATIO)
        canvas.width = Math.max(1, Math.round(entry.contentRect.width * pixelRatio))
        canvas.height = Math.max(1, Math.round(entry.contentRect.height * pixelRatio))
        schedule()
      })
      const intersection = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio > 0 && canvas.isConnected
        if (visible) schedule()
        else {
          cancelAnimationFrame(frame)
          frame = 0
          targetStrength = 0
        }
      })
      resize.observe(container)
      intersection.observe(hero)
      hero.addEventListener('pointermove', move)
      hero.addEventListener('pointerleave', leave)
      canvas.addEventListener('webglcontextlost', contextLost)

      return () => {
        cancelAnimationFrame(frame)
        resize.disconnect()
        intersection.disconnect()
        hero.removeEventListener('pointermove', move)
        hero.removeEventListener('pointerleave', leave)
        canvas.removeEventListener('webglcontextlost', contextLost)
        renderer.dispose()
        canvas.remove()
      }
    }

    let dispose: (() => void) | undefined
    const sync = () => {
      dispose?.()
      dispose = media.matches ? mount(container, hero) : undefined
    }
    sync()
    media.addEventListener('change', sync)
    return () => {
      media.removeEventListener('change', sync)
      dispose?.()
    }
  }, [image, section, onUnavailable])

  return <div className={styles.host} ref={host} aria-hidden="true" />
}
