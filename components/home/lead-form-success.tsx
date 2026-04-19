"use client"

import { Check } from "lucide-react"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"
import { servicesOptions } from "./lead-form-constants"

export function LeadFormSuccess({ 
  name, 
  businessType, 
  selectedServices 
}: { 
  name: string
  businessType: string
  selectedServices: string[]
}) {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-teal-tint rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
        <Check className="w-10 h-10 text-teal" />
      </div>
      <h3 className="font-[var(--font-space-grotesk)] text-2xl font-bold text-near-black mb-2">
        You&apos;re all set!
      </h3>
      <p className="text-muted-text text-sm mb-8">
        We&apos;ll WhatsApp you within a few hours with your audit.
      </p>
      <a
        href={`https://wa.me/916261643774?text=${encodeURIComponent(`Hi! I'm ${name.trim()} (${businessType}) — looking for an audit for: ${selectedServices.map(id => servicesOptions.find(o => o.id === id)?.label).filter(Boolean).join(" + ")}.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2.5 bg-teal text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-deep-teal transition-all hover:scale-105 shadow-lg"
      >
        <WhatsAppIcon className="w-5 h-5" />
        WhatsApp Didi
      </a>
    </div>
  )
}
