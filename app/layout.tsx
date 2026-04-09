import type { Metadata, Viewport } from 'next'
import { Inter, Syne, Space_Grotesk } from 'next/font/google'
import { GoogleTagManager } from '@next/third-parties/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { ScrollToTop } from '@/components/scroll-to-top'
import { AnimationProvider } from '@/components/animation-provider'
import { CookieConsent } from '@/components/cookie-consent'
import { MobileBottomNav } from '@/components/mobile-bottom-nav'
import { ThemeProvider } from '@/components/theme-provider'

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

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
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
    <html lang="en" className={`${inter.variable} ${syne.variable} ${spaceGrotesk.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          id="gtm-consent-default"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              
              var consentState = {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'wait_for_update': 500
              };

              try {
                var stored = localStorage.getItem('cookie_consent');
                if (stored) {
                  var parsed = JSON.parse(stored);
                  if (parsed.analytics_storage) {
                    consentState.analytics_storage = parsed.analytics_storage;
                  }
                  if (parsed.ad_storage) {
                    consentState.ad_storage = parsed.ad_storage;
                    consentState.ad_user_data = parsed.ad_storage;
                    consentState.ad_personalization = parsed.ad_storage;
                  }
                }
              } catch (e) {}

              gtag('consent', 'default', consentState);
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <GoogleTagManager gtmId="GTM-KKXR4DTX" />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AnimationProvider>
            {children}
          </AnimationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
