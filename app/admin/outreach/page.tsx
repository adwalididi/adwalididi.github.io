import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { cookies } from 'next/headers';
import OutreachDashboardClient from '@/components/admin/outreach-dashboard-client';
import { AdminThemeProvider } from '@/components/admin/admin-theme-provider';

export const runtime = 'edge';

export default async function AdminOutreach({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams;
  const cookieStore = await cookies();

  // 1. SECRET GATE CHECK (First Layer)
  const isGateOpen = cookieStore.get('admin_gate')?.value === 'active';

  if (!isGateOpen) {
    return (
      <AdminThemeProvider>
        <div className="p-6 sm:p-8 bg-background min-h-screen text-foreground flex flex-col items-center justify-center font-sans tracking-tight">
          <div className="w-full max-w-md mb-8 flex justify-between items-center">
            <Link href="/" className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-2 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Back to Home
            </Link>
          </div>

          <form method="post" action="/admin/open-gate/" className="bg-card p-8 rounded-[2rem] border border-border w-full max-w-md flex flex-col gap-6 shadow-xl shadow-teal-900/5">
            <input type="hidden" name="target" value="outreach" />
            <div className="text-center mb-2">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Outreach <span className="text-primary">Gateway</span></h1>
              <p className="text-muted-foreground text-sm mt-1 font-medium">Enter the access secret to continue</p>
            </div>

            {params.error === 'gate' && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-xl text-center font-bold">
                Invalid access secret.
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-primary text-[11px] font-black uppercase tracking-widest ml-1">Access Secret</label>
              <input
                type="password"
                name="secret"
                required
                autoComplete="off"
                className="bg-background border border-border rounded-xl p-4 text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30 text-base"
                placeholder="Enter Access Secret"
              />
            </div>

            <button type="submit" className="mt-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/10 active:scale-[0.98] cursor-pointer text-base">
              Continue
            </button>
          </form>
        </div>
      </AdminThemeProvider>
    );
  }

  // 2. CHECK SESSION COOKIE (Second Layer)
  const session = cookieStore.get('admin_session_outreach');
  const isLoggedIn = session && session.value === 'active';

  // 3. SERVER ACTIONS
  async function handleLogin(formData: FormData) {
    'use server';
    const id = formData.get('id');
    const password = formData.get('password');

    if (!process.env.ADMIN_USER_ID || !process.env.ADMIN_USER_PASSWORD) {
      redirect('/admin/outreach/?error=server');
    }

    if (id === process.env.ADMIN_USER_ID && password === process.env.ADMIN_USER_PASSWORD) {
      (await cookies()).set('admin_session_outreach', 'active', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/', // Must be '/' — API routes at /api/* also check this cookie
        maxAge: 60 * 60 * 24 // 24 hours expiry
      });
      redirect('/admin/outreach/');
    } else {
      redirect('/admin/outreach/?error=1');
    }
  }

  async function handleLogout() {
    'use server';
    (await cookies()).delete({ name: 'admin_session_outreach', path: '/' });
    redirect('/admin/outreach/');
  }

  // 4. RENDER LOGIN FORM
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
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Outreach <span className="text-primary">Console</span></h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium">Authenticate to access outreach tools</p>
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

  // 5. FETCH DATA & RENDER DASHBOARD
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
    <AdminThemeProvider>
      <div className="p-4 sm:p-8 bg-background min-h-screen text-foreground font-sans">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex sm:flex-row flex-col gap-6 sm:items-center justify-between mb-6 pb-4 border-b border-border/50">
          <div className="flex items-center gap-5">
            <Link href="/" className="p-3 rounded-xl bg-card border border-border hover:bg-muted transition-all text-primary" title="Back to Home">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight leading-none">Outreach <span className="text-primary">Console</span></h1>
              <p className="text-muted-foreground text-[10px] uppercase tracking-[0.25em] font-black opacity-80 mt-1">Email &amp; WhatsApp Campaigns</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg hidden sm:block">
              <span className="text-xs font-black text-primary uppercase tracking-widest">📧 Emails Today: {sentToday || 0}/300</span>
            </div>
            <Link href="/admin/leads/" className="text-xs font-bold bg-card hover:bg-muted text-foreground px-5 py-2.5 rounded-lg transition-all border border-border flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Leads CRM
            </Link>
            <form action={handleLogout}>
              <button type="submit" className="text-xs font-bold bg-card hover:bg-destructive/10 text-foreground px-5 py-2.5 rounded-lg transition-all border border-border flex items-center justify-center gap-2 group hover:border-destructive/30 hover:text-destructive cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100 transition-opacity"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Logout
              </button>
            </form>
          </div>
        </div>

        {/* Client Dashboard */}
        <OutreachDashboardClient sentTodayInitial={sentToday || 0} />
      </div>
    </div>
    </AdminThemeProvider>
  );
}
