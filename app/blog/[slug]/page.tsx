import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { blogPosts, getBlogPost, getAllBlogSlugs } from "@/lib/blog-data"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"
import { BlogPostContent } from "./blog-post-content"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return { title: "Post Not Found" }

  return {
    title: `${post.title} — Ad Wali Didi Blog`,
    description: post.metaDescription,
    keywords: post.keywords,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.metaDescription,
      url: `https://adwalididi.github.io/blog/${post.slug}`,
      siteName: 'Ad Wali Didi',
      publishedTime: post.date,
      authors: ['Ad Wali Didi'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription,
    },
    alternates: {
      canonical: `https://adwalididi.github.io/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  // Get related posts (same category, different slug)
  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.metaDescription,
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": "Ad Wali Didi",
      "url": "https://adwalididi.github.io",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ad Wali Didi",
      "logo": {
        "@type": "ImageObject",
        "url": "https://adwalididi.github.io/logo-dark.webp",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://adwalididi.github.io/blog/${post.slug}`,
    },
    "keywords": post.keywords.join(", "),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Article Hero */}
      <section className="pt-32 pb-8 sm:pt-40 sm:pb-12 bg-teal-tint">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-text hover:text-teal transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Back to Blog
          </Link>

          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ backgroundColor: '#00857315', color: '#008573' }}
          >
            {post.category}
          </span>

          <h1 className="font-[var(--font-syne)] text-3xl sm:text-4xl lg:text-5xl font-bold text-near-black leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 mt-6 text-sm text-muted-text">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.readingTime}
            </span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogPostContent content={post.content} />

          {/* CTA After Article */}
          <div
            className="mt-12 bg-teal-tint rounded-2xl p-6 sm:p-8"
            style={{ border: '0.5px solid #C8E8E3' }}
          >
            <p className="font-[var(--font-syne)] text-xl sm:text-2xl font-bold text-near-black mb-4">
              Need help implementing this for your business?
            </p>
            <p className="text-muted-text mb-6">
              We handle Google Business Profile, Paid Ads, and Ad Creatives for Indian small businesses. WhatsApp us for a free audit.
            </p>
            <a
              href="https://wa.me/916261643774?text=Hi!%20I%20read%20your%20blog%20and%20I'd%20like%20to%20discuss%20marketing%20for%20my%20business."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gold text-near-black px-6 py-3 rounded-full font-medium hover:bg-[#c49b2e] transition-all hover:scale-105"
            >
              <WhatsAppIcon size={18} />
              WhatsApp Us — It&apos;s Free
            </a>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 sm:py-16 bg-teal-tint">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-[var(--font-syne)] text-2xl sm:text-3xl font-bold text-near-black text-center mb-10">
              Keep Reading
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300"
                  style={{ border: '0.5px solid #C8E8E3' }}
                >
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3"
                    style={{ backgroundColor: '#00857315', color: '#008573' }}
                  >
                    {relatedPost.category}
                  </span>
                  <h3 className="font-[var(--font-syne)] text-lg font-bold text-near-black group-hover:text-teal transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-text line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
