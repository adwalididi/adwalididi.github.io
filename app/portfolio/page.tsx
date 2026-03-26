import { Metadata } from "next"
import { PortfolioHero } from "@/components/portfolio/portfolio-hero"
import { FeaturedCaseStudy } from "@/components/portfolio/featured-case-study"
import { CaseStudies } from "@/components/portfolio/case-studies"
import { PortfolioCTA } from "@/components/portfolio/portfolio-cta"

export const metadata: Metadata = {
  title: "Our Work | Ad Wali Didi",
  description: "See real results from real businesses. 150+ enquiries in month 1 for a travel startup — and we're just getting started.",
}

export default function PortfolioPage() {
  return (
    <>
      <PortfolioHero />
      <FeaturedCaseStudy />
      <CaseStudies />
      <PortfolioCTA />
    </>
  )
}
