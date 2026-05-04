import { redirect } from 'next/navigation';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { AdminThemeProvider } from '@/components/admin/admin-theme-provider';


export default async function AdminLogin({
  searchParams
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const redirectTo = params.redirect || '/admin/leads';

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
            <input type="hidden" name="target" value={redirectTo.replace('/admin/', '').replace('/', '') || 'leads'} />
            <div className="text-center mb-2">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">System <span className="text-primary">Gateway</span></h1>
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
  const session = cookieStore.get('admin_session');
  const isLoggedIn = session && session.value === 'active';

  if (isLoggedIn) {
    redirect(redirectTo);
  }

  // 3. SERVER ACTIONS
  async function handleLogin(formData: FormData) {
    'use server';
    const id = formData.get('id');
    const password = formData.get('password');
    const redirectTarget = formData.get('redirect') as string || '/admin/leads';

    if (!process.env.ADMIN_USER_ID || !process.env.ADMIN_USER_PASSWORD) {
      redirect(`/admin/login/?error=server&redirect=${redirectTarget}`);
    }

    if (id === process.env.ADMIN_USER_ID && password === process.env.ADMIN_USER_PASSWORD) {
      (await cookies()).set('admin_session', 'active', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/', 
        maxAge: 60 * 60 * 24 
      });
      redirect(redirectTarget);
    } else {
      redirect(`/admin/login/?error=1&redirect=${redirectTarget}`);
    }
  }

  // 4. RENDER LOGIN FORM
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
        <input type="hidden" name="redirect" value={redirectTo} />
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Admin <span className="text-primary">Login</span></h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium">Authenticate to access the system</p>
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
