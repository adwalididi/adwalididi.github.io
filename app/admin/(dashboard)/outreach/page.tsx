import { createClient } from '@supabase/supabase-js';
import OutreachDashboardClient from '@/components/admin/outreach-dashboard-client';


export const dynamic = 'force-dynamic';

export default async function AdminOutreach() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get today's sent email count
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count: sentToday } = await supabase
    .from('outreach_log')
    .select('*', { count: 'exact', head: true })
    .eq('channel', 'email')
    .eq('status', 'sent')
    .gte('sent_at', today.toISOString());

  return (
    <>
      <div className="hidden md:flex items-center justify-between mb-6 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight leading-none">Outreach <span className="text-primary">Console</span></h1>
          <p className="text-muted-foreground text-[10px] uppercase tracking-[0.25em] font-black opacity-80 mt-2">Email &amp; WhatsApp Campaigns</p>
        </div>
        <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
          <span className="text-xs font-black text-primary uppercase tracking-widest">📧 Emails Today: {sentToday || 0}/300</span>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <OutreachDashboardClient sentTodayInitial={sentToday || 0} />
      </div>
    </>
  );
}
