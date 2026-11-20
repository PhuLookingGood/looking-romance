import { name, navigation } from '../content'
import WildHuntFooter from './ui/wild-hunt-footer'

const footerColumns = [
  { title: 'Artist', links: [{ label: 'Home', href: '/' }, ...navigation.links.slice(0, 3).map(({ title, to }) => ({ label: title, href: to }))] },
  { title: 'Shows & Merch', links: navigation.links.slice(3).map(({ title, to }) => ({ label: title, href: to })) },
]

export function SiteFooter() {
  return (
    <WildHuntFooter
      wordmark={name}
      columns={footerColumns}
      tagline="Some things only sound right with the edges left on."
      sideNote=""
      legal={`© ${name}`}
      colophon="Åsgårdsreien (The Wild Hunt of Odin), Peter Nicolai Arbo, 1872. Nasjonalmuseet, Oslo. Public domain."
      palette={{ background: '#830e14', ink: '#f4efe5' }}
      height="clamp(540px, 100svh, 920px)"
    />
  )
}
