'use client';

import { useState } from 'react';
import { Server, Mail, Bot, Cpu, RefreshCw, CheckCircle2, XCircle, Clock, Send, Play, LayoutGrid, List } from 'lucide-react';

interface HealthStatus {
  status: 'pending' | 'operational' | 'failing';
  latency: number;
  error: string | null;
}

interface ApiHealth {
  supabase?: HealthStatus;
  brevo?: HealthStatus;
  resend?: HealthStatus;
  gemini_1?: HealthStatus;
  gemini_2?: HealthStatus;
  gemini_3?: HealthStatus;
  gemini_4?: HealthStatus;
  gemini_5?: HealthStatus;
  groq_1?: HealthStatus;
  groq_2?: HealthStatus;
  groq_3?: HealthStatus;
  groq_4?: HealthStatus;
  groq_5?: HealthStatus;
  [key: string]: HealthStatus | undefined;
}

type CardVariant = 'infrastructure' | 'email' | 'groq' | 'gemini';

const VARIANT_STYLES: Record<CardVariant, {
  icon: string;
  badge: string;
  border: string;
  glow: string;
  label: string;
}> = {
  infrastructure: {
    icon: 'bg-blue-500/15 text-blue-500',
    badge: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
    border: 'hover:border-blue-500/30',
    glow: 'shadow-blue-500/5',
    label: 'Infrastructure',
  },
  email: {
    icon: 'bg-violet-500/15 text-violet-500',
    badge: 'bg-violet-500/10 text-violet-500 border border-violet-500/20',
    border: 'hover:border-violet-500/30',
    glow: 'shadow-violet-500/5',
    label: 'Email',
  },
  groq: {
    icon: 'bg-emerald-500/15 text-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    border: 'hover:border-emerald-500/30',
    glow: 'shadow-emerald-500/5',
    label: 'Groq AI (Primary)',
  },
  gemini: {
    icon: 'bg-amber-500/15 text-amber-500',
    badge: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    border: 'hover:border-amber-500/30',
    glow: 'shadow-amber-500/5',
    label: 'Gemini AI (Fallback)',
  },
};

