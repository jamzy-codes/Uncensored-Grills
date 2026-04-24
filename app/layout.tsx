import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Unchained Grills — Human Intelligence Inside Web3',
  description:
    'Uncensored conversations with the builders, founders, and thinkers shaping Web3. No filters. No safety nets. Just intelligence under pressure. Hosted by Dipo.',
  openGraph: {
    title: 'Unchained Grills',
    description: 'Human intelligence inside Web3. Hosted by Dipo.',
    images: ['/images/logo.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@the_grillers',
    creator: '@0xDipo',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo.jpg" type="image/jpeg" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
