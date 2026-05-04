'use client';

import { useState } from 'react';
import { Server, Mail, Bot, RefreshCw, CheckCircle2, XCircle, Clock, Send, Play } from 'lucide-react';

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
  [key: string]: HealthStatus | undefined;
}

export default function HealthDashboardClient() {
  const [health, setHealth] = useState<ApiHealth>({});
  const [loadingAll, setLoadingAll] = useState(false);
  const [loadingService, setLoadingService] = useState<string | null>(null);

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

  const StatusIcon = ({ status }: { status?: string }) => {
    if (status === 'operational') return <CheckCircle2 className="text-emerald-500" size={24} />;
    if (status === 'failing') return <XCircle className="text-destructive" size={24} />;
    if (status === 'pending') return <Clock className="text-yellow-500 animate-spin" size={24} />;
    return <Clock className="text-muted-foreground opacity-50" size={24} />;
  };

  const StatusCard = ({ id, title, icon: Icon }: { id: string; title: string; icon: React.ElementType }) => {
    const data = health[id];
    const isChecking = loadingAll || loadingService === id || data?.status === 'pending';

    return (
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col group relative overflow-hidden transition-all hover:border-primary/20">
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <Icon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">{title}</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">
                {data?.status || 'Idle'}
              </p>
            </div>
          </div>
          <StatusIcon status={data?.status} />
        </div>
        
        <div className="space-y-3 mt-4 flex-1 relative z-10">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Latency</span>
            <span className="font-mono text-foreground font-medium">{data?.latency || 0}ms</span>
          </div>
          {data?.error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-xs text-destructive font-mono break-all max-h-32 overflow-y-auto">
              {data.error}
            </div>
          )}
        </div>

        <button 
          onClick={() => fetchHealth(id)}
          disabled={isChecking}
          className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 bg-background border border-border hover:bg-muted text-foreground text-sm font-bold rounded-xl transition-all disabled:opacity-50 relative z-10 cursor-pointer"
        >
          {isChecking ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
          {isChecking ? 'Checking...' : 'Run Test'}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-xl font-bold text-foreground">Service Diagnostics</h2>
           <p className="text-sm text-muted-foreground mt-1">Run tests individually or verify all services at once.</p>
        </div>
        <button 
          onClick={() => fetchHealth()}
          disabled={loadingAll}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 text-sm font-bold rounded-xl transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
        >
          <RefreshCw size={16} className={loadingAll ? 'animate-spin' : ''} />
          {loadingAll ? 'Running Checks...' : 'Test All Services'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Core Infrastructure */}
        <StatusCard id="supabase" title="Supabase Database" icon={Server} />
        
        {/* Email Providers */}
        <StatusCard id="brevo" title="Brevo Email API" icon={Mail} />
        <StatusCard id="resend" title="Resend Email API" icon={Send} />

        {/* AI Endpoints */}
        <StatusCard id="gemini_1" title="Gemini API (Key 1)" icon={Bot} />
        <StatusCard id="gemini_2" title="Gemini API (Key 2)" icon={Bot} />
        <StatusCard id="gemini_3" title="Gemini API (Key 3)" icon={Bot} />
        <StatusCard id="gemini_4" title="Gemini API (Key 4)" icon={Bot} />
        <StatusCard id="gemini_5" title="Gemini API (Key 5)" icon={Bot} />
      </div>
    </div>
  );
}
