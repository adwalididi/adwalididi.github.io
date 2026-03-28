import { Metadata } from "next"
import Link from "next/link"
import { blogPosts } from "@/lib/blog-data"
import { ArrowRight, Calendar, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog | Digital Marketing Tips for Indian Businesses — Ad Wali Didi",
  description: "Practical digital marketing tips, guides, and insights for Indian small businesses. Google Ads, Meta Ads, GBP optimisation, and more — no jargon, just real advice.",
  alternates: {
    canonical: 'https://adwalididi.github.io/blog',
  },
}

export default function BlogPage() {
  return (
    <>
      {/* Blog Hero */}
      <section className="pt-32 pb-8 sm:pt-40 sm:pb-12 bg-teal-tint">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-[var(--font-syne)] text-4xl sm:text-5xl lg:text-6xl font-bold text-near-black leading-tight">
            Blog
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-text max-w-2xl mx-auto leading-relaxed">
            Real marketing advice for Indian businesses. No jargon, no fluff — just things that actually work.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {blogPosts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                style={{ border: '0.5px solid #C8E8E3' }}
              >
                {/* Category Badge */}
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                      style={{ backgroundColor: '#00857315', color: '#008573' }}
                    >
                      {post.category}
                    </span>
                  </div>

                  <h2 className="font-[var(--font-syne)] text-lg sm:text-xl font-bold text-near-black leading-snug group-hover:text-teal transition-colors">
                    {post.title}
                  </h2>

                  <p className="mt-3 text-muted-text text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-text">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {post.readingTime}
                      </span>
                    </div>
                    <ArrowRight size={16} className="text-teal opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog CTA */}
      <section className="py-16 sm:py-20 bg-deep-teal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-[var(--font-syne)] text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Want these strategies applied to your business?
          </h2>
          <p className="mt-4 text-white/70 text-lg max-w-2xl mx-auto">
            Reading about it is one thing. Having someone do it for you is another.
          </p>
          <a
            href="https://wa.me/916261643774?text=Hi!%20I%20read%20your%20blog%20and%20I'd%20like%20to%20discuss%20marketing%20for%20my%20business."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gold text-near-black px-8 py-4 rounded-full font-medium text-lg hover:bg-[#c49b2e] transition-all hover:scale-105 shadow-lg mt-8"
          >
            WhatsApp Us — Let&apos;s Talk
          </a>
        </div>
      </section>
    </>
  )
}
