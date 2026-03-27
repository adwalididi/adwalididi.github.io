import Link from "next/link"
import dynamic from "next/dynamic"
import { HeroSection } from "@/components/home/hero-section"
import { StatsBar } from "@/components/home/stats-bar"
import { ServicesOverview } from "@/components/home/services-overview"
import { OurProcess } from "@/components/home/our-process"

const WhyUs = dynamic(() => import("@/components/home/why-us").then(mod => mod.WhyUs))
const PortfolioPreview = dynamic(() => import("@/components/home/portfolio-preview").then(mod => mod.PortfolioPreview))
const Testimonial = dynamic(() => import("@/components/home/testimonial").then(mod => mod.Testimonial))
const CTASection = dynamic(() => import("@/components/home/cta-section").then(mod => mod.CTASection))

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <ServicesOverview />
      <OurProcess />
      <WhyUs />
      <PortfolioPreview />
      <Testimonial />
      <CTASection />
    </>
  )
}
