"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ZoomIn } from "lucide-react"

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

  const handleImageError = (index: number) => {
    setErrorImages(prev => ({ ...prev, [index]: true }))
  }

  // Filter out images that had errors
  const visibleImages = images.filter((_, index) => !errorImages[index])

  if (visibleImages.length === 0) return null

  return (
    <div className="mt-4 mb-2">
      <div 
        className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide no-scrollbar"
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
                className="relative h-full rounded-lg overflow-hidden cursor-zoom-in border border-teal-border/20 bg-teal-tint/5 transition-all duration-300 hover:shadow-md"
                onClick={() => setSelectedImage(image.src)}
              >
                <img
                  src={image.src}
                  alt={image.label || "Case study visual"}
                  className="h-full w-auto object-contain transition-all duration-500 group-hover:scale-105 opacity-100"
                  onError={() => handleImageError(index)}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-near-black/0 group-hover:bg-near-black/5 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <ZoomIn className="w-5 h-5 text-white transition-opacity duration-300" />
                </div>
              </div>
              {image.label && (
                <p className="absolute -bottom-5 left-1 text-[9px] font-bold text-muted-text uppercase tracking-widest whitespace-nowrap">
                  {image.label}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-near-black/95 flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
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