export default function HealthDashboardClient() {
  const [health, setHealth] = useState<ApiHealth>({});
  const [loadingAll, setLoadingAll] = useState(false);
  const [loadingService, setLoadingService] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchHealth = async (service?: string) => {
    if (service) setLoadingService(service);
    else setLoadingAll(true);
    try {
      const url = service ? `/api/health?service=${service}` : '/api/health';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setHealth(prev => ({ ...prev, ...data }));
      }
    } catch (e) {
      console.error('Failed to fetch health status', e);
    } finally {
      if (service) setLoadingService(null);
      else setLoadingAll(false);
    }
  };

  const StatusIcon = ({ status, size = 20 }: { status?: string; size?: number }) => {
    if (status === 'operational') return <CheckCircle2 className="text-emerald-500" size={size} />;
    if (status === 'failing') return <XCircle className="text-red-500" size={size} />;
    if (status === 'pending') return <Clock className="text-yellow-500 animate-spin" size={size} />;
    return <Clock className="text-muted-foreground opacity-40" size={size} />;
  };

  const statusText = (status?: string) => {
    if (status === 'operational') return 'text-emerald-500';
    if (status === 'failing') return 'text-red-500';
    if (status === 'pending') return 'text-yellow-500';
    return 'text-muted-foreground opacity-50';
  };

  // Grid Card
  const GridCard = ({ id, title, icon: Icon, variant }: {
    id: string; title: string; icon: React.ElementType; variant: CardVariant;
  }) => {
    const data = health[id];
    const isChecking = loadingAll || loadingService === id || data?.status === 'pending';
    const styles = VARIANT_STYLES[variant];

    return (
      <div className={`bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col transition-all ${styles.border} ${styles.glow}`}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${styles.icon}`}>
              <Icon size={20} />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm leading-tight">{title}</h3>
              <span className={`text-[10px] font-black uppercase tracking-widest ${statusText(data?.status)}`}>
                {data?.status || 'idle'}
              </span>
            </div>
          </div>
          <StatusIcon status={data?.status} />
        </div>

        <div className="flex justify-between text-xs mt-2 mb-1">
          <span className="text-muted-foreground">Latency</span>
          <span className="font-mono text-foreground font-semibold">
            {data?.latency ? `${data.latency}ms` : '—'}
          </span>
        </div>

        {data?.error && (
          <div className="mt-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-mono break-all max-h-24 overflow-y-auto">
            {data.error}
          </div>
        )}

        <button
          onClick={() => fetchHealth(id)}
          disabled={isChecking}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-background border border-border hover:bg-muted text-foreground text-xs font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer"
        >
          {isChecking ? <RefreshCw size={13} className="animate-spin" /> : <Play size={13} />}
          {isChecking ? 'Checking...' : 'Run Test'}
        </button>
      </div>
    );
  };

  // List Row
  const ListRow = ({ id, title, icon: Icon, variant }: {
    id: string; title: string; icon: React.ElementType; variant: CardVariant;
  }) => {
    const data = health[id];
    const isChecking = loadingAll || loadingService === id || data?.status === 'pending';
    const styles = VARIANT_STYLES[variant];

    return (
      <div className={`bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-4 transition-all ${styles.border}`}>
        <div className={`p-2 rounded-lg shrink-0 ${styles.icon}`}>
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground text-sm">{title}</span>
            <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md ${styles.badge}`}>
              {styles.label}
            </span>
          </div>
          {data?.error && (
            <p className="text-xs text-red-400 font-mono truncate mt-0.5">{data.error}</p>
          )}
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="font-mono text-xs text-muted-foreground">
            {data?.latency ? `${data.latency}ms` : '—'}
          </span>
          <StatusIcon status={data?.status} size={18} />
          <button
            onClick={() => fetchHealth(id)}
            disabled={isChecking}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border hover:bg-muted text-foreground text-xs font-bold rounded-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            {isChecking ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} />}
            {isChecking ? 'Testing...' : 'Test'}
          </button>
        </div>
      </div>
    );
  };

  const CardComponent = viewMode === 'grid' ? GridCard : ListRow;

  const overallStatus = () => {
    const all = Object.values(health);
    if (all.length === 0) return null;
    if (all.some(s => s?.status === 'failing')) return { label: 'Degraded', color: 'text-red-500 bg-red-500/10 border-red-500/20' };
    if (all.every(s => s?.status === 'operational')) return { label: 'All Systems Operational', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
    return { label: 'Partial', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' };
  };

  const status = overallStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl font-bold text-foreground">Service Diagnostics</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Run tests individually or verify all services at once.</p>
          </div>
          {status && (
            <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${status.color}`}>
              {status.label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-card border border-border rounded-xl p-1 gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-primary text-white shadow' : 'text-muted-foreground hover:text-foreground'}`}
              title="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === 'list' ? 'bg-primary text-white shadow' : 'text-muted-foreground hover:text-foreground'}`}
              title="List view"
            >
              <List size={15} />
            </button>
          </div>

          <button
            onClick={() => fetchHealth()}
            disabled={loadingAll}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 text-sm font-bold rounded-xl transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
          >
            <RefreshCw size={15} className={loadingAll ? 'animate-spin' : ''} />
            {loadingAll ? 'Running...' : 'Test All'}
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className={viewMode === 'grid'
        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
        : 'flex flex-col gap-2'
      }>
        {/* Infrastructure */}
        <CardComponent id="supabase" title="Supabase Database" icon={Server} variant="infrastructure" />

        {/* Email */}
        <CardComponent id="brevo" title="Brevo Email API" icon={Mail} variant="email" />
        <CardComponent id="resend" title="Resend Email API" icon={Send} variant="email" />

        {/* Groq (Primary AI) */}
        <CardComponent id="groq_1" title="Groq / Llama (Key 1)" icon={Cpu} variant="groq" />
        <CardComponent id="groq_2" title="Groq / Llama (Key 2)" icon={Cpu} variant="groq" />
        <CardComponent id="groq_3" title="Groq / Llama (Key 3)" icon={Cpu} variant="groq" />
        <CardComponent id="groq_4" title="Groq / Llama (Key 4)" icon={Cpu} variant="groq" />
        <CardComponent id="groq_5" title="Groq / Llama (Key 5)" icon={Cpu} variant="groq" />

        {/* Gemini (Fallback AI) */}
        <CardComponent id="gemini_1" title="Gemini API (Key 1)" icon={Bot} variant="gemini" />
        <CardComponent id="gemini_2" title="Gemini API (Key 2)" icon={Bot} variant="gemini" />
        <CardComponent id="gemini_3" title="Gemini API (Key 3)" icon={Bot} variant="gemini" />
        <CardComponent id="gemini_4" title="Gemini API (Key 4)" icon={Bot} variant="gemini" />
        <CardComponent id="gemini_5" title="Gemini API (Key 5)" icon={Bot} variant="gemini" />
      </div>
    </div>
  );
}
