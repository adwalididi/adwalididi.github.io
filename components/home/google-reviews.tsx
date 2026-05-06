"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { REVIEWS_DATA as reviewsData } from "@/lib/reviews-registry"

/* ─── Types ──────────────────────────────────────────────────── */
interface Review {
  author: string
  photoUri: string
  rating: number
  text: string
  relativeTime: string
  publishTime: string
}

/* ─── Google "G" SVG Logo ────────────────────────────────────── */
function GoogleLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

/* ─── Star Rating ────────────────────────────────────────────── */
function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 20 20"
          aria-hidden="true"
          fill={i < rating ? "#FBBC05" : "#D1D5DB"}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

/* ─── Avatar with fallback initials ─────────────────────────── */
function ReviewerAvatar({ author, photoUri }: { author: string; photoUri: string }) {
  const [imgError, setImgError] = useState(false)
  const initials = author
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  if (imgError || !photoUri) {
    return (
      <div className="w-11 h-11 rounded-full bg-teal flex items-center justify-center text-white font-semibold text-sm shrink-0">
        {initials}
      </div>
    )
  }

  return (
    <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 ring-2 ring-teal-border">
      <Image
        src={photoUri}
        alt={author}
        width={44}
        height={44}
        className="object-cover"
        onError={() => setImgError(true)}
        unoptimized
      />
    </div>
  )
}

