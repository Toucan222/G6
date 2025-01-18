import { MantineProvider, ColorSchemeScript } from '@mantine/core'
import '@mantine/core/styles.css'

export const metadata = {
  title: 'FlashRank - Discovery, not search',
  description: 'Transform your learning with interactive cards and intelligent rankings.',
  keywords: 'flashcards, learning, AI, education, ranking, comparison',
  openGraph: {
    title: 'FlashRank - Discovery, not search',
    description: 'Transform your learning with interactive cards and intelligent rankings.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  )
}
