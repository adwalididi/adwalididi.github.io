'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Mail, MessageCircle, Plus, Upload, Sparkles, Send, Copy, ExternalLink,
  Trash2, ChevronDown, Loader2, Check, AlertCircle, X, Users, Pencil,
  Sun, Moon, AtSign, Phone, TriangleAlert
} from 'lucide-react';
import { useAdminTheme } from '@/components/admin/admin-theme-provider';

// ─── Config ───────────────────────────────────────────────────────────────────

const INDUSTRIES = [
  'Restaurant / Café / Food',
  'Clinic / Hospital / Wellness / Dental',
  'Travel / Tourism / Hospitality',
  'Real Estate / Construction',
  'Gym / Fitness / Sports',
  'Education / Coaching / Institute',
  'Salon / Beauty / Spa',
  'E-Commerce / Retail / D2C',
  'Events / Entertainment',
  'Hotel / Resort',
  'Automobile / Car Dealership',
  'Legal / CA / Consulting',
  'Other',
];

const SERVICES = [
  'Meta Ads (Facebook + Instagram)',
  'Google Ads (Search + Display)',
  'Social Media Management',
  'Google Business Profile Optimization',
  'Ad Creatives & Content',
  'Full Digital Marketing Package',
];

// ─── Unified Lead — both email + phone on every lead ─────────────────────────

interface Lead {
  id: string;
  crmId?: string; // Original Supabase leads table ID
  email: string;
  phone: string;
  businessName: string;
  ownerName: string;
  city?: string;
  industry: string;
  targetService: string;
  // Email channel
  generatedSubject?: string;
  generatedBody?: string;
  emailStatus: 'pending' | 'generated' | 'sent' | 'failed';
  outreachLogId?: string; // Supabase outreach_log row ID
  emailError?: string;
  // WhatsApp channel
  generatedMessage?: string;
  waLink?: string;
  formattedPhone?: string;
  waStatus: 'pending' | 'generated' | 'failed';
  waError?: string;
}

function newLead(partial: Partial<Lead> & Pick<Lead, 'businessName'>): Lead {
  return {
    id: crypto.randomUUID(),
    email: '',
    phone: '',
    ownerName: '',
    city: '',
    industry: INDUSTRIES[0],
    targetService: SERVICES[0],
    emailStatus: 'pending',
    waStatus: 'pending',
    ...partial,
  };
}

function normalizeCsvHeader(header: string): string {
  return header.trim().toLowerCase().replace(/['"]/g, '');
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(value.trim());
      value = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i += 1;
      row.push(value.trim());
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      value = '';
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value.trim());
    if (row.some((cell) => cell.length > 0)) rows.push(row);
  }

  return rows;
}

// ─── Component ────────────────────────────────────────────────────────────────

/** Map a Supabase snake_case row → camelCase Lead object */
function mapDbToLead(row: Record<string, unknown>): Lead {
  return {
    id:               row.id               as string,
    crmId:            (row.crm_id          as string) || undefined,
    email:            (row.email           as string) || '',
    phone:            (row.phone           as string) || '',
    businessName:     row.business_name    as string,
    ownerName:        (row.owner_name      as string) || '',
    city:             (row.city            as string) || undefined,
    industry:         row.industry         as string,
    targetService:    row.target_service   as string,
    generatedSubject: (row.generated_subject as string) || undefined,
    generatedBody:    (row.generated_body  as string) || undefined,
    generatedMessage: (row.generated_message as string) || undefined,
    waLink:           (row.wa_link         as string) || undefined,
    formattedPhone:   (row.formatted_phone as string) || undefined,
    emailStatus:      (row.email_status    as Lead['emailStatus']) || 'pending',
    waStatus:         (row.wa_status       as Lead['waStatus'])   || 'pending',
    emailError:       (row.email_error     as string) || undefined,
    waError:          (row.wa_error        as string) || undefined,
    outreachLogId:    (row.outreach_log_id as string) || undefined,
  };
}

