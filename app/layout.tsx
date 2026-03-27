import type { Metadata, Viewport } from 'next'
import { Inter, Syne } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const syne = Syne({ 
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ad Wali Didi | Google Ads, Meta Ads & Ad Creatives for Indian Businesses',
  description: 'We help Indian businesses get more enquiries through Google Business Profile, Meta Ads, and Ad Creatives. 150+ enquiries generated in Month 1 for a travel startup.',
  keywords: ['digital marketing', 'Google Ads', 'Meta Ads', 'Google Business Profile', 'Indian businesses', 'local marketing', 'Ad Creatives'],
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#008573',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`} data-scroll-behavior="smooth">
      <body className="font-sans antialiased bg-white text-near-black">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <Analytics />
      </body>
    </html>
  )
}
