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
        {/* Preload apenas das imagens críticas (vídeos e áudios são pré-carregados via fetch) */}
        <link rel="preload" href="/images/thumb-video-hero.webp" as="image" />
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