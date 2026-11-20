'use client'

import { useId, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import styles from './team-member-card.module.css'

interface TeamMemberCardProps {
  position?: 'left' | 'right'
  jobPosition?: string
  firstName: string
  lastName?: string
  imageUrl: string
  description?: string
  className?: string
}

const entranceEase = [0.22, 1, 0.36, 1] as const

export default function TeamMemberCard({
  position = 'left',
  jobPosition,
  firstName,
  lastName,
  imageUrl,
  description,
  className,
}: TeamMemberCardProps) {
  const [isBioOpen, setIsBioOpen] = useState(true)
  const bioId = useId()
  const reduceMotion = useReducedMotion()
  const fullName = [firstName, lastName].filter(Boolean).join(' ')

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: entranceEase }}
      className={twMerge(clsx(styles.card, className))}
      data-position={position}
    >
      {jobPosition && <p className={styles.role}>{jobPosition}</p>}
      <div className={styles.layout}>
        <motion.div
          className={styles.portrait}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: entranceEase }}
        >
          <img src={imageUrl} alt={fullName} />
        </motion.div>
        <motion.div
          className={styles.info}
          initial={reduceMotion ? false : { opacity: 0, x: position === 'left' ? 32 : -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: entranceEase }}
        >
          <h2 className={styles.name}>{firstName}{lastName && <span>{lastName}</span>}</h2>
          {description && (
            <div className={styles.details}>
              <button
                type="button"
                className={styles.toggle}
                aria-label={`${isBioOpen ? 'Hide' : 'Show'} bio for ${fullName}`}
                aria-expanded={isBioOpen}
                aria-controls={bioId}
                onClick={() => setIsBioOpen(open => !open)}
              >
                <ArrowRight size={22} aria-hidden="true" />
              </button>
              <p id={bioId} className={styles.bio} hidden={!isBioOpen}>{description}</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.article>
  )
}
