const assetRoot = 'https://assets.uberdesigner.ai/dj-zak/'

const artistPortrait = '/images/looking-romance-duo.webp'

export const assets = {
  hero: artistPortrait,
  statement: artistPortrait,
  album: '/images/gridlock-hypnotics.webp',
  play: assetRoot + 'play.svg',
  playLarge: assetRoot + 'play-lg.svg',
}

export const artist = ['looking', 'romance'] as const
export const name = artist.join(' ')
export const hero = {
  subtitle: 'DIY Emo Duo',
  spec: '[ looking romance ]',
  notes: ['Some things only sound right', 'with the edges left on.'],
  schedule: 'Read the statement',
}
export const navigation = {
  menu: 'Menu',
  music: 'Music',
  links: [{ title: 'Statement', to: '/#statement' }, { title: 'Music', to: '/#release' }, { title: 'Members', to: '/members' }, { title: 'Live', to: '/#tour' }, { title: 'Merch', to: '/#merch' }],
}
export const statement = {
  kicker: '// Artist Statement',
  lines: [
    'There’s a rough edge',
    'to everything we love.',
    'The noise, the nerves,',
    'the words that come out wrong.',
    'We want to keep all of it.',
  ],
  note: ['looking romance is where we put', 'the things we can’t say cleanly.'],
  equipmentLabel: 'INFLUENCES',
  equipment: ['Emo', 'DIY'],
}
export const release = {
  kicker: '// Latest Release',
  date: "RELEASING MAY '26 // VINYL & DIGITAL",
  title: ['GRIDLOCK', 'HYPNOTICS'],
  format: '[LP]',
  caption: ['Listen to the band mix', 'Gridlock Hypnotics // 00:30'],
  cursor: ['Listen to', 'an excerpt'],
}
export const MAIN_THEME: string | null = '/audio/gridlock-hypnotics-band-mix.wav'
type Track = { title: string; seconds: number; duration: string; preview: string | null }
export const tracks: Track[] = [
  { title: 'Midnight Horizon (Original Mix)', seconds: 32, duration: '07:42', preview: '/audio/track-01.wav' },
  { title: 'Subterranean Cables (Dub)', seconds: 43, duration: '06:18', preview: '/audio/track-02.wav' },
  { title: 'Detroit Wire (Classic Echo Cut)', seconds: 40, duration: '08:05', preview: '/audio/track-03.wav' },
  { title: 'Dusty Faders (Studio Jam)', seconds: 42, duration: '05:51', preview: '/audio/track-04.wav' },
  { title: 'Echoes in the Grid (Live Edit)', seconds: 41, duration: '07:12', preview: '/audio/track-05.wav' },
  { title: 'Low Frequency Drift (Deep Mix)', seconds: 41, duration: '08:30', preview: '/audio/track-06.wav' },
  { title: 'Signal Loss (Reprise)', seconds: 44, duration: '04:22', preview: '/audio/track-07.wav' },
  { title: 'The Last Transmission (Outro)', seconds: 38, duration: '03:10', preview: '/audio/track-08.wav' },
  { title: 'Resonant Horizon (Extended Mix)', seconds: 39, duration: '09:44', preview: '/audio/track-09.wav' },
  { title: 'Static Pulse (Bonus Track)', seconds: 46, duration: '06:00', preview: '/audio/track-10.wav' },
]
export const tracklist = {
  label: 'Tracklist',
  kicker: 'TRACKLIST',
  columns: ['#', 'Track name', 'Excerpt', 'Duration'],
  live: "HEAR IT LIVE – SUMMER TOUR '26",
  schedule: 'View Schedule',
}
export const tour = {
  title: ['SPRING / SUMMER ', "TOUR '26"],
  kicker: '// TOUR DATES',
  columns: ['DATE', 'LOCATION', 'VENUE / SYSTEM SETUP', 'AVAILABILITY', 'REGISTRATION'],
  available: 'Available',
  soldOut: 'SOLD OUT',
  ticket: 'Get Ticket',
  disabled: 'Sold Out',
  footer: ['* General admission doors open at 22:00. Sound checking starts 2 hours prior.', 'DOCUMENT SYSTEM WIREFRAME V1.0 // ' + name.toUpperCase()],
}
const ticketEditions = {
  london: { code: 'LDN', localName: 'London · United Kingdom', language: 'en', motif: 'Underground lines' },
  berlin: { code: 'BER', localName: 'Berlin · Deutschland', language: 'de', motif: 'Brutalist geometry' },
  paris: { code: 'PAR', localName: 'Paris · France', language: 'fr', motif: 'Art Nouveau fan' },
  amsterdam: { code: 'AMS', localName: 'Amsterdam · Nederland', language: 'nl', motif: 'Dutch tulip' },
  chicago: { code: 'CHI', localName: 'Chicago · Illinois', language: 'en', motif: 'Lakefront skyline' },
  detroit: { code: 'DET', localName: 'Detroit · Michigan', language: 'en', motif: 'Motor City vinyl' },
  bangkok: { code: 'BKK', localName: 'กรุงเทพมหานคร · ประเทศไทย', language: 'th', motif: 'Thai prang silhouette' },
} as const