export default function OutreachDashboardClient({ sentTodayInitial }: { sentTodayInitial: number }) {
  const { theme, toggleTheme, mounted } = useAdminTheme();
  const [activeTab, setActiveTab] = useState<'email' | 'whatsapp'>('email');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sentToday, setSentToday] = useState(sentTodayInitial);
  const [showForm, setShowForm] = useState(false);
  const [previewLead, setPreviewLead] = useState<Lead | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadingLeads, setLoadingLeads] = useState(true);

  // Fetch leads from Supabase on mount
  async function fetchLeads() {
    try {
      const res = await fetch('/api/outreach-leads/', { credentials: 'include' });
      const data = await res.json();
      if (data.leads) setLeads(data.leads.map(mapDbToLead));
    } catch (e) {
      console.error('Failed to load leads:', e);
    } finally {
      setLoadingLeads(false);
    }
  }

  useEffect(() => { fetchLeads(); }, []);

  // Form state
  const [form, setForm] = useState({
    email: '', phone: '', businessName: '', ownerName: '', city: '',
    industry: INDUSTRIES[0], targetService: SERVICES[0],
  });

  // Per-row loading
  const [generatingEmailId, setGeneratingEmailId] = useState<string | null>(null);
  const [generatingWaId, setGeneratingWaId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Bulk loading
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [bulkSending, setBulkSending] = useState(false);
  const [importingCRM, setImportingCRM] = useState(false);
  const [bulkGenerateProgress, setBulkGenerateProgress] = useState({ completed: 0, total: 0 });
  const [bulkSendProgress, setBulkSendProgress] = useState({ completed: 0, total: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Lead CRUD ────────────────────────────────────────────────────

  async function addLead() {
    if (!form.businessName.trim()) return;
    const optimistic = newLead({ ...form, businessName: form.businessName.trim() });
    // Optimistic: show immediately
    setLeads(prev => [optimistic, ...prev]);
    setForm({ email: '', phone: '', businessName: '', ownerName: '', city: '', industry: INDUSTRIES[0], targetService: SERVICES[0] });
    setShowForm(false);
    try {
      const res = await fetch('/api/outreach-leads/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: optimistic.id, ...form, businessName: form.businessName.trim() }),
      });
      if (!res.ok) throw new Error('Failed to save');
    } catch (e) {
      console.error('Add lead error:', e);
      // Rollback optimistic update
      setLeads(prev => prev.filter(l => l.id !== optimistic.id));
    }
  }

  async function removeLead(id: string) {
    // Optimistic: remove immediately
    setLeads(prev => prev.filter(l => l.id !== id));
    try {
      await fetch(`/api/outreach-leads/${id}/`, { method: 'DELETE', credentials: 'include' });
    } catch (e) {
      console.error('Delete lead error:', e);
      // Restore on failure by refreshing
      fetchLeads();
    }
  }

  /** In-memory update for real-time edit fields — call persistLead to save. */
  function updateLead(id: string, patch: Partial<Lead>) {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l));
  }

  /** Persist a patch to Supabase — used for generated content, status updates, and on edit 'Done'. */
  async function persistLead(id: string, patch: Partial<Lead>) {
    updateLead(id, patch); // keep UI in sync
    try {
      await fetch(`/api/outreach-leads/${id}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
    } catch (e) {
      console.error('Persist lead error:', e);
    }
  }

  // ─── Import from CRM ──────────────────────────────────────────────

  async function importFromCRM() {
    setImportingCRM(true);
    try {
      const res = await fetch('/api/get-crm-leads/', { credentials: 'include' });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      // Refresh full list — server already upserted, deduplication handled by DB
      await fetchLeads();
      if (data.imported === 0) {
        alert(`No new leads to import (${data.skipped} already imported).`);
      }
    } catch (e) {
      console.error('CRM import failed:', e);
    } finally {
      setImportingCRM(false);
    }
  }

  // ─── CSV Upload ───────────────────────────────────────────────────

  function handleCSVUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const rows = parseCsv(text);
      if (rows.length < 2) return;
      const headers = rows[0].map(normalizeCsvHeader);
      const imported: Lead[] = [];
      for (let i = 1; i < rows.length; i++) {
        const vals = rows[i].map((v) => v.replace(/['"]/g, '').trim());
        const r: Record<string, string> = {};
        headers.forEach((h, idx) => { r[h] = vals[idx] || ''; });
        const biz = r.business_name || r.businessname || r.business || '';
        if (!biz) continue;
        imported.push(newLead({
          businessName: biz,
          ownerName: r.owner_name || r.ownername || r.owner || r.name || '',
          city: r.city || r.location || '',
          email: r.email || '',
          phone: r.phone || '',
          industry: r.industry || INDUSTRIES[0],
          targetService: r.target_service || r.targetservice || r.service || SERVICES[0],
        }));
      }
      setLeads(prev => [...imported, ...prev]);
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  // ─── Generate Email ───────────────────────────────────────────────

  async function generateEmail(lead: Lead) {
    if (!lead.email) return;
    setGeneratingEmailId(lead.id);
    try {
      const res = await fetch('/api/generate-email/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: lead.businessName, ownerName: lead.ownerName,
          city: lead.city,
          industry: lead.industry, targetService: lead.targetService,
          email: lead.email,
        }),
      });
      const data = await res.json();
      if (data.subject && data.body) {
        await persistLead(lead.id, {
          generatedSubject: data.subject,
          generatedBody: data.body,
          emailStatus: 'generated',
          outreachLogId: data.outreachLogId || undefined,
          emailError: undefined,
        });
      } else {
        await persistLead(lead.id, { emailStatus: 'failed', emailError: data.error || 'Generation failed' });
      }
    } catch {
      await persistLead(lead.id, { emailStatus: 'failed', emailError: 'Request failed' });
    } finally {
      setGeneratingEmailId(null);
    }
  }

  // ─── Generate WhatsApp ────────────────────────────────────────────

  async function generateWhatsApp(lead: Lead) {
    if (!lead.phone) return;
    setGeneratingWaId(lead.id);
    try {
      const res = await fetch('/api/generate-whatsapp/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: lead.phone, name: lead.ownerName,
          city: lead.city,
          businessName: lead.businessName, industry: lead.industry,
          targetService: lead.targetService,
        }),
      });
      const data = await res.json();
      if (data.message) {
        await persistLead(lead.id, {
          generatedMessage: data.message,
          waLink: data.waLink,
          formattedPhone: data.formattedPhone,
          waStatus: 'generated',
          waError: undefined,
        });
      } else {
        await persistLead(lead.id, { waStatus: 'failed', waError: data.error || 'Generation failed' });
      }
    } catch {
      await persistLead(lead.id, { waStatus: 'failed', waError: 'Request failed' });
    } finally {
      setGeneratingWaId(null);
    }
  }

  // ─── Send Email ───────────────────────────────────────────────────

  async function sendEmail(lead: Lead) {
    if (!lead.email || !lead.generatedSubject || !lead.generatedBody) return;
    if (sentToday >= 300) return;
    setSendingId(lead.id);
    try {
      const res = await fetch('/api/send-cold-email/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: lead.email,
          toName: lead.ownerName,
          subject: lead.generatedSubject,
          body: lead.generatedBody,
          outreachLogId: lead.outreachLogId || null,
        }),
      });
      const data = await res.json();
      const newStatus = data.success ? 'sent' : 'failed';
      await persistLead(lead.id, { emailStatus: newStatus });
      if (data.success) setSentToday(p => p + 1);
    } catch {
      await persistLead(lead.id, { emailStatus: 'failed' });
    } finally {
      setSendingId(null);
    }
  }

  // ─── Copy WA Message ─────────────────────────────────────────────

  async function copyMessage(lead: Lead) {
    if (!lead.generatedMessage) return;
    await navigator.clipboard.writeText(lead.generatedMessage);
    setCopiedId(lead.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  // ─── Bulk Actions ─────────────────────────────────────────────────

  async function bulkGenerate() {
    const queue = activeTab === 'email'
      ? leads.filter(l => l.email && l.emailStatus === 'pending')
      : leads.filter(l => l.phone && l.waStatus === 'pending');
    setBulkGenerateProgress({ completed: 0, total: queue.length });
    setBulkGenerating(true);
    try {
      for (let i = 0; i < queue.length; i += 1) {
        const lead = queue[i];
        if (activeTab === 'email') {
          await generateEmail(lead);
        } else {
          await generateWhatsApp(lead);
        }
        setBulkGenerateProgress({ completed: i + 1, total: queue.length });
      }
    } finally {
      setBulkGenerating(false);
      setBulkGenerateProgress({ completed: 0, total: 0 });
    }
  }

  async function bulkSend() {
    const queue = leads.filter(l => l.email && l.emailStatus === 'generated');
    setBulkSendProgress({ completed: 0, total: queue.length });
    setBulkSending(true);
    try {
      for (let i = 0; i < queue.length; i += 1) {
        await sendEmail(queue[i]);
        setBulkSendProgress({ completed: i + 1, total: queue.length });
      }
    } finally {
      setBulkSending(false);
      setBulkSendProgress({ completed: 0, total: 0 });
    }
  }

  // ─── Computed ─────────────────────────────────────────────────────

  const emailPending   = leads.filter(l => l.email && l.emailStatus === 'pending').length;
  const emailGenerated = leads.filter(l => l.email && l.emailStatus === 'generated').length;
  const emailSent      = leads.filter(l => l.emailStatus === 'sent').length;
  const waPending      = leads.filter(l => l.phone && l.waStatus === 'pending').length;
  const waGenerated    = leads.filter(l => l.phone && l.waStatus === 'generated').length;

  const pendingCount   = activeTab === 'email' ? emailPending : waPending;
  const generatedCount = activeTab === 'email' ? emailGenerated : waGenerated;

  // ─── Render ───────────────────────────────────────────────────────

  if (loadingLeads) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 size={24} className="animate-spin mr-3" />
        <span className="text-sm font-medium">Loading leads...</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setActiveTab('email')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'email' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-card border border-border text-muted-foreground hover:bg-muted'
          }`}>
          <Mail size={16} /> Email Outreach
        </button>
        <button onClick={() => setActiveTab('whatsapp')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'whatsapp' ? 'bg-[#25D366] text-white shadow-lg shadow-[#25D366]/20' : 'bg-card border border-border text-muted-foreground hover:bg-muted'
          }`}>
          <MessageCircle size={16} /> WhatsApp
        </button>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl">
            <Users size={14} className="text-muted-foreground" />
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">{leads.length} leads</span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-card border border-border hover:bg-muted transition-all text-primary shadow-sm hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
            title="Toggle Dark Mode"
          >
            {mounted && (theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />)}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total" value={leads.length} color="text-foreground" />
        <StatCard label="Pending" value={pendingCount} color="text-yellow-600" />
        <StatCard label="Generated" value={generatedCount} color="text-blue-500" />
        <StatCard label={activeTab === 'email' ? `Sent (${sentToday}/300)` : 'Sent via WA'} value={activeTab === 'email' ? emailSent : waGenerated} color="text-primary" />
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-3">
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary/90 transition-all cursor-pointer">
          <Plus size={14} /> Add Lead
        </button>
        <button onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border text-foreground rounded-xl font-bold text-xs hover:bg-muted transition-all cursor-pointer">
          <Upload size={14} /> Upload CSV
        </button>
        <input ref={fileInputRef} type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />

        <button
          onClick={importFromCRM}
          disabled={importingCRM}
          className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border text-foreground rounded-xl font-bold text-xs hover:bg-muted transition-all cursor-pointer disabled:opacity-50"
          title="Pull leads from your homepage form submissions"
        >
          {importingCRM ? <Loader2 size={14} className="animate-spin" /> : <Users size={14} />}
          {importingCRM ? 'Importing...' : 'Import from CRM'}
        </button>

        {pendingCount > 0 && (
          <button onClick={bulkGenerate} disabled={bulkGenerating}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer">
            {bulkGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {bulkGenerating
              ? `Generating ${bulkGenerateProgress.completed}/${bulkGenerateProgress.total || pendingCount}`
              : `Generate All (${pendingCount})`}
          </button>
        )}
        {activeTab === 'email' && generatedCount > 0 && (
          <button onClick={bulkSend} disabled={bulkSending || sentToday >= 300}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 disabled:opacity-50 transition-all cursor-pointer">
            {bulkSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {bulkSending
              ? `Sending ${bulkSendProgress.completed}/${bulkSendProgress.total || generatedCount}`
              : `Send All (${generatedCount})`}
          </button>
        )}
      </div>

      {/* Add Lead Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-[2rem] p-6 sm:p-8 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-foreground">Add New Lead</h3>
            <p className="text-[10px] text-muted-foreground font-medium">Unified — works for both Email &amp; WhatsApp tabs</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormInput label="Business Name *" value={form.businessName} onChange={v => setForm(p => ({...p, businessName: v}))} placeholder="Sharma's Restaurant" />
            <FormInput label="Owner Name" value={form.ownerName} onChange={v => setForm(p => ({...p, ownerName: v}))} placeholder="Rahul Sharma" />
            <FormInput label="City (optional)" value={form.city} onChange={v => setForm(p => ({...p, city: v}))} placeholder="Mumbai" />
            <FormInput label="Email (for email outreach)" type="email" value={form.email} onChange={v => setForm(p => ({...p, email: v}))} placeholder="owner@business.com" />
            <FormInput label="Phone (for WhatsApp)" type="tel" value={form.phone} onChange={v => setForm(p => ({...p, phone: v.replace(/\D/g,'').slice(0,10)}))} placeholder="9876543210" />
            <FormSelect label="Industry" value={form.industry} onChange={v => setForm(p => ({...p, industry: v}))} options={INDUSTRIES} />
            <FormSelect label="Target Service" value={form.targetService} onChange={v => setForm(p => ({...p, targetService: v}))} options={SERVICES} />
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={addLead} disabled={!form.businessName.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer">
              <Plus size={14} /> Add Lead
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-5 py-3 bg-card border border-border text-muted-foreground rounded-xl font-bold text-sm hover:bg-muted transition-all cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Leads Table */}
      {leads.length === 0 ? (
        <div className="bg-card border border-border rounded-[2rem] p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">No leads yet</h3>
          <p className="text-sm text-muted-foreground">Add leads manually or upload a CSV. Each lead has both email and phone — works in both tabs.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-[10px] font-black text-primary uppercase tracking-widest">Business</th>
                  <th className="text-left px-4 py-3 text-[10px] font-black text-primary uppercase tracking-widest hidden sm:table-cell">Owner</th>
                  <th className="text-left px-4 py-3 text-[10px] font-black text-primary uppercase tracking-widest hidden md:table-cell">Contact</th>
                  <th className="text-left px-4 py-3 text-[10px] font-black text-primary uppercase tracking-widest hidden lg:table-cell">Service</th>
                  <th className="text-left px-4 py-3 text-[10px] font-black text-primary uppercase tracking-widest">Status</th>
                  <th className="text-right px-4 py-3 text-[10px] font-black text-primary uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => {
                  const status      = activeTab === 'email' ? lead.emailStatus : lead.waStatus;
                  const hasContact  = activeTab === 'email' ? !!lead.email : !!lead.phone;
                  const isGenEmail  = generatingEmailId === lead.id;
                  const isGenWa     = generatingWaId === lead.id;
                  const isSending   = sendingId === lead.id;
                  const isCopied    = copiedId === lead.id;

                  const isEditing = editingId === lead.id;

                  return (
                    <tr key={lead.id} className="border-b border-border/40 hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <div className="space-y-1">
                            <input value={lead.businessName} onChange={e => updateLead(lead.id, { businessName: e.target.value })}
                              className="bg-background border border-primary/30 rounded-lg px-2 py-1 text-sm text-foreground w-full max-w-[150px] focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            <input value={lead.city || ''} onChange={e => updateLead(lead.id, { city: e.target.value })} placeholder="City"
                              className="bg-background border border-primary/30 rounded-lg px-2 py-1 text-xs text-foreground w-full max-w-[150px] focus:outline-none focus:ring-2 focus:ring-primary/20" />
                          </div>
                        ) : (
                          <p className="font-semibold text-foreground truncate max-w-[150px]">{lead.businessName}</p>
                        )}
                        <p className="text-[10px] text-muted-foreground">
                          {lead.industry.split(' /')[0]}{lead.city ? ` • ${lead.city}` : ''}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {isEditing ? (
                          <input value={lead.ownerName} onChange={e => updateLead(lead.id, { ownerName: e.target.value })}
                            className="bg-background border border-primary/30 rounded-lg px-2 py-1 text-sm text-foreground w-full max-w-[120px] focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        ) : (
                          <span className="text-muted-foreground truncate max-w-[120px] block">{lead.ownerName || '—'}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {isEditing ? (
                          <div className="space-y-1">
                            <input value={lead.email} onChange={e => updateLead(lead.id, { email: e.target.value })} placeholder="email"
                              className="bg-background border border-primary/30 rounded-lg px-2 py-1 text-xs text-foreground w-full max-w-[180px] focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            <input value={lead.phone} onChange={e => updateLead(lead.id, { phone: e.target.value.replace(/\D/g,'').slice(0,10) })} placeholder="phone"
                              className="bg-background border border-primary/30 rounded-lg px-2 py-1 text-xs text-foreground w-full max-w-[180px] focus:outline-none focus:ring-2 focus:ring-primary/20" />
                          </div>
                        ) : (
                          <>
                            {lead.email && (
                              <p className="text-xs text-muted-foreground truncate max-w-[180px] inline-flex items-center gap-1.5">
                                <AtSign size={12} className="shrink-0" /> {lead.email}
                              </p>
                            )}
                            {lead.phone && (
                              <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                                <Phone size={12} className="shrink-0" /> 91{lead.phone}
                              </p>
                            )}
                          </>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell text-xs truncate max-w-[160px]">{lead.targetService}</td>
                      <td className="px-4 py-3">
                        {hasContact
                          ? <StatusBadge status={status} />
                          : <span className="text-[10px] text-muted-foreground font-medium">No {activeTab === 'email' ? 'email' : 'phone'}</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {!hasContact && (
                            <span className="text-[10px] text-muted-foreground italic">Add {activeTab === 'email' ? 'email' : 'phone'} to use this channel</span>
                          )}

                          {/* EMAIL TAB ACTIONS */}
                          {activeTab === 'email' && hasContact && (
                            <>
                              {lead.emailStatus === 'pending' && (
                                <button onClick={() => generateEmail(lead)} disabled={isGenEmail}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[11px] font-bold hover:bg-blue-700 disabled:opacity-50 cursor-pointer transition-all">
                                  {isGenEmail ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                  Generate
                                </button>
                              )}
                              {lead.emailStatus === 'generated' && (
                                <>
                                  <button onClick={() => setPreviewLead(lead)}
                                    className="px-3 py-1.5 bg-card border border-border text-foreground rounded-lg text-[11px] font-bold hover:bg-muted cursor-pointer transition-all">
                                    Preview
                                  </button>
                                  <button onClick={() => sendEmail(lead)} disabled={isSending || sentToday >= 300}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-700 disabled:opacity-50 cursor-pointer transition-all">
                                    {isSending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                                    Send
                                  </button>
                                </>
                              )}
                              {lead.emailStatus === 'sent' && (
                                <span className="flex items-center gap-1 px-3 py-1.5 text-primary text-[11px] font-bold">
                                  <Check size={12} /> Sent
                                </span>
                              )}
                              {lead.emailStatus === 'failed' && (
                                <div className="flex flex-col items-end gap-1">
                                  {lead.emailError && <p className="text-[10px] text-destructive max-w-[200px] text-right">{lead.emailError}</p>}
                                  <button onClick={() => generateEmail(lead)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-[11px] font-bold hover:bg-destructive/20 cursor-pointer transition-all">
                                    <AlertCircle size={12} /> Retry
                                  </button>
                                </div>
                              )}
                            </>
                          )}

                          {/* WHATSAPP TAB ACTIONS */}
                          {activeTab === 'whatsapp' && hasContact && (
                            <>
                              {lead.waStatus === 'pending' && (
                                <button onClick={() => generateWhatsApp(lead)} disabled={isGenWa}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white rounded-lg text-[11px] font-bold hover:bg-[#20bd5a] disabled:opacity-50 cursor-pointer transition-all">
                                  {isGenWa ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                  Generate
                                </button>
                              )}
                              {lead.waStatus === 'generated' && (
                                <>
                                  <button onClick={() => setPreviewLead(lead)}
                                    className="px-3 py-1.5 bg-card border border-border text-foreground rounded-lg text-[11px] font-bold hover:bg-muted cursor-pointer transition-all">
                                    Preview
                                  </button>
                                  <button onClick={() => copyMessage(lead)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border text-foreground rounded-lg text-[11px] font-bold hover:bg-muted cursor-pointer transition-all">
                                    {isCopied ? <Check size={12} className="text-primary" /> : <Copy size={12} />}
                                    {isCopied ? 'Copied!' : 'Copy'}
                                  </button>
                                  <a href={lead.waLink} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white rounded-lg text-[11px] font-bold hover:bg-[#20bd5a] transition-all">
                                    <ExternalLink size={12} /> Open WA
                                  </a>
                                </>
                              )}
                              {lead.waStatus === 'failed' && (
                                <div className="flex flex-col items-end gap-1">
                                  {lead.waError && <p className="text-[10px] text-destructive max-w-[200px] text-right">{lead.waError}</p>}
                                  <button onClick={() => generateWhatsApp(lead)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-[11px] font-bold hover:bg-destructive/20 cursor-pointer transition-all">
                                    <AlertCircle size={12} /> Retry
                                  </button>
                                </div>
                              )}
                            </>
                          )}

                          <button
                            onClick={() => {
                              if (isEditing) {
                                // Persist field edits when Done is clicked
                                persistLead(lead.id, {
                                  businessName: lead.businessName,
                                  ownerName:    lead.ownerName,
                                  city:         lead.city,
                                  email:        lead.email,
                                  phone:        lead.phone,
                                  industry:     lead.industry,
                                  targetService: lead.targetService,
                                });
                              }
                              setEditingId(isEditing ? null : lead.id);
                            }}
                            className={`p-1.5 rounded-lg cursor-pointer transition-all ${isEditing ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'}`}
                            title={isEditing ? 'Done' : 'Edit'}
                          >
                            {isEditing ? <Check size={14} /> : <Pencil size={14} />}
                          </button>
                          <button onClick={() => removeLead(lead.id)}
                            className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 cursor-pointer transition-all" title="Remove">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preview Modal — fixed scroll */}
      {previewLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewLead(null)}>
          <div className="bg-card border border-border rounded-[2rem] w-full max-w-lg flex flex-col shadow-2xl max-h-[85vh]"
            onClick={e => e.stopPropagation()}>

            {/* Modal Header — fixed */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-border shrink-0">
              <h3 className="text-base font-bold text-foreground inline-flex items-center gap-2">
                {activeTab === 'email' ? <Mail size={16} /> : <MessageCircle size={16} />}
                {activeTab === 'email' ? 'Email Preview' : 'WhatsApp Preview'}
              </h3>
              <button onClick={() => setPreviewLead(null)}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground cursor-pointer transition-all">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body — scrollable */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
              {activeTab === 'email' && previewLead.generatedSubject && (
                <>
                  <div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1.5">Subject Line</p>
                    <p className="text-foreground font-semibold text-sm bg-muted rounded-xl p-3 border border-border leading-relaxed">
                      {previewLead.generatedSubject}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1.5">Email Body</p>
                    <div className="text-foreground text-sm leading-relaxed bg-muted rounded-xl p-4 border border-border whitespace-pre-wrap">
                      {previewLead.generatedBody}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'whatsapp' && previewLead.generatedMessage && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">WhatsApp Message</p>
                    {previewLead.formattedPhone && (
                      <span className="text-[11px] font-mono bg-muted border border-border px-2 py-1 rounded-lg text-foreground">
                        To: {previewLead.formattedPhone}
                      </span>
                    )}
                  </div>
                  <div className="text-sm leading-relaxed bg-[#dcf8c6] dark:bg-[#005c4b] text-[#111] dark:text-white rounded-2xl p-4 border border-[#b4e0a3] dark:border-[#00806a] whitespace-pre-wrap">
                    {previewLead.generatedMessage}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <TriangleAlert size={12} />
                      "Number doesn&apos;t exist" means the number isn&apos;t registered on WhatsApp — not a URL issue.
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer — fixed */}
            <div className="p-6 pt-4 border-t border-border shrink-0">
              {activeTab === 'email' ? (
                <div className="flex gap-3">
                  <button onClick={() => { sendEmail(previewLead); setPreviewLead(null); }}
                    disabled={sentToday >= 300}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 disabled:opacity-50 cursor-pointer transition-all">
                    <Send size={14} /> Send Email
                  </button>
                  <button onClick={() => { generateEmail(previewLead); setPreviewLead(null); }}
                    className="flex items-center gap-2 px-5 py-3 bg-card border border-border text-foreground rounded-xl font-bold text-sm hover:bg-muted cursor-pointer transition-all">
                    <Sparkles size={14} /> Regenerate
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button onClick={() => copyMessage(previewLead)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-card border border-border text-foreground rounded-xl font-bold text-sm hover:bg-muted cursor-pointer transition-all">
                    <Copy size={14} /> Copy Message
                  </button>
                  <a href={previewLead.waLink} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white rounded-xl font-bold text-sm hover:bg-[#20bd5a] transition-all">
                    <ExternalLink size={14} /> Open WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className={`text-[10px] font-black uppercase tracking-widest ${color} opacity-70`}>{label}</p>
      <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
    </div>
  );
}

function FormInput({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-primary text-[10px] font-black uppercase tracking-widest">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="bg-background border border-border rounded-xl p-3 text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30" />
    </div>
  );
}

function FormSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-primary text-[10px] font-black uppercase tracking-widest">{label}</label>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)}
          className="w-full bg-background border border-border rounded-xl p-3 text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer pr-10">
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending:   'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    generated: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    sent:      'bg-primary/10 text-primary border-primary/20',
    failed:    'bg-destructive/10 text-destructive border-destructive/20',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
}
