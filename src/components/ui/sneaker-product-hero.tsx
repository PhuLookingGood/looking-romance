import { useId, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import gsap from 'gsap'
import { merch } from '../../content'
import type { MerchProduct } from '../../content'
import styles from './sneaker-product-hero.module.css'

type Props = {
  category: string
  products: readonly MerchProduct[]
}

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

export default function SneakerProductHero({ category, products }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState<number | null>(null)
  const [zoomed, setZoomed] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const photo = useRef<HTMLImageElement>(null)
  const outgoing = useRef<HTMLImageElement>(null)
  const headline = useRef<HTMLSpanElement>(null)
  const imageId = useId()
  const product = products[activeIndex]
  const previous = previousIndex === null ? undefined : products[previousIndex]
  const liked = Boolean(product && favorites.includes(product.image))

  useLayoutEffect(() => {
    if (matchMedia(REDUCED_MOTION).matches) return
    const context = gsap.context(() => {
      if (photo.current) {
        gsap.fromTo(photo.current, { yPercent: 24, rotation: 7, opacity: 0 },
          { yPercent: 0, rotation: 0, opacity: 1, duration: 0.65, ease: 'back.out(1.15)', clearProps: 'transform' })
      }
      if (outgoing.current) {
        gsap.fromTo(outgoing.current, { yPercent: 0, rotation: 0, opacity: 1 },
          { yPercent: -24, rotation: -7, opacity: 0, duration: 0.28, ease: 'power2.in' })
      }
      if (headline.current) {
        gsap.fromTo(headline.current, { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' })
      }
    })
    return () => context.revert()
  }, [activeIndex])

  if (!product) return null
  const selectedProduct = product

  function select(index: number) {
    if (index === activeIndex) return
    setPreviousIndex(activeIndex)
    setActiveIndex(index)
    setZoomed(false)
  }

  function movePointer(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType === 'touch') return
    const element = event.currentTarget
    const bounds = element.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height
    element.style.setProperty('--photo-origin', `${x * 100}% ${y * 100}%`)
    if (matchMedia(REDUCED_MOTION).matches) return
    element.style.setProperty('--photo-rx', `${(0.5 - y) * 10}deg`)
    element.style.setProperty('--photo-ry', `${(x - 0.5) * 16}deg`)
  }

  function toggleFavorite() {
    setFavorites((saved) => saved.includes(selectedProduct.image)
      ? saved.filter((image) => image !== selectedProduct.image)
      : [...saved, selectedProduct.image])
  }

  return (
    <div className={styles.hero} style={{ '--product-tint': product.swatch } as CSSProperties}>
      <div className={styles.info} aria-live="polite">
        <p className={styles.kicker}>{category}</p>
        <h3>{product.title}</h3>
        <p className={styles.description}>{product.detail}</p>
        {product.anniversary && <p className={styles.anniversary}>{merch.anniversary}</p>}
      </div>
      <div className={styles.stage}>
        <span ref={headline} key={product.image} className={styles.backdropWord} aria-hidden="true">
          {product.anniversary ? 'XX' : category}
        </span>
        <button className={styles.photoButton} type="button" data-zoom={zoomed}
          aria-label={zoomed ? 'Zoom out of product photo' : 'Zoom in on product photo'}
          aria-pressed={zoomed} aria-controls={imageId} onClick={() => setZoomed(!zoomed)}
          onPointerMove={movePointer} onPointerLeave={(event) => event.currentTarget.removeAttribute('style')}>
          {previous && <img ref={outgoing} key={`out-${previous.image}`} className={styles.outgoing} src={previous.image} alt="" aria-hidden="true" />}
          <span id={imageId} className={styles.photo}>
            <img ref={photo} key={product.image} src={product.image} alt={`${product.title} · ${product.colors}`} draggable={false} />
          </span>
          <span className={styles.zoom}>{zoomed ? '−' : '+'}</span>
        </button>
      </div>
      <div className={styles.options}>
        <p className={styles.kicker}>Color</p>
        <p className={styles.color}>{product.colors}</p>
        <div className={styles.variants} role="group" aria-label={`${category} editions`}>
          {products.map((edition, index) => (
            <button key={edition.image} className={styles.swatch} type="button"
              style={{ '--swatch': edition.swatch } as CSSProperties} aria-pressed={index === activeIndex}
              aria-label={`${edition.title}, ${edition.colors}`} onClick={() => select(index)} />
          ))}
        </div>
        <div className={styles.thumbnails} role="group" aria-label="Product photos">
          {products.map((edition, index) => (
            <button key={edition.image} type="button" aria-pressed={index === activeIndex}
              aria-label={`Show ${edition.title}`} onClick={() => select(index)}>
              <img src={edition.image} alt="" width={276} height={276} />
            </button>
          ))}
        </div>
        <button className={styles.favorite} type="button" aria-pressed={liked} onClick={toggleFavorite}>
          <span aria-hidden="true" key={String(liked)}>{liked ? '♥' : '♡'}</span>
          {liked ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  )
}
