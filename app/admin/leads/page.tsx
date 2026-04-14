import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { cookies } from 'next/headers';
import LeadsTableClient from '@/components/admin/leads-table-client';
import { AdminLogo } from '@/components/admin/admin-logo';
import { AdminThemeProvider } from '@/components/admin/admin-theme-provider';

export const runtime = 'edge';

export default async function AdminLeads({ 
  searchParams 
}: { 
  searchParams: Promise<{ secret?: string, error?: string }> 
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  
  // 1. URL SECURITY CHECK (First Layer)
  const providedSecret = params.secret?.trim();
  const actualSecret = process.env.ADMIN_PASSWORD?.trim();
  const isGateOpen = cookieStore.get('admin_gate')?.value === 'active';

  if (!isGateOpen && providedSecret && actualSecret && providedSecret === actualSecret) {
    cookieStore.set('admin_gate', 'active', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/admin/',
    });
    redirect('/admin/leads/');
  }

  if (!isGateOpen && (!providedSecret || providedSecret !== actualSecret)) {
    redirect('/'); 
  }

  // 2. CHECK SESSION COOKIE (Second Layer)
  const session = cookieStore.get('admin_session');
  // Since you said you log in manually every time, we set a session cookie.
  const isLoggedIn = session && session.value === 'active';

  // 3. SERVER ACTIONS (Executes securely on the server)
  async function handleLogin(formData: FormData) {
    'use server';
    const id = formData.get('id');
    const password = formData.get('password');

    // Make sure variables exist
    if (!process.env.ADMIN_USER_ID || !process.env.ADMIN_USER_PASSWORD) {
      redirect('/admin/leads/?error=server');
    }

    if (id === process.env.ADMIN_USER_ID && password === process.env.ADMIN_USER_PASSWORD) {
      // Login Success: Set ephemeral session cookie (expires when browser closes)
      (await cookies()).set('admin_session', 'active', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Use 'lax' for better cross-context (IP/mobile) reliability
        path: '/admin/leads/' // Match canonical trailing slash path
      });
      redirect('/admin/leads/'); 
    } else {
      // Login Failed
      redirect('/admin/leads/?error=1');
    }
  }

  async function handleLogout() {
    'use server';
    // Must specify the same path the cookie was set with, otherwise a different
    // cookie (at path '/') is targeted and the session cookie survives.
    (await cookies()).delete({ name: 'admin_session', path: '/admin/leads/' });
    redirect('/admin/leads/');
  }

  async function updateLeadStatus(leadId: string, newStatus: string) {
    'use server';
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', leadId);
    
    if (error) throw error;
  }

  // 4. RENDER LOGIN FORM (If not logged in)
  if (!isLoggedIn) {
    return (
      <AdminThemeProvider>
        <div className="p-6 sm:p-8 bg-background min-h-screen text-foreground flex flex-col items-center justify-center font-sans tracking-tight">
        <div className="w-full max-w-md mb-8 flex justify-between items-center">
            <Link href="/" className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-2 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                Back to Home
            </Link>
        </div>
        
        <form action={handleLogin} className="bg-card p-8 rounded-[2rem] border border-border w-full max-w-md flex flex-col gap-6 shadow-xl shadow-teal-900/5">
          <div className="text-center mb-2">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Admin <span className="text-primary">Login</span></h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium">Please enter your credentials to continue</p>
          </div>
          
          {params.error === '1' && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-xl text-center animate-in fade-in zoom-in duration-300 font-bold">
              Invalid User ID or Password.
            </div>
          )}
          {params.error === 'server' && (
            <div className="bg-orange-500/10 border border-orange-500/20 text-orange-600 text-sm p-3 rounded-xl text-center font-bold">
              Server auth variables missing.
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="text-primary text-[11px] font-black uppercase tracking-widest ml-1">User ID</label>
            <input 
              type="text" 
              name="id" 
              required 
              autoComplete="off"
              className="bg-background border border-border rounded-xl p-4 text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30 text-base" 
              placeholder="Enter User ID"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-primary text-[11px] font-black uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              autoComplete="new-password"
              className="bg-background border border-border rounded-xl p-4 text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30 text-base" 
              placeholder="Enter Password"
            />
          </div>

          <button type="submit" className="mt-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/10 active:scale-[0.98] cursor-pointer text-base">
            Authenticate
          </button>
        </form>
      </div>
      </AdminThemeProvider>
    );
  }

  // 5. RENDER COMMAND CENTER (If securely logged in)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
  );

  const { data: leads } = await supabase.from('leads').select('*').order('created_at', { ascending: false });

  return (
    <AdminThemeProvider>
      <div className="p-4 sm:p-8 bg-background h-screen text-foreground font-sans overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="flex sm:flex-row flex-col gap-6 sm:items-center justify-between mb-4 pb-2 border-b border-border/50 break-words">
          <div className="flex items-center gap-5">
             <Link href="/" className="p-3 rounded-xl bg-card border border-border hover:bg-muted transition-all text-primary" title="Back to Home">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
             </Link>
              <div className="flex items-center gap-4">
                <AdminLogo />
                <div className="h-10 w-px bg-border/50 hidden sm:block" />
                <div>
                   <h1 className="text-3xl font-bold text-foreground tracking-tight leading-none">Lead <span className="text-primary">Command</span></h1>
                   <p className="text-muted-foreground text-[10px] uppercase tracking-[0.25em] font-black opacity-80 mt-1">Real-time Inquiries</p>
                </div>
              </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg hidden sm:block">
              <span className="text-xs font-black text-primary uppercase tracking-widest">Leads: {leads?.length || 0}</span>
            </div>
            <form action={handleLogout}>
              <button type="submit" className="text-xs font-bold bg-card hover:bg-destructive/10 text-foreground px-5 py-2.5 rounded-lg transition-all border border-border flex items-center justify-center gap-2 group hover:border-destructive/30 hover:text-destructive cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100 transition-opacity"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Logout
              </button>
            </form>
          </div>
        </div>

        {/* ── Dashboard Client Component ── */}
        <div className="flex-1 min-h-0 bg-card rounded-[2rem] border border-border overflow-hidden shadow-2xl shadow-black/5">
          <LeadsTableClient 
            leads={leads || []} 
            onStatusUpdate={updateLeadStatus}
          />
        </div>
      </div>
    </div>
    </AdminThemeProvider>
  );
}
