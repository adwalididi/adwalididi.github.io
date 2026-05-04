"use client";

import { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  MessageSquare, 
  Info, 
  ChevronDown,
  Layers,
  Phone,
  Share2,
  Sun,
  Moon,
  Maximize2,
  Rows
} from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { useAdminTheme } from '@/components/admin/admin-theme-provider';

interface Lead {
  id: string;
  created_at: string;
  name: string;
  whatsapp: string;
  email?: string;
  business_name?: string;
  business_type: string;
  budget?: string;
  services: string[];
  status?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  source_page?: string;
  user_agent?: string;
  ip_hash?: string;
}

const statusOptions = [
  { label: 'New',            value: 'New',            color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  { label: 'Contacted',      value: 'Contacted',      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  { label: 'In Discussion',  value: 'In Discussion',  color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' },
  { label: 'Closed-Won',     value: 'Closed-Won',     color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  { label: 'Unreachable',    value: 'Unreachable',    color: 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20' },
  { label: 'Junk',           value: 'Junk',           color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
];

const serviceLabels: Record<string, string> = {
  'gbp': 'Google Business Profile',
  'meta-ads': 'Meta Ads',
  'google-ads': 'Google Ads',
  'creatives': 'Ad Creatives',
  'social': 'Social Media'
};

export default function LeadsTableClient({ 
  leads: initialLeads,
  onStatusUpdate 
}: { 
  leads: Lead[],
  onStatusUpdate: (id: string, status: string) => Promise<void>
}) {
  const { theme, toggleTheme, mounted } = useAdminTheme();



  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy] = useState<'date' | 'status'>('date');
  const [sortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [density, setDensity] = useState<'compact' | 'comfortable'>('compact');

  // Load density from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dash_density') as 'compact' | 'comfortable';
    if (saved) setDensity(saved);
  }, []);

  // Save density to localStorage
  const toggleDensity = () => {
    const next = density === 'compact' ? 'comfortable' : 'compact';
    setDensity(next);
    localStorage.setItem('dash_density', next);
  };

  // Extract unique industries for filter dropdown
  const industries = useMemo(() => {
    const set = new Set(leads.map(l => l.business_type).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [leads]);

  // Filtered & Sorted Logic
  const filteredLeads = useMemo(() => {
    let result = leads.filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.whatsapp?.includes(search) ||
        lead.email?.toLowerCase().includes(search.toLowerCase()) ||
        lead.business_name?.toLowerCase().includes(search.toLowerCase()) ||
        lead.business_type?.toLowerCase().includes(search.toLowerCase());
      
      const matchesIndustry = industryFilter === 'All' || lead.business_type === industryFilter;
      const matchesService = serviceFilter === 'All' || lead.services?.includes(serviceFilter);
      const matchesStatus = statusFilter === 'All' || (lead.status || 'New') === statusFilter;
      
      return matchesSearch && matchesIndustry && matchesService && matchesStatus;
    });

    // Sort Logic
    result.sort((a, b) => {
      if (sortBy === 'date') {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      } else {
        const priority: Record<string, number> = { 'New': 0, 'Contacted': 1, 'In Discussion': 2, 'Closed-Won': 3, 'Unreachable': 4, 'Junk': 5 };
        const valA = priority[a.status || 'New'] ?? 99;
        const valB = priority[b.status || 'New'] ?? 99;
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      }
    });

    return result;
  }, [leads, search, industryFilter, serviceFilter, statusFilter, sortBy, sortOrder]);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    // Optimistic Update
    const previousLeads = [...leads];
    setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    
    try {
      await onStatusUpdate(leadId, newStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
      // Rollback
      setLeads(previousLeads);
      alert("Failed to update status. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── STICKY HEADER AREA ── */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md pb-4 pt-4 border-b border-border/50 px-4">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-xs group group-focus-within:max-w-sm transition-all duration-500">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm placeholder:text-muted-foreground/30 font-medium"
            />
          </div>

          {/* Industry Filter */}
          <div className="w-40 relative group">
            <select 
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="w-full bg-card border border-border rounded-xl py-2 px-3 pr-8 text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer text-xs shadow-sm font-bold"
            >
              <option value="All">All Industries</option>
              {industries.filter(i => i !== 'All').map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none group-focus-within:rotate-180 transition-transform" size={14} />
          </div>

          {/* Service Filter */}
          <div className="w-40 relative group">
            <select 
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full bg-card border border-border rounded-xl py-2 px-3 pr-8 text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer text-xs shadow-sm font-bold"
            >
              <option value="All">All Services</option>
              {Object.keys(serviceLabels).map(id => (
                <option key={id} value={id}>{serviceLabels[id]}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none group-focus-within:rotate-180 transition-transform" size={14} />
          </div>

          {/* Status Filter */}
          <div className="w-40 relative group">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-card border border-border rounded-xl py-2 px-3 pr-8 text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer text-xs shadow-sm font-bold"
            >
              <option value="All">All Statuses</option>
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none group-focus-within:rotate-180 transition-transform" size={14} />
          </div>

          {/* Density Toggle */}
          <button
            onClick={toggleDensity}
            className="p-2 rounded-xl bg-card border border-border hover:bg-muted transition-all text-primary shadow-sm hover:scale-105 active:scale-95 shrink-0"
            title={density === 'compact' ? "Switch to Comfortable View" : "Switch to Compact View"}
          >
            {density === 'compact' ? <Rows size={16} /> : <Maximize2 size={16} />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-card border border-border hover:bg-muted transition-all text-primary shadow-sm hover:scale-105 active:scale-95 shrink-0"
            title="Toggle Dark Mode"
          >
            {mounted && (theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />)}
          </button>
        </div>
      </div>

      {/* ── DATA TABLE (SCROLLABLE) ── */}
      <div className="flex-1 overflow-auto rounded-2xl border border-border bg-card shadow-xl relative custom-scrollbar">
        <table className="w-full border-collapse text-left">
          <thead className="bg-muted sticky top-0 z-20 border-b border-border">
            <tr>
              <th className={`${density === 'compact' ? 'py-1.5 px-3 mb-1' : 'py-3 px-4'} font-black text-[10px] text-primary uppercase tracking-widest w-10 text-center`}>#</th>
              <th className={`${density === 'compact' ? 'py-1.5 px-3' : 'py-3 px-4'} font-black text-[10px] text-primary uppercase tracking-widest`}>Lead / Partner</th>
              <th className={`${density === 'compact' ? 'py-1.5 px-3' : 'py-3 px-4'} font-black text-[10px] text-primary uppercase tracking-widest`}>Status / Next Step</th>
              <th className={`${density === 'compact' ? 'py-1.5 px-3' : 'py-3 px-4'} font-black text-[10px] text-primary uppercase tracking-widest`}>Industry & Services</th>
              <th className={`${density === 'compact' ? 'py-1.5 px-3' : 'py-3 px-4'} font-black text-[10px] text-primary uppercase tracking-widest`}>Attribution</th>
              <th className={`${density === 'compact' ? 'py-1.5 px-3' : 'py-3 px-4'} font-black text-[10px] text-primary uppercase tracking-widest text-center`}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filteredLeads.map((lead, index) => (
              <tr key={lead.id} className={`hover:bg-muted/50 transition-all group border-l-2 border-transparent hover:border-primary ${density === 'compact' ? '' : 'border-l-4'}`}>
                {/* Row # */}
                <td className={`${density === 'compact' ? 'py-1.5 px-3 mb-1' : 'py-5 px-4'} text-muted-foreground font-black text-center tabular-nums text-[10px]`}>
                  {filteredLeads.length - index}
                </td>
                
                {/* Contact & Name */}
                <td className={`${density === 'compact' ? 'py-1.5 px-3' : 'py-5 px-4'}`}>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                       <span className={`font-bold text-foreground tracking-tight ${density === 'compact' ? 'text-sm' : 'text-lg'}`}>{lead.name}</span>
                       <span className="text-[9px] text-primary tabular-nums uppercase font-black opacity-60">
                         {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                       </span>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className={`text-foreground/80 tabular-nums flex items-center gap-1 leading-none ${density === 'compact' ? 'text-[11px] font-bold' : 'text-[13px] font-extrabold'}`}>
                         <Phone size={10} className="text-primary/40" />
                         {lead.whatsapp}
                       </span>
                       {lead.email && (
                         <span className={`text-muted-foreground truncate border-l border-border pl-2 leading-none ${density === 'compact' ? 'text-[10px] max-w-[120px]' : 'text-[11px] max-w-[180px]'}`}>
                           {lead.email}
                         </span>
                       )}
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className={`${density === 'compact' ? 'py-1.5 px-3' : 'py-5 px-4'}`}>
                  <div className="relative group/status w-fit">
                    <select 
                      value={lead.status || 'New'}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className={`appearance-none px-2 rounded-md font-black uppercase tracking-widest border cursor-pointer focus:outline-none transition-all ${
                        density === 'compact' ? 'text-[9px] py-0.5 pr-5' : 'text-[11px] py-1.5 pr-8 border-2'
                      } ${
                        statusOptions.find(opt => opt.value === (lead.status || 'New'))?.color || statusOptions[0].color
                      }`}
                    >
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={density === 'compact' ? 10 : 14} className="absolute right-1 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
                  </div>
                </td>

                {/* Industry & Services */}
                <td className={`${density === 'compact' ? 'py-1.5 px-3' : 'py-5 px-4'}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col min-w-0">
                      <span className={`text-foreground font-black uppercase tracking-wide truncate ${density === 'compact' ? 'text-[10px] max-w-[120px]' : 'text-[11px] max-w-[180px] bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/20'}`}>
                        {lead.business_name || 'Individual'}
                      </span>
                      <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest truncate">
                        {lead.business_type || 'Other'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {lead.services?.slice(0, density === 'compact' ? 2 : 4).map(s => (
                        <span key={s} className="px-1.5 py-0.5 rounded text-[8px] font-black bg-muted border border-border text-primary uppercase">
                          {s === 'social' ? 'SMM' : s === 'creatives' ? 'Ads' : (serviceLabels[s] ? s.toUpperCase() : s)}
                        </span>
                      ))}
                      {lead.services?.length > (density === 'compact' ? 2 : 4) && <span className="text-[8px] font-black opacity-40">+{lead.services.length - (density === 'compact' ? 2 : 4)}</span>}
                    </div>
                  </div>
                </td>

                {/* Attribution */}
                <td className={`${density === 'compact' ? 'py-1.5 px-3' : 'py-5 px-4'}`}>
                   <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <Share2 size={10} className="text-primary/50" />
                        <span className={`font-black text-foreground uppercase truncate ${density === 'compact' ? 'text-[10px] max-w-[80px]' : 'text-[11px] max-w-[120px]'}`}>
                          {lead.utm_source || 'Direct'}
                        </span>
                      </div>
                      <span className="text-[8px] text-muted-foreground font-bold ml-4 uppercase opacity-50">
                        {lead.utm_medium || 'Organic'}
                      </span>
                   </div>
                </td>

                {/* Actions */}
                <td className={`${density === 'compact' ? 'py-1.5 px-3' : 'py-5 px-4'} text-center whitespace-nowrap`}>
                  <div className="flex items-center justify-center gap-1.5">
                    <button 
                      onClick={() => setSelectedLead(lead)}
                      className={`rounded-lg bg-card hover:bg-muted text-primary transition-all border border-border shadow-sm ${density === 'compact' ? 'p-1.5' : 'p-3 rounded-xl'}`}
                      title="Audit"
                    >
                      <Info size={density === 'compact' ? 14 : 18} />
                    </button>
                    <a 
                      href={`https://wa.me/91${lead.whatsapp?.replace(/\D/g, '')}`}
                      target="_blank" 
                      rel="noreferrer"
                      className={`rounded-lg bg-primary hover:bg-primary/90 text-white transition-all shadow-sm ${density === 'compact' ? 'p-1.5' : 'p-3 rounded-xl shadow-md shadow-primary/20'}`}
                      title="Chat"
                    >
                      <MessageSquare size={density === 'compact' ? 14 : 18} />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={7} className="p-24 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-30 select-none">
                    <Filter size={48} className="text-primary" />
                    <p className="text-2xl font-bold text-foreground tracking-tight">System Clear</p>
                    <p className="text-sm text-muted-foreground font-medium">No leads match the current filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── METADATA MODAL ── */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <m.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Content */}
            <m.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-[2.5rem] shadow-3xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-8 border-b border-border/50 flex justify-between items-center bg-muted/30">
                <div>
                  <h3 className="text-2xl font-bold text-foreground tracking-tight">Technical <span className="text-primary">Audit</span></h3>
                  <p className="text-[11px] text-muted-foreground mt-1 uppercase tracking-[0.2em] font-black opacity-60">Metadata for {selectedLead.name}</p>
                </div>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="p-3 rounded-full hover:bg-background text-muted-foreground hover:text-primary transition-all border border-transparent hover:border-border"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                
                {/* Group 0: Submission Details */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-extrabold text-teal-400 uppercase tracking-[0.2em] flex items-center gap-2 text-white">
                    <Info size={12} /> Submission Overview
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <DataCard label="Full Name" value={selectedLead.name} />
                    <DataCard label="Contact" value={selectedLead.whatsapp} />
                    <DataCard label="Business Name" value={selectedLead.business_name || 'N/A'} />
                    <DataCard label="Email" value={selectedLead.email || 'N/A'} />
                    <DataCard label="Industry" value={selectedLead.business_type} />
                    <DataCard label="Budget" value={selectedLead.budget || 'N/A'} />
                    <div className="col-span-2">
                       <DataCard label="Services" value={selectedLead.services.map(s => serviceLabels[s] || s).join(', ')} />
                    </div>
                  </div>
                </div>

                {/* Group 1: Attribution */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-extrabold text-teal-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Share2 size={12} /> Attribution Data
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <DataCard label="Source" value={selectedLead.utm_source || 'Direct'} />
                    <DataCard label="Medium" value={selectedLead.utm_medium || 'N/A'} />
                    <DataCard label="Campaign" value={selectedLead.utm_campaign || 'N/A'} className="col-span-2" />
                    <DataCard label="Content" value={selectedLead.utm_content || 'N/A'} />
                    <DataCard label="Term" value={selectedLead.utm_term || 'N/A'} />
                  </div>
                </div>

                {/* Group 2: Context */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-extrabold text-teal-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Layers size={12} /> Navigation Context
                  </h4>
                  <div className="space-y-4">
                    <DataCard label="Source Page" value={selectedLead.source_page || 'N/A'} isFull />
                    <DataCard label="User Agent" value={selectedLead.user_agent || 'N/A'} isFull isCode />
                    <DataCard label="IP Hash" value={selectedLead.ip_hash || 'N/A'} isFull isCode />
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-6 bg-muted/30 border-t border-border/50 flex justify-end">
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary/20 active:scale-95"
                >
                  Close Audit
                </button>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DataCard({ label, value, isFull = false, isCode = false, className = '' }: { label: string, value: string, isFull?: boolean, isCode?: boolean, className?: string }) {
  return (
    <div className={`p-4 rounded-2xl bg-muted/20 border border-border/40 ${isFull ? 'w-full' : ''} ${className}`}>
      <label className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-1.5 block">{label}</label>
      <p className={`text-foreground font-bold break-words ${isCode ? 'font-mono text-[11px] leading-relaxed opacity-70 p-3 bg-background rounded-xl mt-2 overflow-x-auto border border-border/20' : 'text-[13px]'}`}>
        {value}
      </p>
    </div>
  );
}
