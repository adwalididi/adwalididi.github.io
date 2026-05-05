import OutreachDashboardClient from '@/components/admin/outreach-dashboard-client';

export default function AdminOutreach() {
  return (
    <>
      <div className="hidden md:flex items-center justify-between mb-6 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight leading-none">Outreach <span className="text-primary">Console</span></h1>
          <p className="text-muted-foreground text-[10px] uppercase tracking-[0.25em] font-black opacity-80 mt-2">Email &amp; WhatsApp Campaigns</p>
        </div>
        {/* We moved the counter into the client component */}
      </div>

      <div className="flex-1 min-h-0">
        <OutreachDashboardClient />
      </div>
    </>
  );
}
