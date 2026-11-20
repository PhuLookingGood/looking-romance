import { useRef, useState } from 'react'
import { merch } from '../content'
import SneakerProductHero from './ui/sneaker-product-hero'
import { useInView } from '../lib/useInView'
import styles from './Merch.module.css'

type Category = (typeof merch.categories)[number]

export function Merch() {
  const [selected, setSelected] = useState<Category | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const { ref, visible } = useInView(0.15)

  function openCategory(category: Category) {
    setSelected(category)
    dialog.current?.showModal()
  }

  return (
    <section id="merch" ref={ref} data-visible={visible} className={styles.section} aria-labelledby="merch-title">
      <div className={`frame ${styles.frame}`}>
        <header className={styles.header}>
          <h2 id="merch-title">{merch.title}</h2>
          <p>{merch.status}</p>
        </header>
        <ul className={styles.products}>
          {merch.categories.map((category) => (
            <li className={styles.product} key={category.title}>
              <button className={styles.category} type="button" aria-haspopup="dialog" onClick={() => openCategory(category)}>
                <span className={styles.image}><img src={category.products[0].image} alt="" width={276} height={276} loading="lazy" /></span>
                <span className={styles.details}>
                  <strong>{category.title}</strong>
                  <span>{merch.collection} · {category.products.length}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <dialog ref={dialog} className={styles.dialog} aria-labelledby="merch-category-title"
        onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close() }}>
        <div className={styles.collection}>
          <header className={styles.collectionHeader}>
            <h2 id="merch-category-title">{selected?.title}</h2>
            <form method="dialog"><button type="submit" autoFocus>{merch.close}</button></form>
          </header>
          {selected && <SneakerProductHero key={selected.title} category={selected.title} products={selected.products} />}
        </div>
      </dialog>
    </section>
  )
}
