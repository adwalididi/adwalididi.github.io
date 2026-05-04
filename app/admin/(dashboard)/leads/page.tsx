import { createClient } from '@supabase/supabase-js';
import LeadsTableClient from '@/components/admin/leads-table-client';


export const dynamic = 'force-dynamic';

export default async function AdminLeads() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
  );

  const { data: leads } = await supabase.from('leads').select('*').order('created_at', { ascending: false });

  async function updateLeadStatus(leadId: string, newStatus: string) {
    'use server';
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { error } = await supabaseClient
      .from('leads')
      .update({ status: newStatus })
      .eq('id', leadId);
    
    if (error) throw error;
  }

  return (
    <>
      <div className="hidden md:flex items-center justify-between mb-6 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight leading-none">Lead <span className="text-primary">Command</span></h1>
          <p className="text-muted-foreground text-[10px] uppercase tracking-[0.25em] font-black opacity-80 mt-2">Real-time Inquiries</p>
        </div>
        <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
          <span className="text-xs font-black text-primary uppercase tracking-widest">Leads: {leads?.length || 0}</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-card rounded-[2rem] border border-border overflow-hidden shadow-2xl shadow-black/5">
        <LeadsTableClient 
          leads={leads || []} 
          onStatusUpdate={updateLeadStatus}
        />
      </div>
    </>
  );
}
