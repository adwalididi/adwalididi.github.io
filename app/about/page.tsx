import { Metadata } from "next"
import { AboutHero } from "@/components/about/about-hero"
import { OurStory } from "@/components/about/our-story"
import { WhatMakesUsDifferent } from "@/components/about/what-makes-us-different"
import { AboutCTA } from "@/components/about/about-cta"

export const metadata: Metadata = {
  title: "About Us | Ad Wali Didi — Indian Digital Marketing Agency",
  description: "Ad Wali Didi started to help Indian small businesses become visible online. Our story, our approach, and why we do this.",
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
