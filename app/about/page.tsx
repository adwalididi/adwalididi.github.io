import { Metadata } from "next"
import { AboutHero } from "@/components/about/about-hero"
import { OurStory } from "@/components/about/our-story"
import { WhatMakesUsDifferent } from "@/components/about/what-makes-us-different"
import { AboutCTA } from "@/components/about/about-cta"

export const metadata: Metadata = {
  title: "About Us | Ad Wali Didi",
  description: "The story behind Ad Wali Didi — started to help Indian small businesses who were invisible online. Human, warm, and results-driven.",
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurStory />
      <WhatMakesUsDifferent />
      <AboutCTA />
    </>
  )
}
