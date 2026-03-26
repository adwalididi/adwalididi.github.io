import Link from "next/link"
import { HeroSection } from "@/components/home/hero-section"
import { StatsBar } from "@/components/home/stats-bar"
import { ServicesOverview } from "@/components/home/services-overview"
import { WhyUs } from "@/components/home/why-us"
import { PortfolioPreview } from "@/components/home/portfolio-preview"
import { Testimonial } from "@/components/home/testimonial"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <ServicesOverview />
      <WhyUs />
      <PortfolioPreview />
      <Testimonial />
      <CTASection />
    </>
  )
}
