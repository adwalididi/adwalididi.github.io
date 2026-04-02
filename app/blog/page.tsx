import { Metadata } from "next"
import { BlogContent } from "@/components/blog/blog-content"

export const metadata: Metadata = {
  title: "Blog | Digital Marketing Tips for Indian Businesses — Ad Wali Didi",
  description: "Practical digital marketing tips, guides, and insights for Indian small businesses. Google Ads, Meta Ads, GBP optimisation, and more — no jargon, just real advice.",
  alternates: {
    canonical: '/blog/',
  },
  openGraph: {
    title: 'Blog | Digital Marketing Tips for Indian Businesses — Ad Wali Didi',
    description: 'Practical digital marketing tips and insights for Indian small businesses. No jargon, just real advice.',
    url: '/blog/',
    images: [{ url: 'og-blog.webp', width: 1200, height: 630, alt: 'Digital Marketing Blog — Ad Wali Didi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Digital Marketing Tips for Indian Businesses',
    description: 'Practical digital marketing tips and insights for Indian small businesses.',
    images: ['og-blog.webp'],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Blog",
      "name": "Ad Wali Didi Blog",
      "description": "Digital marketing tips and insights for Indian small businesses.",
      "url": "https://adwalididi.com/blog",
      "publisher": {
        "@type": "Organization",
        "name": "Ad Wali Didi",
        "logo": "https://adwalididi.com/logo-dark.webp"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://adwalididi.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://adwalididi.com/blog"
        }
      ]
    }
  ]
}

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogContent />
    </>
  )
}
