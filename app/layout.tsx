import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Providers } from '@/core/providers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AIAssistant } from '@/ai/components/AIAssistant'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { siteConfig } from '@/config/site'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

export const viewport: Viewport = {
  themeColor: '#00d4ff',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.author.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  keywords: ['Full Stack Developer', 'React', 'Next.js', 'Python', 'FastAPI', 'Software Engineer', 'Pune', 'India'],
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.author.name,
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.title }],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@dineshgaikwad',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: siteConfig.url },
  verification: {
    google: 'PXxBRZsdPNVLxeHXH8ZGDmHU5gzNku_rgsEVhCG7Y_c',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${mono.variable}`}>
        <Providers>
          <CustomCursor />
          <CommandPalette />
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
          <AIAssistant />
        </Providers>
      </body>
    </html>
  )
}
