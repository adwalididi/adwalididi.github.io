"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react"

interface GalleryImage {
  src: string
  label?: string
  spanAll?: boolean
}

interface CaseStudyGalleryProps {
  images: GalleryImage[]
}

export function CaseStudyGallery({ images }: CaseStudyGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [errorImages, setErrorImages] = useState<Record<number, boolean>>({})
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  
  // Drag-to-scroll state
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [hasMoved, setHasMoved] = useState(false)

  const handleImageError = (index: number) => {
    setErrorImages(prev => ({ ...prev, [index]: true }))
  }

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 10)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }, [])

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [checkScroll, images])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setHasMoved(false)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    setHasMoved(true)
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5 // Multiplier for faster scroll
    scrollRef.current.scrollLeft = scrollLeft - walk
    checkScroll()
  }

  // Filter out images that had errors
  const visibleImages = images.filter((_, index) => !errorImages[index])

  if (visibleImages.length === 0) return null

  return (
    <div className="mt-4 mb-2 relative group">
      <div className="relative">
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className={`flex gap-3 overflow-x-auto pb-6 scrollbar-hide no-scrollbar select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}} />
          {images.map((image, index) => {
            if (errorImages[index]) return null
            
            return (
              <div 
                key={index} 
                className="flex-shrink-0 group relative h-32 sm:h-40 lg:h-48"
              >
                <div 
                  className="relative h-full rounded-lg overflow-hidden border border-teal-border/20 bg-teal-tint/5 transition-all duration-300 hover:shadow-md"
                  onClick={() => {
                    // Only open lightbox if it wasn't a drag action
                    if (!hasMoved) {
                      setSelectedImage(image.src)
                    }
                  }}
                >
                  <Image
                    src={image.src}
                    alt={image.label || "Case study visual"}
                    width={800}
                    height={600}
                    className="h-full w-auto object-contain transition-all duration-500 group-hover:scale-105 opacity-100 pointer-events-none"
                    onError={() => handleImageError(index)}
                    onLoad={checkScroll}
                    draggable="false"
                  />
                  <div className="absolute inset-0 bg-near-black/0 group-hover:bg-near-black/5 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                    <ZoomIn className="w-5 h-5 text-white transition-opacity duration-300" aria-hidden="true" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Navigation Arrows - Desktop Only */}
        <button
          onClick={() => scroll('left')}
          className={`hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-10 h-10 items-center justify-center rounded-full bg-teal text-white shadow-lg transition-all duration-300 hover:bg-deep-teal hover:scale-105 ${canScrollLeft ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-label="Previous images"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => scroll('right')}
          className={`hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-10 h-10 items-center justify-center rounded-full bg-teal text-white shadow-lg transition-all duration-300 hover:bg-deep-teal hover:scale-105 ${canScrollRight ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-label="Next images"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-near-black/95 flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <button 
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={() => setSelectedImage(null)}
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
          
          <div className="relative w-full h-full max-w-6xl max-h-[85vh]">
            <Image
              src={selectedImage}
              alt="Full size view"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </div>
  )
}
