import { useRef, useState } from 'react'
import type { CSSProperties, MouseEvent } from 'react'
import { name, tour, tourDates } from '../content'
import { useInView } from '../lib/useInView'
import { Letters } from './Letters'
import { AdmitOneTicket } from './ui/admit-one-ticket'
import styles from './Tour.module.css'

const LETTER_STEP = 50
const FIRST_ROW_DELAY = 160
const ROW_STEP = 85

export function Tour() {
  const { ref, visible } = useInView(0.5)
  const [selected, setSelected] = useState<(typeof tourDates)[number] | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)

  function openTicket(ticket: (typeof tourDates)[number]) {
    if (ticket.soldOut) return
    setSelected(ticket)
    dialog.current?.showModal()
  }

  function closeFromBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) event.currentTarget.close()
  }

  return (
    <section id="tour" ref={ref} className={styles.tour} data-visible={visible}>
      <div className={`frame ${styles.frame}`}>
        <h2 className={`trim-display ${styles.title}`} aria-label={tour.title.join('')}>
          <span><Letters word={tour.title[0]} step={LETTER_STEP} /></span>
          <span><Letters word={tour.title[1]} step={LETTER_STEP} start={tour.title[0].length * LETTER_STEP} /></span>
        </h2>
        <p className={`trim ${styles.kicker}`}>{tour.kicker}</p>
        <div className={styles.table} role="table" aria-label="Tour dates">
          <div className={`${styles.row} ${styles.header}`} role="row">
            {tour.columns.map((column) => <span className="trim" role="columnheader" key={column}>{column}</span>)}
          </div>
          {tourDates.map((event, index) => (
            <div className={styles.item} key={event.edition.id} style={{ '--delay': `${FIRST_ROW_DELAY + index * ROW_STEP}ms` } as CSSProperties}>
              <div className={styles.row} data-sold-out={event.soldOut} role="row">
                <span className={`trim ${styles.date}`} role="cell">{event.date}</span>
                <span className="trim" role="cell">{event.city}</span>
                <span className="trim" role="cell">{event.venue}</span>
                <span className={`trim ${styles.availability}`} role="cell">{event.soldOut ? tour.soldOut : tour.available}</span>
                <span className={styles.registration} role="cell">
                  <button className={styles.ticket} type="button" disabled={event.soldOut} onClick={() => openTicket(event)} aria-haspopup="dialog" aria-label={event.soldOut ? tour.disabled : `${tour.ticket} · ${event.city}`}>
                    <span className="trim">{event.soldOut ? tour.disabled : tour.ticket}</span>
                  </button>
                </span>
              </div>
              {event.photo && (
                <div className={styles.artwork} aria-hidden="true">
                  <img className={styles.photo} src={event.photo} alt="" loading="lazy" />
                </div>
              )}
            </div>
          ))}
        </div>
        <footer className={styles.footer}>{tour.footer.map((line) => <span className="trim" key={line}>{line}</span>)}</footer>
      </div>
      <dialog ref={dialog} className={styles.ticketDialog} aria-label="Tour ticket preview"
        onClick={closeFromBackdrop} onClose={() => setSelected(null)}>
        <div className={styles.ticketPanel}>
          <div className={styles.ticketHeader}>
            <p>Ticket preview</p>
            <form method="dialog"><button type="submit" autoFocus>Close</button></form>
          </div>
          {selected && <AdmitOneTicket name={name} presenter={tour.title.join('')} event={selected.edition.id === 'bangkok' ? 'Live in Bangkok, TH' : selected.city}
            venue={selected.venue} dates={selected.date} stubText="Admit one" edition={selected.edition} cityImage={selected.photo} />}
        </div>
      </dialog>
    </section>
  )
}