const tourStops = [
  { date: '12 MAY 2026', city: 'London, UK', venue: 'Halden Room', photo: 'london', soldOut: false },
  { date: '19 MAY 2026', city: 'Berlin, DE', venue: 'Ostkern (Basement)', photo: 'berlin', soldOut: false },
  { date: '05 JUN 2026', city: 'Paris, FR', venue: 'Salle Orbe', photo: 'paris', soldOut: false },
  { date: '12 JUN 2026', city: 'Amsterdam, NL', venue: 'Kade Vault', photo: 'amsterdam', soldOut: false },
  { date: '24 JUN 2026', city: 'Chicago, US', venue: 'Lowfield', photo: 'chicago', soldOut: false },
  { date: '02 JUL 2026', city: 'Detroit, US', venue: 'Relay Lounge', photo: 'detroit', soldOut: true },
  { date: '17 NOV 2026', city: 'Bangkok, TH', venue: 'Venue TBA', photo: 'bangkok', soldOut: false },
] as const

export const tourDates = tourStops.map(({ photo, ...date }) => ({
  ...date,
  photo: photo === 'bangkok' ? '/images/tour-bangkok.webp' : assetRoot + 'tour-' + photo + '.webp',
  edition: { id: photo, ...ticketEditions[photo] },
}))


export type MerchProduct = { title: string; detail: string; image: string; colors: string; swatch: string; anniversary?: true }
type MerchCategory = { title: string; products: MerchProduct[] }

export const merch = {
  title: 'Merch',
  status: 'Product previews · Orders not open yet',
  collection: 'View collection',
  close: 'Close',
  anniversary: '20th Anniversary',
  categories: [
    {
      title: 'CD',
      products: [
        { title: 'Gridlock Hypnotics', image: '/images/merch/cd-fractured-heart.webp', colors: 'Black / silver', swatch: '#343135', detail: 'Standard jewel case' },
        { title: 'Midnight Horizon', image: '/images/merch/cd-lunar-eclipse.webp', colors: 'Bone white / black', swatch: '#e5dbc5', detail: 'CD single · bone-white artwork' },
        { title: 'Signal Loss', image: '/images/merch/cd-newsprint.webp', colors: 'Charcoal / newsprint grey', swatch: '#555151', detail: 'Torn newspaper jewel case' },
        { title: 'The Last Transmission', image: '/images/merch/cd-radio-tower.webp', colors: 'Silver / charcoal', swatch: '#b6b8b9', detail: 'Live sessions · silver artwork' },
        { title: 'Gridlock Hypnotics XX', image: '/images/merch/cd-thorn-wreath-xx.webp', colors: 'Burgundy / antique gold', swatch: '#70283b', detail: 'Anniversary digipak', anniversary: true },
      ],
    },
    {
      title: 'Vinyl',
      products: [
        { title: 'Gridlock Hypnotics', image: '/images/merch/vinyl-fractured-heart.webp', colors: 'Black', swatch: '#333137', detail: '12-inch · black pressing' },
        { title: 'Echoes in the Grid', image: '/images/merch/vinyl-ghost-in-fog.webp', colors: 'Ivory', swatch: '#ebdec2', detail: '7-inch · bone-white edition' },
        { title: 'Detroit Wire', image: '/images/merch/vinyl-wire-mesh.webp', colors: 'Translucent smoke grey', swatch: '#77757d', detail: '7-inch · smoke edition' },
        { title: 'Static Pulse', image: '/images/merch/vinyl-lightning.webp', colors: 'Metallic silver', swatch: '#b2b9c5', detail: '12-inch · silver sleeve' },
        { title: 'Gridlock Hypnotics XX', image: '/images/merch/vinyl-fractured-crown-xx.webp', colors: 'Marbled blood red / black', swatch: '#a8253d', detail: '12-inch · anniversary blood-red edition', anniversary: true },
      ],
    },
    {
      title: 'T-shirts',
      products: [
        { title: 'Broken Heart Tee', image: '/images/merch/tee-broken-heart.webp', colors: 'Washed black / off-white', swatch: '#363133', detail: 'Washed black · front print' },
        { title: 'Midnight Tour Tee', image: '/images/merch/tee-midnight-tour.webp', colors: 'Bone white / black', swatch: '#e4d4b9', detail: 'Bone white · tour artwork' },
        { title: 'Signal Loss Tee', image: '/images/merch/tee-signal-loss.webp', colors: 'Charcoal / grey', swatch: '#514b50', detail: 'Charcoal · distressed print' },
        { title: 'Thornwork Tee', image: '/images/merch/tee-thornwork.webp', colors: 'Faded grey / black', swatch: '#89858a', detail: 'Thorn branch print' },
        { title: 'Afterimage Tee', image: '/images/merch/tee-afterimage.webp', colors: 'Black / crimson', swatch: '#9f3147', detail: 'Screaming rose print' },
      ],
    },
    {
      title: 'Keychains',
      products: [
        { title: 'Broken Heart', image: '/images/merch/keychain-broken-heart.webp', colors: 'Black / silver', swatch: '#363135', detail: 'Black enamel' },
        { title: 'Ghost Charm', image: '/images/merch/keychain-ghost.webp', colors: 'Ivory / silver', swatch: '#e8d9bc', detail: 'Bone-white enamel' },
        { title: 'Blackout Cassette', image: '/images/merch/keychain-cassette.webp', colors: 'Gunmetal', swatch: '#65626b', detail: 'Smoked gunmetal' },
        { title: 'Silver Thorn', image: '/images/merch/keychain-thorn.webp', colors: 'Brushed silver', swatch: '#b9b9be', detail: 'Brushed silver finish' },
        { title: 'Bleeding Heart', image: '/images/merch/keychain-anatomical-heart.webp', colors: 'Crimson / silver', swatch: '#a3233c', detail: 'Crimson enamel' },
      ],
    },
  ] satisfies MerchCategory[],
}
