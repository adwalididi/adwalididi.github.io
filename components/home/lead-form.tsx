"use client"

import { useState, useEffect, FormEvent, useRef } from "react"
import { m, AnimatePresence } from "framer-motion"
import {
  Check,
  Loader2,
  ChevronDown,
  Rocket,
  Users,
  Target,
  ShieldCheck,
  Star,
  Shield,
  Zap,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"

// ─── Config ───────────────────────────────────────────────────────────────────

const businessTypes = [
  "Restaurant / Café / Food",
  "Clinic / Hospital / Wellness",
  "Travel / Tourism",
  "Real Estate / Construction",
  "Gym / Fitness / Sports",
  "Education / Coaching",
  "Salon / Beauty",
  "E-Commerce / Retail",
  "Events / Entertainment",
  "Other",
]

const servicesOptions = [
  { id: "gbp",        label: "Google Business Profile", icon: Target    },
  { id: "meta-ads",   label: "Meta Ads",               icon: Rocket    },
  { id: "google-ads", label: "Google Ads",             icon: Rocket    },
  { id: "creatives",  label: "Ad Creatives",           icon: ShieldCheck },
  { id: "social",     label: "Social Media",           icon: Users     },
]

const trustSignals = [
  { icon: Star,   label: "5-Star Rated" },
  { icon: Shield, label: "No Sales Pitch" },
  { icon: Zap,    label: "Same-Day Reply" },
]

const budgetOptions = [
  "Below ₹10,000",
  "₹10,000 - ₹25,000",
  "₹25,000 - ₹50,000",
  "₹50,000 - ₹1,00,000",
  "₹1,00,000 - ₹2,50,000",
  "₹2,50,000 - ₹5,00,000",
  "Above ₹5,00,000",
  "Not sure yet/Other"
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getIpHash(): Promise<string | null> {
  try {
    const res = await fetch("https://api.ipify.org?format=json")
    const { ip } = await res.json()
    const data = new TextEncoder().encode(ip + "awd_lead_salt_9x2k")
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("")
  } catch { return null }
}

function fireLeadPixelEvent(businessType: string) {
  try {
    const consent = JSON.parse(localStorage.getItem("cookie_consent") || "{}")
    if (consent.ad_storage === "granted" && typeof window !== "undefined") {
      const fbq = (window as unknown as { fbq: (...args: unknown[]) => void }).fbq
      if (typeof fbq === "function") fbq("track", "Lead", { content_category: businessType })
    }
  } catch {}
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LeadForm() {
  const [name,             setName]             = useState("")
  const [whatsapp,         setWhatsapp]         = useState("")
  const [email,            setEmail]            = useState("")
  const [businessName,     setBusinessName]     = useState("")
  const [businessType,     setBusinessType]     = useState(businessTypes[0])
  const [budget,           setBudget]           = useState(budgetOptions[0])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [isDropdownOpen,   setIsDropdownOpen]   = useState(false)
  const [isBudgetOpen,     setIsBudgetOpen]     = useState(false)
  const [activeBusinessIndex, setActiveBusinessIndex] = useState(0)
  const [activeBudgetIndex, setActiveBudgetIndex] = useState(0)
  const [honeypot,         setHoneypot]         = useState("")

  const [utmParams, setUtmParams] = useState({
    source: "", medium: "", campaign: "", content: "", term: "",
  })

  const [nameError,     setNameError]     = useState("")
  const [whatsappError, setWhatsappError] = useState("")
  const [emailError,    setEmailError]    = useState("")
  const [servicesError, setServicesError] = useState("")
  const [submitError,   setSubmitError]   = useState("")
  const [isSubmitting,  setIsSubmitting]  = useState(false)
  const [isSuccess,     setIsSuccess]     = useState(false)

  const businessDropdownRef = useRef<HTMLDivElement>(null)
  const budgetDropdownRef = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const whatsappInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const firstServiceButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    setUtmParams({
      source:   p.get("utm_source")   || "",
      medium:   p.get("utm_medium")   || "",
      campaign: p.get("utm_campaign") || "",
      content:  p.get("utm_content")  || "",
      term:     p.get("utm_term")     || "",
    })

    const handleClick = (e: MouseEvent) => {
      const targetNode = e.target as Node
      const outsideBusiness = !businessDropdownRef.current?.contains(targetNode)
      const outsideBudget = !budgetDropdownRef.current?.contains(targetNode)
      if (outsideBusiness && outsideBudget) {
        setIsDropdownOpen(false)
        setIsBudgetOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  // Load partial save
  useEffect(() => {
    try {
      const saved = localStorage.getItem("awd_lead_draft")
      if (saved) {
        const { savedName, savedWhatsapp } = JSON.parse(saved)
        if (savedName) setName(prev => prev || savedName)
        if (savedWhatsapp) setWhatsapp(prev => prev || savedWhatsapp)
      }
    } catch {}
  }, []) // Empty deps so it only runs once on mount

  // Auto-save form progress
  useEffect(() => {
    if (name || whatsapp) {
      localStorage.setItem("awd_lead_draft", JSON.stringify({ savedName: name, savedWhatsapp: whatsapp }))
    }
  }, [name, whatsapp])

  useEffect(() => {
    if (isDropdownOpen) setActiveBusinessIndex(Math.max(0, businessTypes.indexOf(businessType)))
  }, [isDropdownOpen, businessType])

  useEffect(() => {
    if (isBudgetOpen) setActiveBudgetIndex(Math.max(0, budgetOptions.indexOf(budget)))
  }, [isBudgetOpen, budget])

  useEffect(() => {
    if (!isDropdownOpen) return
    document.getElementById(`business-type-option-${activeBusinessIndex}`)?.scrollIntoView({ block: "nearest" })
  }, [activeBusinessIndex, isDropdownOpen])

  useEffect(() => {
    if (!isBudgetOpen) return
    document.getElementById(`budget-option-${activeBudgetIndex}`)?.scrollIntoView({ block: "nearest" })
  }, [activeBudgetIndex, isBudgetOpen])

  const selectBusinessType = (nextType: string) => {
    setBusinessType(nextType)
    setIsDropdownOpen(false)
  }

  const selectBudget = (nextBudget: string) => {
    setBudget(nextBudget)
    setIsBudgetOpen(false)
  }

  const handleBusinessButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      if (!isDropdownOpen) {
        setIsDropdownOpen(true)
        return
      }
      const delta = e.key === "ArrowDown" ? 1 : -1
      setActiveBusinessIndex((prev) => (prev + delta + businessTypes.length) % businessTypes.length)
      return
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setIsDropdownOpen((prev) => !prev)
      return
    }
    if (e.key === "Escape") {
      setIsDropdownOpen(false)
    }
  }

  const handleBudgetButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      if (!isBudgetOpen) {
        setIsBudgetOpen(true)
        return
      }
      const delta = e.key === "ArrowDown" ? 1 : -1
      setActiveBudgetIndex((prev) => (prev + delta + budgetOptions.length) % budgetOptions.length)
      return
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setIsBudgetOpen((prev) => !prev)
      return
    }
    if (e.key === "Escape") {
      setIsBudgetOpen(false)
    }
  }

  const handleBusinessListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveBusinessIndex((prev) => (prev + 1) % businessTypes.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveBusinessIndex((prev) => (prev - 1 + businessTypes.length) % businessTypes.length)
    } else if (e.key === "Enter") {
      e.preventDefault()
      selectBusinessType(businessTypes[activeBusinessIndex])
    } else if (e.key === "Escape") {
      e.preventDefault()
      setIsDropdownOpen(false)
    }
  }

  const handleBudgetListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveBudgetIndex((prev) => (prev + 1) % budgetOptions.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveBudgetIndex((prev) => (prev - 1 + budgetOptions.length) % budgetOptions.length)
    } else if (e.key === "Enter") {
      e.preventDefault()
      selectBudget(budgetOptions[activeBudgetIndex])
    } else if (e.key === "Escape") {
      e.preventDefault()
      setIsBudgetOpen(false)
    }
  }

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
    setServicesError("")
  }

  const validate = (): boolean => {
    let valid = true
    if (!name.trim()) {
      setNameError("Please enter your name")
      nameInputRef.current?.focus()
      valid = false
    } else { setNameError("") }

    if (!/^[6-9][0-9]{9}$/.test(whatsapp.trim())) {
      setWhatsappError("Enter a valid 10-digit number")
      if (valid) whatsappInputRef.current?.focus()
      valid = false
    } else { setWhatsappError("") }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Invalid email format")
      if (valid) emailInputRef.current?.focus()
      valid = false
    } else { setEmailError("") }

    if (selectedServices.length === 0) {
      setServicesError("Pick at least one service")
      if (valid) firstServiceButtonRef.current?.focus()
      valid = false
    } else { setServicesError("") }

    return valid
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (honeypot !== "" || !validate()) return

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const ipHash = await getIpHash()
      const { error } = await supabase.from("leads").insert({
        name:          name.trim(),
        whatsapp:      whatsapp.trim(),
        email:         email.trim() || null,
        business_name: businessName.trim() || null,
        business_type: businessType,
        budget:        budget,
        services:      selectedServices,
        ip_hash:       ipHash,
        source_page:   "homepage",
        user_agent:    typeof navigator !== "undefined" ? navigator.userAgent : null,
        utm_source:    utmParams.source   || null,
        utm_medium:    utmParams.medium   || null,
        utm_campaign:  utmParams.campaign || null,
        utm_content:   utmParams.content  || null,
        utm_term:      utmParams.term     || null,
      })

      if (error) throw error
      setIsSuccess(true)
      localStorage.removeItem("awd_lead_draft")
      fireLeadPixelEvent(businessType)

      // Fire-and-forget welcome email
      if (email.trim()) {
        fetch('/api/send-welcome/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            businessType,
            services: selectedServices.map(id => servicesOptions.find(o => o.id === id)?.label).filter(Boolean),
          }),
        }).catch(() => {}) // Silent fail — Supabase insert already succeeded
      }
    } catch {
      setSubmitError("Something went wrong. WhatsApp us directly: +91-6261643774")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      className="py-20 lg:py-28 bg-teal-tint relative overflow-hidden"
      id="free-audit"
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 right-[-8%] w-[500px] h-[500px] bg-teal/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-[-5%] w-[350px] h-[350px] bg-teal/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 font-sans">

        {/* ── Outer 2-column: Pitch  |  Form Card ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-14 lg:gap-20 items-start">

          {/* ── Left: Pitch copy ── */}
          <m.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-28 pt-2"
          >
            <span className="inline-block text-teal font-extrabold uppercase tracking-[0.28em] text-[10px] bg-white border border-teal-border px-5 py-2 rounded-full mb-7 shadow-sm">
              Live: Free Audit Slots Open
            </span>

            <h2 className="font-display text-4xl sm:text-5xl xl:text-[3.25rem] font-bold text-near-black leading-[1.08] mb-6 tracking-tight">
              Get more{" "}
              <span className="text-teal">enquiries</span>,<br />
              not just clicks.
            </h2>

            <p className="text-muted-text text-lg leading-relaxed mb-10 max-w-md">
              Find out why your business isn&apos;t ranking or converting. We audit your
              Google profile, Meta ads, and creatives — completely free.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-10">
              {[
                { n: "150+", t: "Month 1 Enquiries" },
                { n: "700+", t: "Total Leads" },
                { n: "Free",  t: "No Obligation"    },
                { n: "24h",   t: "Fast Response"    },
              ].map((s, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-teal-border bg-white/70 hover:bg-white shadow-sm transition-all hover:shadow-md hover:shadow-teal/5 cursor-default"
                >
                  <p className="font-display text-2xl font-bold text-teal">{s.n}</p>
                  <p className="text-[10px] font-bold text-muted-text uppercase mt-0.5 tracking-widest">{s.t}</p>
                </div>
              ))}
            </div>

            {/* Trust signals */}
            <div className="flex flex-col gap-3">
              {trustSignals.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-muted-text text-sm">
                  <div className="w-7 h-7 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-teal" />
                  </div>
                  <span className="font-medium">{label}</span>
                </div>
              ))}
            </div>
          </m.div>

          {/* ── Right: Form Card ── */}
          <m.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-[2rem] shadow-[0_24px_64px_-12px_rgba(0,133,115,0.14)] border border-teal-border overflow-visible">

              {/* Card header strip */}
              <div className="px-8 sm:px-10 pt-8 pb-6 border-b border-teal-border/60">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-teal mb-1">Step 1 of 1</p>
                <h3 className="font-[var(--font-space-grotesk)] text-2xl font-bold text-near-black">
                  Request your free audit
                </h3>
                <p className="text-muted-text text-sm mt-1">Takes 30 seconds · No card required</p>
              </div>

              <div className="px-8 sm:px-10 py-8">

                {isSuccess ? (
                  /* ── Success state ── */
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
                ) : (
                  /* ── Form ── */
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">

                    {/* Honeypot (hidden) */}
                    <div className="absolute opacity-0 pointer-events-none h-0 w-0 overflow-hidden" aria-hidden="true">
                      <label htmlFor="awd-hp-website">Website URL (Leave empty)</label>
                      <input id="awd-hp-website" name="awd_hp_website" type="text" autoComplete="new-password" tabIndex={-1} value={honeypot} onChange={e => setHoneypot(e.target.value)} />
                    </div>

                    {/* ── Row 1: Name + WhatsApp ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                      {/* Name */}
                      <div className="space-y-1.5">
                        <label htmlFor="lead-name" className="block text-[10px] font-extrabold uppercase tracking-[0.22em] text-teal">
                          Your Name
                        </label>
                        <input
                          id="lead-name"
                            ref={nameInputRef}
                          type="text"
                          placeholder="e.g. Priya"
                          autoComplete="given-name"
                          value={name}
                          onChange={e => { setName(e.target.value); setNameError("") }}
                          className={`w-full px-4 py-3.5 rounded-xl border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/20 text-sm transition-all placeholder:text-slate-300 ${
                            nameError ? "border-red-400 focus:ring-red-200" : "border-teal-border focus:border-teal"
                          }`}
                        />
                        {nameError && (
                          <p className="text-red-500 text-[11px] font-medium mt-1">{nameError}</p>
                        )}
                      </div>

                      {/* WhatsApp */}
                      <div className="space-y-1.5">
                        <label htmlFor="lead-whatsapp" className="block text-[10px] font-extrabold uppercase tracking-[0.22em] text-teal">
                          WhatsApp Number
                        </label>
                        <div className={`flex rounded-xl border bg-slate-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal/20 focus-within:border-teal transition-all overflow-hidden ${
                          whatsappError ? "border-red-400 focus-within:ring-red-200" : "border-teal-border"
                        }`}>
                          <span className="px-3.5 bg-teal-tint border-r border-teal-border flex items-center font-bold text-teal text-sm shrink-0">
                            +91
                          </span>
                          <input
                            id="lead-whatsapp"
                            ref={whatsappInputRef}
                            type="tel"
                            placeholder="98765 43210"
                            autoComplete="tel"
                            value={whatsapp}
                            onChange={e => {
                              setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 10))
                              setWhatsappError("")
                            }}
                            className="flex-1 px-4 py-3.5 focus:outline-none bg-transparent text-sm w-full min-w-0 placeholder:text-slate-300"
                          />
                        </div>
                        {whatsappError && (
                          <p className="text-red-500 text-[11px] font-medium mt-1">{whatsappError}</p>
                        )}
                      </div>
                    </div>

                    {/* ── Row 1.5: Business Name + Email ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Business Name */}
                      <div className="space-y-1.5">
                        <label htmlFor="lead-business" className="block text-[10px] font-extrabold uppercase tracking-[0.22em] text-teal">
                          Business Name
                        </label>
                        <input
                          id="lead-business"
                          type="text"
                          placeholder="e.g. My Agency"
                          value={businessName}
                          onChange={e => setBusinessName(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl border border-teal-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/20 text-sm transition-all placeholder:text-slate-300 focus:border-teal"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label htmlFor="lead-email" className="block text-[10px] font-extrabold uppercase tracking-[0.22em] text-teal">
                          Email Address
                        </label>
                        <input
                          id="lead-email"
                            ref={emailInputRef}
                          type="email"
                          placeholder="hello@example.com"
                          autoComplete="email"
                          value={email}
                          onChange={e => { setEmail(e.target.value); setEmailError("") }}
                          className={`w-full px-4 py-3.5 rounded-xl border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/20 text-sm transition-all placeholder:text-slate-300 ${
                            emailError ? "border-red-400 focus:ring-red-200" : "border-teal-border focus:border-teal"
                          }`}
                        />
                        {emailError && (
                          <p className="text-red-500 text-[11px] font-medium mt-1">{emailError}</p>
                        )}
                      </div>
                    </div>

                    {/* ── Row 2: Business Type ── */}
                    <div className="space-y-1.5 relative" ref={businessDropdownRef}>
                      <label htmlFor="lead-business-type" className="block text-[10px] font-extrabold uppercase tracking-[0.22em] text-teal">
                        Business Type
                      </label>
                      <button
                        id="lead-business-type"
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        onKeyDown={handleBusinessButtonKeyDown}
                        role="combobox"
                        aria-controls="business-type-listbox"
                        aria-activedescendant={isDropdownOpen ? `business-type-option-${activeBusinessIndex}` : undefined}
                        aria-haspopup="listbox"
                        aria-expanded={isDropdownOpen}
                        className="w-full px-4 py-3.5 rounded-xl border border-teal-border bg-slate-50 hover:bg-white flex items-center justify-between transition-all text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
                      >
                        <span className="text-sm font-semibold text-near-black truncate mr-2">
                          {businessType}
                        </span>
                        <ChevronDown
                          size={18}
                          className={`text-teal shrink-0 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      <AnimatePresence>
                        {isDropdownOpen && (
                          <m.div
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            id="business-type-listbox"
                            role="listbox"
                            tabIndex={-1}
                            aria-label="Business type options"
                            onKeyDown={handleBusinessListKeyDown}
                            className="absolute z-[100] left-0 right-0 mt-1.5 bg-white border border-teal-border rounded-2xl shadow-xl max-h-[260px] overflow-y-auto custom-scrollbar p-1.5"
                          >
                            {businessTypes.map((t, idx) => (
                              <button
                                key={t}
                                id={`business-type-option-${idx}`}
                                type="button"
                                role="option"
                                tabIndex={idx === activeBusinessIndex ? 0 : -1}
                                aria-selected={businessType === t}
                                onMouseEnter={() => setActiveBusinessIndex(idx)}
                                onClick={() => selectBusinessType(t)}
                                className={`px-4 py-2.5 hover:bg-teal-tint rounded-xl cursor-pointer text-sm font-medium transition-colors ${
                                  businessType === t ? "bg-teal-tint text-teal font-semibold" : "text-near-black"
                                }`}
                              >
                                {t}
                              </button>
                            ))}
                          </m.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* ── Row 2.5: Budget ── */}
                    <div className="space-y-1.5 relative" ref={budgetDropdownRef}>
                      <label htmlFor="lead-budget" className="block text-[10px] font-extrabold uppercase tracking-[0.22em] text-teal">
                        Monthly Ads Budget
                      </label>
                      <button
                        id="lead-budget"
                        type="button"
                        onClick={() => setIsBudgetOpen(!isBudgetOpen)}
                        onKeyDown={handleBudgetButtonKeyDown}
                        role="combobox"
                        aria-controls="budget-listbox"
                        aria-activedescendant={isBudgetOpen ? `budget-option-${activeBudgetIndex}` : undefined}
                        aria-haspopup="listbox"
                        aria-expanded={isBudgetOpen}
                        className="w-full px-4 py-3.5 rounded-xl border border-teal-border bg-slate-50 hover:bg-white flex items-center justify-between transition-all text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
                      >
                        <span className="text-sm font-semibold text-near-black truncate mr-2">
                          {budget}
                        </span>
                        <ChevronDown
                          size={18}
                          className={`text-teal shrink-0 transition-transform duration-200 ${isBudgetOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      <AnimatePresence>
                        {isBudgetOpen && (
                          <m.div
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            id="budget-listbox"
                            role="listbox"
                            tabIndex={-1}
                            aria-label="Monthly budget options"
                            onKeyDown={handleBudgetListKeyDown}
                            className="absolute z-[100] left-0 right-0 mt-1.5 bg-white border border-teal-border rounded-2xl shadow-xl max-h-[260px] overflow-y-auto custom-scrollbar p-1.5"
                          >
                            {budgetOptions.map((b, idx) => (
                              <button
                                key={b}
                                id={`budget-option-${idx}`}
                                type="button"
                                role="option"
                                tabIndex={idx === activeBudgetIndex ? 0 : -1}
                                aria-selected={budget === b}
                                onMouseEnter={() => setActiveBudgetIndex(idx)}
                                onClick={() => selectBudget(b)}
                                className={`px-4 py-2.5 hover:bg-teal-tint rounded-xl cursor-pointer text-sm font-medium transition-colors ${
                                  budget === b ? "bg-teal-tint text-teal font-semibold" : "text-near-black"
                                }`}
                              >
                                {b}
                              </button>
                            ))}
                          </m.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* ── Row 3: Services (chips) ── */}
                    <div className="space-y-2.5">
                      <label className="block text-[10px] font-extrabold uppercase tracking-[0.22em] text-teal">
                        What do you want audited?
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {servicesOptions.map(s => {
                          const active = selectedServices.includes(s.id)
                          return (
                            <button
                              key={s.id}
                              ref={s.id === servicesOptions[0].id ? firstServiceButtonRef : undefined}
                              type="button"
                              onClick={() => toggleService(s.id)}
                              className={`px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all border flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal/20 ${
                                active
                                  ? "bg-teal border-teal text-white shadow-sm"
                                  : "bg-white border-teal-border text-teal hover:bg-teal-tint"
                              }`}
                            >
                              <s.icon size={13} className={active ? "text-white shrink-0" : "text-teal shrink-0"} />
                              <span className="truncate">{s.label}</span>
                            </button>
                          )
                        })}
                      </div>
                      {servicesError && (
                        <p className="text-red-500 text-[11px] font-medium">{servicesError}</p>
                      )}
                    </div>

                    {/* ── Submit area ── */}
                    <div className="pt-4 border-t border-teal-border/50">
                      {submitError && (
                        <p className="text-red-500 text-sm mb-4 font-medium">{submitError}</p>
                      )}
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full sm:w-auto flex-1 sm:flex-none px-8 py-4 bg-teal text-white rounded-xl font-bold text-base hover:bg-deep-teal transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 cursor-pointer"
                        >
                          {isSubmitting ? (
                            <Loader2 className="animate-spin h-5 w-5" />
                          ) : (
                            <>
                              <WhatsAppIcon className="w-5 h-5" />
                              <span>Request My Free Audit</span>
                            </>
                          )}
                        </button>
                        <p className="text-[11px] text-muted-text text-center sm:text-left leading-snug">
                          100% free & zero commitment —<br className="hidden sm:block" /> we reply on WhatsApp same day.
                        </p>
                      </div>
                    </div>

                  </form>
                )}
              </div>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  )
}
