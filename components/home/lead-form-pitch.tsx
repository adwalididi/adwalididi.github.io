"use client"

import { m } from "framer-motion"
import { trustSignals } from "./lead-form-constants"

export function LeadFormPitch() {
  return (
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
  )
}
