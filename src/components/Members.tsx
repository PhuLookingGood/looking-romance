import { Nav, ScrollNav } from './Nav'
import { SiteFooter } from './SiteFooter'
import TeamMemberCard from './ui/team-member-card'
import styles from './Members.module.css'

export function Members() {
  return (
    <>
      <main className={styles.page} id="top">
        <Nav />
        <header className={styles.header} id="members-header">
          <h1>Members</h1>
          <p>DIY Emo Duo</p>
        </header>
        <div className={styles.roster}>
          <TeamMemberCard
            firstName="Member"
            lastName="01"
            position="left"
            imageUrl="/images/looking-romance-portrait.webp"
            description="The blond member of looking romance."
          />
          <TeamMemberCard
            firstName="Member"
            lastName="02"
            position="right"
            imageUrl="/images/looking-romance-red-portrait.webp"
            description="The red-haired member of looking romance."
          />
        </div>
      </main>
      <ScrollNav thresholdId="members-header" />
      <SiteFooter />
    </>
  )
}
