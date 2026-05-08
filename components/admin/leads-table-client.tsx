"use client";

import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, MessageSquare, Info, ChevronDown, Phone, Share2, Sun, Moon, Layers, Trash2 } from 'lucide-react';
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
  { label: 'New',           value: 'New',           color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  { label: 'Contacted',     value: 'Contacted',     color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  { label: 'In Discussion', value: 'In Discussion', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' },
  { label: 'Closed-Won',   value: 'Closed-Won',    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  { label: 'Unreachable',   value: 'Unreachable',   color: 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20' },
  { label: 'Junk',          value: 'Junk',          color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
];

const serviceLabels: Record<string, string> = {
  'gbp': 'Google Business',
  'meta-ads': 'Meta Ads',
  'google-ads': 'Google Ads',
  'creatives': 'Creatives',
  'social': 'Social Media',
};

function FilterSelect({ label, value, onChange, children }: {
  label: string; value: string; onChange: (v: string) => void; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 min-w-[130px]">
      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-card border border-border rounded-xl py-2 pl-3 pr-8 text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer text-xs font-bold shadow-sm"
        >
          {children}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={13} />
      </div>
    </div>
  );
}

export default function LeadsTableClient() {
  const { theme, toggleTheme, mounted } = useAdminTheme();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    fetch('/api/get-crm-leads')
      .then(r => r.json())
      .then(data => setLeads(Array.isArray(data) ? data : data.leads || []))
      .catch(console.error);
  }, []);

  const industries = useMemo(() => {
    const set = new Set(leads.map(l => l.business_type).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads
      .filter(lead => {
        const q = search.toLowerCase();
        const matchSearch = !search ||
          lead.name.toLowerCase().includes(q) ||
          lead.whatsapp?.includes(q) ||
          lead.email?.toLowerCase().includes(q) ||
          lead.business_name?.toLowerCase().includes(q) ||
          lead.business_type?.toLowerCase().includes(q);
        const matchIndustry = industryFilter === 'All' || lead.business_type === industryFilter;
        const matchService  = serviceFilter  === 'All' || lead.services?.includes(serviceFilter);
        const matchStatus =
          statusFilter === 'All' ? true :
          statusFilter === 'Active' ? (lead.status || 'New') !== 'Junk' :
          (lead.status || 'New') === statusFilter;
        return matchSearch && matchIndustry && matchService && matchStatus;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [leads, search, industryFilter, serviceFilter, statusFilter]);

  const activeFilters = [industryFilter, serviceFilter].filter(f => f !== 'All').length + (statusFilter !== 'Active' ? 1 : 0);

  const handleDeleteLead = (leadId: string) => handleStatusChange(leadId, 'Junk');

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    const prev = [...leads];
    setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    try {
      const res = await fetch('/api/update-lead-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, status: newStatus }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setLeads(prev);
      alert('Failed to update status.');
    }
  };

  const getStatusStyle = (status: string) =>
    statusOptions.find(o => o.value === status)?.color || statusOptions[0].color;

  return (
    <div className="flex flex-col h-full gap-3">

      {/* ── TOOLBAR ── */}
      <div className="flex flex-col gap-2 shrink-0">

        {/* Row 1: Search + actions */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/40 font-medium"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setFiltersOpen(f => !f)}
            className={`md:hidden relative p-2.5 rounded-xl border transition-all ${filtersOpen ? 'bg-primary text-white border-primary' : 'bg-card border-border text-muted-foreground hover:text-foreground'}`}
            title="Filters"
          >
            <Filter size={16} />
            {activeFilters > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-card border border-border hover:bg-muted transition-all text-muted-foreground hover:text-foreground shrink-0"
            title="Toggle theme"
          >
            {mounted && (theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />)}
          </button>
        </div>

        {/* Row 2: Filters — always visible on desktop, toggle on mobile */}
        <div className={`${filtersOpen ? 'flex' : 'hidden'} md:flex flex-wrap gap-2 items-end`}>
          <FilterSelect label="Industry" value={industryFilter} onChange={setIndustryFilter}>
            <option value="All">All Industries</option>
            {industries.filter(i => i !== 'All').map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </FilterSelect>

          <FilterSelect label="Service" value={serviceFilter} onChange={setServiceFilter}>
            <option value="All">All Services</option>
            {Object.entries(serviceLabels).map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </FilterSelect>

          <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter}>
            <option value="Active">Active (No Junk)</option>
            <option value="All">All Statuses</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </FilterSelect>

          {(activeFilters > 0 || statusFilter !== 'Active') && (
            <button
              onClick={() => { setIndustryFilter('All'); setServiceFilter('All'); setStatusFilter('Active'); }}
              className="flex items-center gap-1.5 mt-5 px-3 py-2 rounded-xl text-xs font-bold text-rose-500 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-all"
            >
              <X size={12} /> Clear filters
            </button>
          )}

          <span className="mt-5 ml-auto text-[11px] font-bold text-muted-foreground/60 whitespace-nowrap self-center">
            {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="flex-1 min-h-0 rounded-2xl border border-border bg-card shadow-sm overflow-auto">
        <table className="w-full border-collapse text-left" style={{ minWidth: '720px' }}>
          <thead className="bg-muted/80 sticky top-0 z-20 border-b border-border">
            <tr>
              <th className="py-3 px-4 font-black text-[10px] text-muted-foreground uppercase tracking-widest w-10 text-center">#</th>
              <th className="py-3 px-4 font-black text-[10px] text-muted-foreground uppercase tracking-widest">Lead</th>
              <th className="py-3 px-4 font-black text-[10px] text-muted-foreground uppercase tracking-widest">Status</th>
              <th className="py-3 px-4 font-black text-[10px] text-muted-foreground uppercase tracking-widest">Business</th>
              <th className="py-3 px-4 font-black text-[10px] text-muted-foreground uppercase tracking-widest">Source</th>
              <th className="py-3 px-4 font-black text-[10px] text-muted-foreground uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filteredLeads.map((lead, index) => (
              <tr key={lead.id} className="hover:bg-muted/40 transition-colors group">
                <td className="py-3 px-4 text-muted-foreground/50 font-black text-center tabular-nums text-[10px]">
                  {filteredLeads.length - index}
                </td>

                <td className="py-3 px-4">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm">{lead.name}</span>
                      <span className="text-[9px] text-muted-foreground/50 font-bold tabular-nums">
                        {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone size={10} className="text-primary/40 shrink-0" />
                      <span className="text-xs font-bold text-foreground/70 tabular-nums">{lead.whatsapp}</span>
                    </div>
                    {lead.email && (
                      <span className="text-[10px] text-muted-foreground truncate max-w-[180px]">{lead.email}</span>
                    )}
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="relative w-fit">
                    <select
                      value={lead.status || 'New'}
                      onChange={e => handleStatusChange(lead.id, e.target.value)}
                      className={`appearance-none pl-2.5 pr-6 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider border cursor-pointer focus:outline-none transition-all ${getStatusStyle(lead.status || 'New')}`}
                    >
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-foreground truncate max-w-[140px]">
                      {lead.business_name || '—'}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                      {lead.business_type}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {lead.services?.slice(0, 2).map(s => (
                        <span key={s} className="px-1.5 py-0.5 rounded-md text-[8px] font-black bg-primary/5 border border-primary/15 text-primary uppercase tracking-wide">
                          {serviceLabels[s] ? serviceLabels[s].split(' ')[0] : s}
                        </span>
                      ))}
                      {lead.services?.length > 2 && (
                        <span className="text-[8px] font-black text-muted-foreground/50">+{lead.services.length - 2}</span>
                      )}
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <Share2 size={9} className="text-primary/40 shrink-0" />
                      <span className="text-xs font-bold text-foreground uppercase">{lead.utm_source || 'Direct'}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground ml-3.5">{lead.utm_medium || 'Organic'}</span>
                  </div>
                </td>

                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="p-2 rounded-lg bg-card hover:bg-muted border border-border text-primary transition-all"
                      title="View details"
                    >
                      <Info size={14} />
                    </button>
                    <a
                      href={`https://wa.me/91${lead.whatsapp?.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-primary hover:bg-primary/90 text-white transition-all shadow-sm"
                      title="WhatsApp"
                    >
                      <MessageSquare size={14} />
                    </a>
                    <button
                      onClick={() => handleDeleteLead(lead.id)}
                      className="p-2 rounded-lg bg-card hover:bg-rose-500/10 border border-border hover:border-rose-500/30 text-muted-foreground hover:text-rose-500 transition-all"
                      title="Remove from view (mark as Junk)"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={6} className="py-24 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-30 select-none">
                    <Filter size={40} className="text-primary" />
                    <p className="text-xl font-bold text-foreground">No leads found</p>
                    <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <m.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full sm:max-w-lg bg-card border border-border rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Drag handle (mobile) */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>

              {/* Header */}
              <div className="p-6 border-b border-border/50 flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedLead.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{selectedLead.business_name || selectedLead.business_type}</p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all border border-transparent hover:border-border"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="overflow-y-auto flex-1 p-6 space-y-6">
                <Section title="Contact Details" icon={<Phone size={12} />}>
                  <Grid2>
                    <DataCard label="Phone" value={selectedLead.whatsapp} />
                    <DataCard label="Email" value={selectedLead.email || '—'} />
                    <DataCard label="Industry" value={selectedLead.business_type} />
                    <DataCard label="Budget" value={selectedLead.budget || '—'} />
                    <DataCard label="Services" value={selectedLead.services.map(s => serviceLabels[s] || s).join(', ')} full />
                  </Grid2>
                </Section>

                <Section title="Attribution" icon={<Share2 size={12} />}>
                  <Grid2>
                    <DataCard label="Source" value={selectedLead.utm_source || 'Direct'} />
                    <DataCard label="Medium" value={selectedLead.utm_medium || '—'} />
                    <DataCard label="Campaign" value={selectedLead.utm_campaign || '—'} full />
                    <DataCard label="Content" value={selectedLead.utm_content || '—'} />
                    <DataCard label="Term" value={selectedLead.utm_term || '—'} />
                  </Grid2>
                </Section>

                <Section title="Technical" icon={<Layers size={12} />}>
                  <div className="space-y-3">
                    <DataCard label="Source Page" value={selectedLead.source_page || '—'} full />
                    <DataCard label="User Agent" value={selectedLead.user_agent || '—'} full code />
                    <DataCard label="IP Hash" value={selectedLead.ip_hash || '—'} full code />
                  </div>
                </Section>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border/50 flex gap-2">
                <a
                  href={`https://wa.me/91${selectedLead.whatsapp?.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-sm transition-all"
                >
                  <MessageSquare size={15} /> WhatsApp
                </a>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-6 py-3 border border-border rounded-2xl font-bold text-sm text-muted-foreground hover:bg-muted transition-all"
                >
                  Close
                </button>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5">
        {icon} {title}
      </h4>
      {children}
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

function DataCard({ label, value, full, code }: { label: string; value: string; full?: boolean; code?: boolean }) {
  return (
    <div className={`p-3 rounded-xl bg-muted/40 border border-border/40 ${full ? 'col-span-2' : ''}`}>
      <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-foreground font-semibold break-words ${code ? 'font-mono text-[10px] opacity-60' : 'text-sm'}`}>
        {value}
      </p>
    </div>
  );
}
