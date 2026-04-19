import { Target, Rocket, ShieldCheck, Users, Star, Shield, Zap } from "lucide-react"

export const businessTypes = [
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

export const servicesOptions = [
  { id: "gbp",        label: "Google Business Profile", icon: Target    },
  { id: "meta-ads",   label: "Meta Ads",               icon: Rocket    },
  { id: "google-ads", label: "Google Ads",             icon: Rocket    },
  { id: "creatives",  label: "Ad Creatives",           icon: ShieldCheck },
  { id: "social",     label: "Social Media",           icon: Users     },
]

export const trustSignals = [
  { icon: Star,   label: "5-Star Rated" },
  { icon: Shield, label: "No Sales Pitch" },
  { icon: Zap,    label: "Same-Day Reply" },
]

export const budgetOptions = [
  "Below ₹10,000",
  "₹10,000 - ₹25,000",
  "₹25,000 - ₹50,000",
  "₹50,000 - ₹1,00,000",
  "₹1,00,000 - ₹2,50,000",
  "₹2,50,000 - ₹5,00,000",
  "Above ₹5,00,000",
  "Not sure yet/Other"
]
