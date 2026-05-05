import LeadsTableClient from '@/components/admin/leads-table-client';

export default function AdminLeads() {
  return (
    <>
      <div className="hidden md:flex items-center justify-between mb-6 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight leading-none">Lead <span className="text-primary">Command</span></h1>
          <p className="text-muted-foreground text-[10px] uppercase tracking-[0.25em] font-black opacity-80 mt-2">Real-time Inquiries</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-card rounded-[2rem] border border-border overflow-hidden shadow-2xl shadow-black/5">
        <LeadsTableClient />
      </div>
    </>
  );
}
