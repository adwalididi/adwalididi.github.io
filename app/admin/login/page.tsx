'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { AdminThemeProvider } from '@/components/admin/admin-theme-provider';

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorParam = searchParams.get('error');
  const redirectTo = searchParams.get('redirect') || '/admin/leads';

  const [authState, setAuthState] = useState<'loading' | 'gate' | 'login'>('loading');
  const [error, setError] = useState<string | null>(errorParam === 'gate' ? 'Invalid access secret.' : errorParam === '1' ? 'Invalid User ID or Password.' : errorParam === 'server' ? 'Server auth variables missing.' : null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/auth/check')
      .then(r => r.json())
      .then(data => {
        if (data.hasGate && data.hasSession) {
          router.replace(redirectTo);
        } else if (data.hasGate) {
          setAuthState('login');
        } else {
          setAuthState('gate');
        }
      })
      .catch(() => setAuthState('gate'));
  }, [redirectTo, router]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: form.get('id'),
          password: form.get('password'),
          redirect: redirectTo,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.replace(data.redirect || '/admin/leads');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  }

  if (authState === 'loading') {
    return (
      <div className="p-6 sm:p-8 bg-background min-h-screen text-foreground flex items-center justify-center font-sans">
        <div className="text-muted-foreground text-sm font-medium animate-pulse">Loading...</div>
      </div>
    );
  }

  if (authState === 'gate') {
    return (
      <div className="p-6 sm:p-8 bg-background min-h-screen text-foreground flex flex-col items-center justify-center font-sans tracking-tight">
        <div className="w-full max-w-md mb-8 flex justify-between items-center">
          <Link href="/" className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-2 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Home
          </Link>
        </div>

        <form method="post" action="/admin/open-gate" className="bg-card p-8 rounded-[2rem] border border-border w-full max-w-md flex flex-col gap-6 shadow-xl shadow-teal-900/5">
          <input type="hidden" name="target" value={redirectTo} />
          <div className="text-center mb-2">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">System <span className="text-primary">Gateway</span></h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium">Enter the access secret to continue</p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-xl text-center font-bold">
              {error}
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
    );
  }

  // Login form
  return (
    <div className="p-6 sm:p-8 bg-background min-h-screen text-foreground flex flex-col items-center justify-center font-sans tracking-tight">
      <div className="w-full max-w-md mb-8 flex justify-between items-center">
        <Link href="/" className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-2 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Home
        </Link>
      </div>

      <form onSubmit={handleLogin} className="bg-card p-8 rounded-[2rem] border border-border w-full max-w-md flex flex-col gap-6 shadow-xl shadow-teal-900/5">
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Admin <span className="text-primary">Login</span></h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium">Authenticate to access the system</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-xl text-center animate-in fade-in zoom-in duration-300 font-bold">
            {error}
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

        <button type="submit" disabled={submitting} className="mt-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/10 active:scale-[0.98] cursor-pointer text-base disabled:opacity-50">
          {submitting ? 'Authenticating...' : 'Authenticate'}
        </button>
      </form>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <AdminThemeProvider>
      <Suspense fallback={
        <div className="p-6 sm:p-8 bg-background min-h-screen text-foreground flex items-center justify-center font-sans">
          <div className="text-muted-foreground text-sm font-medium animate-pulse">Loading...</div>
        </div>
      }>
        <LoginContent />
      </Suspense>
    </AdminThemeProvider>
  );
}
