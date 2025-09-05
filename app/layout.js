import { Inter } from 'next/font/google'
import './globals.css'
import { GoogleTagManager } from '@next/third-parties/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Miastenia Gravis - Campanha de Conscientização',
  description: 'Conhecimento, Apoio e Esperança',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Preload dos assets críticos para melhor performance no Kiosker.IO */}
        <link rel="preload" href="/images/thumb-video-hero.webp" as="image" />
        <link rel="preload" href="/video/miastenia-gravis-hero.webm" as="video" />
        <link rel="preload" href="/audio/guilherme.mp3" as="audio" />
        <link rel="preload" href="/audio/kenia.mp3" as="audio" />
        <link rel="preload" href="/video/miastenia-gravis.webm" as="video" />
        
        {/* Preload dos logos das associações */}
        <link rel="preload" href="/images/logo-AMMI.webp" as="image" />
        <link rel="preload" href="/images/logo-abrami.webp" as="image" />
        <link rel="preload" href="/images/logo-afag.webp" as="image" />
        <link rel="preload" href="/images/logo-casahunter.webp" as="image" />
        <link rel="preload" href="/images/qr-code.png" as="image" />
        
        {/* Meta tags para cache otimizado */}
        <meta httpEquiv="Cache-Control" content="public, max-age=31536000" />
      </head>
      <GoogleTagManager gtmId="GTM-MP68RWNM" />
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}