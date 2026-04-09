import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { ScrollToTop } from '@/components/scroll-to-top'
import { CookieConsent } from '@/components/cookie-consent'
import { MobileBottomNav } from '@/components/mobile-bottom-nav'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Force light theme on all public pages — dark mode is admin-only
    <div className="light" data-theme="light">
      <Navbar />
      <div className="pb-16 md:pb-0">
        <main>{children}</main>
        <Footer />
      </div>
      <WhatsAppButton />
      <ScrollToTop />
      <CookieConsent />
      <MobileBottomNav />
    </div>
  )
}
