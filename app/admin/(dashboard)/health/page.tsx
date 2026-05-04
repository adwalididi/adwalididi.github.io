import HealthDashboardClient from '@/components/admin/health-dashboard-client';


export default function AdminHealth() {
  return (
    <>
      <div className="hidden md:flex items-center justify-between mb-6 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight leading-none">System <span className="text-primary">Health</span></h1>
          <p className="text-muted-foreground text-[10px] uppercase tracking-[0.25em] font-black opacity-80 mt-2">API Diagnostics &amp; Telemetry</p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <HealthDashboardClient />
      </div>
    </>
  );
}
