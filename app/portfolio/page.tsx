import { Metadata } from "next"
import { PortfolioHero } from "@/components/portfolio/portfolio-hero"
import { PortfolioStats } from "@/components/portfolio/portfolio-stats"
import { FeaturedCaseStudy } from "@/components/portfolio/featured-case-study"
import { CaseStudies } from "@/components/portfolio/case-studies"
import { PortfolioCTA } from "@/components/portfolio/portfolio-cta"

export const metadata: Metadata = {
  title: "Our Work & Results | Ad Wali Didi",
  description: "Real results for real businesses. 150+ enquiries for a travel startup, 550 leads for a construction business. See our case studies.",
}

export default function PortfolioPage() {
  return (
    <>
      <PortfolioHero />
      <PortfolioStats />
      <FeaturedCaseStudy />
      <CaseStudies />
      <PortfolioCTA />
    </>
  )
}
