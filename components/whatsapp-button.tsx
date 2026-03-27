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
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center animate-whatsapp-pulse"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon size={24} />
    </a>
  )
}
