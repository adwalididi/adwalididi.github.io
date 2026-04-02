import type { Metadata, Viewport } from 'next'
import { Inter, Syne } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { ScrollToTop } from '@/components/scroll-to-top'
import { AnimationProvider } from '@/components/animation-provider'

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
  metadataBase: new URL('https://adwalididi.com/'),
  title: 'Ad Wali Didi | Google Ads, Meta Ads & Ad Creatives for Indian Businesses',
  description: 'We help Indian businesses get more enquiries through Google Business Profile, Meta Ads, and Ad Creatives. 150+ enquiries generated in Month 1 for a travel startup.',
  keywords: ['digital marketing', 'Google Ads', 'Meta Ads', 'Google Business Profile', 'Indian businesses', 'local marketing', 'Ad Creatives'],
  icons: {
    icon: [{ url: '/favicon.png', sizes: '64x64' }],
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://adwalididi.com/',
    siteName: 'Ad Wali Didi',
    title: 'Ad Wali Didi | Google Ads, Meta Ads & Ad Creatives for Indian Businesses',
    description: 'We help Indian businesses get more enquiries through Google Business Profile, Meta Ads, and Ad Creatives. 150+ enquiries generated in Month 1 for a travel startup.',
    images: [{ url: 'og-home.webp', width: 1200, height: 630, alt: 'Ad Wali Didi — Digital Marketing for Indian Businesses' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ad Wali Didi | Google Ads, Meta Ads & Ad Creatives for Indian Businesses',
    description: 'We help Indian businesses get more enquiries through Google Business Profile, Meta Ads, and Ad Creatives.',
    images: ['og-home.webp'],
  },
  alternates: {
    canonical: '/',
  },
}

export const viewport: Viewport = {
  themeColor: '#008573',
  width: 'device-width',
  initialScale: 1,
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Ad Wali Didi",
  "description": "Digital marketing agency for Indian small businesses. Google Ads, Meta Ads, Google Business Profile management, and Ad Creatives.",
  "url": "https://adwalididi.com",
  "logo": "https://adwalididi.com/logo-dark.webp",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-6261643774",
    "email": "adwalididi@gmail.com",
    "contactType": "customer service",
    "availableLanguage": ["English", "Hindi"]
  },
  "sameAs": [
    "https://www.facebook.com/adwalididi",
    "https://www.instagram.com/adwalididi",
    "https://www.linkedin.com/company/112985325"
  ],
  "areaServed": {
    "@type": "Country",
    "name": "India"
  },
  "serviceType": [
    "Google Business Profile Management",
    "Google Ads Management",
    "Meta Ads Management",
    "Ad Creative Design"
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-57N60F5L40"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-57N60F5L40');
            `
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "w4dj594vj3");
            `
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-white text-near-black">
        <AnimationProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
          <ScrollToTop />
        </AnimationProvider>
      </body>
    </html>
  )
}