/* ─── Single Review Card ─────────────────────────────────────── */
function ReviewCard({ review, onClick }: { review: Review; onClick: () => void }) {
  const hasText = review.text.trim().length > 0
  const truncated = review.text.length > 160
  const displayText = truncated ? review.text.slice(0, 157) + "…" : review.text

  return (
    <article
      onClick={hasText ? onClick : undefined}
      className={`group flex flex-col gap-4 bg-white/80 backdrop-blur-xl border border-teal-border rounded-2xl p-6 shadow-sm w-80 shrink-0 transition-all duration-300 ${hasText ? "cursor-pointer hover:shadow-[0_8px_32px_rgba(0,133,115,0.15)] hover:-translate-y-1 hover:border-teal/40" : "cursor-default"}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <ReviewerAvatar author={review.author} photoUri={review.photoUri} />
          <div className="min-w-0">
            <p className="font-semibold text-near-black text-sm leading-snug truncate">{review.author}</p>
            <p className="text-muted-text text-xs mt-0.5">{review.relativeTime}</p>
          </div>
        </div>
        <GoogleLogo className="w-5 h-5 shrink-0 opacity-80 mt-0.5" />
      </div>

      {/* Stars */}
      <StarRating rating={review.rating} size={15} />

      {/* Text */}
      {hasText ? (
        <p className="text-muted-text text-sm leading-relaxed flex-1">
          {displayText}
          {truncated && (
            <span className="text-teal font-medium ml-1 group-hover:underline">Read more</span>
          )}
        </p>
      ) : (
        <p className="text-muted-text/60 text-sm italic">5-star rating</p>
      )}
    </article>
  )
}

/* ─── Modal ──────────────────────────────────────────────────── */
function ReviewModal({ review, onClose }: { review: Review; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Review by ${review.author}`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-near-black/50 backdrop-blur-sm" />

      {/* Card */}
      <div
        className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full border border-teal-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-teal-tint flex items-center justify-center text-muted-text hover:text-near-black transition-colors"
          aria-label="Close review"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          <ReviewerAvatar author={review.author} photoUri={review.photoUri} />
          <div>
            <p className="font-semibold text-near-black">{review.author}</p>
            <p className="text-muted-text text-sm">{review.relativeTime}</p>
          </div>
          <div className="ml-auto">
            <GoogleLogo className="w-6 h-6" />
          </div>
        </div>

        <StarRating rating={review.rating} size={18} />

        <p className="mt-4 text-near-black leading-relaxed">{review.text}</p>
      </div>
    </div>
  )
}

/* ─── Main Section ───────────────────────────────────────────── */
export function GoogleReviews() {
  const [activeReview, setActiveReview] = useState<Review | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const isPausedRef = useRef(false)

  const reviews: Review[] = [...reviewsData.reviews]
  const placeRating: number = reviewsData.placeRating
  const totalReviews: number = reviewsData.totalReviews

  // Duplicate cards for seamless infinite scroll
  const doubled = [...reviews, ...reviews]

  // CSS-driven marquee (no JS timer needed)
  return (
    <>
      {/* ── Modal overlay ── */}
      {activeReview && (
        <ReviewModal review={activeReview} onClose={() => setActiveReview(null)} />
      )}

      <section className="py-16 sm:py-20 lg:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-teal font-semibold text-sm uppercase tracking-widest mb-3">
                <GoogleLogo className="w-4 h-4" />
                Google Reviews
              </div>
              <h2 className="font-[var(--font-syne)] text-3xl sm:text-4xl font-bold text-near-black leading-tight">
                What Our Clients Say
              </h2>
              <p className="mt-2 text-muted-text">Real results. Real reviews. No filters.</p>
            </div>

            {/* Rating summary pill */}
            <a
              href="https://www.google.com/search?q=Ad+Wali+Didi&stick=H4sIAAAAAAAA_-NgU1I1qDBOSrE0NTUwMElJSrMwMUixMqhINU-xMEtOTklOS0uyTE40W8TK45iiEJ6Yk6ngkpmSCQDpDxZoOAAAAA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-teal-tint border border-teal-border rounded-2xl px-6 py-4 hover:shadow-md transition-shadow shrink-0"
              aria-label={`Rated ${placeRating} out of 5 on Google. See all ${totalReviews} reviews.`}
            >
              <div className="text-center">
                <p className="font-[var(--font-syne)] text-4xl font-bold text-near-black leading-none">
                  {placeRating.toFixed(1)}
                </p>
                <div className="mt-1">
                  <StarRating rating={Math.round(placeRating)} size={14} />
                </div>
                <p className="text-muted-text text-xs mt-1">{totalReviews} reviews</p>
              </div>
              <div className="w-px h-12 bg-teal-border" />
              <div className="flex flex-col items-center gap-1">
                <GoogleLogo className="w-8 h-8" />
                <p className="text-muted-text text-xs font-medium">Google</p>
              </div>
            </a>
          </div>
        </div>

        {/* ── Scrolling Track ── */}
        <div
          className="relative"
          onMouseEnter={() => { isPausedRef.current = true; if (trackRef.current) trackRef.current.style.animationPlayState = "paused" }}
          onMouseLeave={() => { isPausedRef.current = false; if (trackRef.current) trackRef.current.style.animationPlayState = "running" }}
        >
          {/* Left fade — narrow so it only softens the edge, not clip card content */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-r from-white to-transparent" />
          {/* Right fade */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent" />

          <div
            ref={trackRef}
            className="flex gap-5 px-6 animate-reviews-marquee"
            style={{ width: "max-content" }}
          >
            {doubled.map((review, idx) => (
              <ReviewCard
                key={idx}
                review={review}
                onClick={() => review.text.trim() && setActiveReview(review)}
              />
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 flex justify-center">
          <a
            href="https://www.google.com/search?q=Ad+Wali+Didi&stick=H4sIAAAAAAAA_-NgU1I1qDBOSrE0NTUwMElJSrMwMUixMqhINU-xMEtOTklOS0uyTE40W8TK45iiEJ6Yk6ngkpmSCQDpDxZoOAAAAA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-teal text-teal font-semibold text-sm hover:bg-teal hover:text-white transition-all duration-300"
          >
            <GoogleLogo className="w-4 h-4" />
            View All Google Reviews
          </a>
        </div>
      </section>

      {/* Marquee keyframe injected as a style tag */}
      <style>{`
        @keyframes reviews-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-reviews-marquee {
          animation: reviews-marquee 28s linear infinite;
        }
      `}</style>
    </>
  )
}
