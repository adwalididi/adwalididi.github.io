"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { blogPosts } from "@/lib/blog-data"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import { m } from "framer-motion"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"

export function BlogContent() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <>
      {/* Blog Hero */}
      <section className="pt-32 pb-8 sm:pt-40 sm:pb-12 bg-teal-tint">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-[var(--font-syne)] text-4xl sm:text-5xl lg:text-6xl font-bold text-near-black leading-tight">
              Blog
            </h1>
          </m.div>
          <m.p 
            className="mt-6 text-lg sm:text-xl text-muted-text max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Real marketing advice for Indian businesses. No jargon, no fluff — just things that actually work.
          </m.p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {blogPosts.map((post, index) => (
              <m.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-teal-border hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-near-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-teal-tint text-teal"
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
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog CTA */}
      <section className="py-16 sm:py-20 bg-deep-teal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-[var(--font-syne)] text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Want these strategies applied to your business?
            </h2>
            <p className="mt-4 text-white-70 text-lg max-w-2xl mx-auto">
              Reading about it is one thing. Having someone do it for you is another.
            </p>
            <m.a
              href="https://wa.me/916261643774?text=Hi!%20I%20read%20your%20blog%20and%20I'd%20like%20to%20discuss%20marketing%20for%20my%20business."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gold text-near-black px-8 py-4 rounded-full font-medium text-lg hover:bg-darker-gold transition-all hover:scale-105 shadow-lg mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <WhatsAppIcon size={20} />
              WhatsApp Us — Let&apos;s Talk
            </m.a>
          </m.div>
        </div>
      </section>
    </>
  )
}
