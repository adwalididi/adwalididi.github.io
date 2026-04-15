"use client"

import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"

export function WhatsAppButton() {
  const whatsappNumber = "916261643774"
  const message = encodeURIComponent("Hi! I'd like to know more about your services.")
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden md:flex fixed bottom-6 right-6 z-50 bg-white/80 backdrop-blur-md border border-white/50 text-[#25D366] p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-white hover:scale-110 transition-all duration-300 items-center justify-center animate-float-subtle"
      aria-label="Chat on WhatsApp"
    >
      <div className="animate-ring-subtle">
        <WhatsAppIcon size={24} />
      </div>
    </a>
  )
}
