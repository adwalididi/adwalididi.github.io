import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminLogo } from '@/components/admin/admin-logo';
import { AdminThemeProvider } from '@/components/admin/admin-theme-provider';
import { logout } from '@/app/actions/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminThemeProvider>
      <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col h-screen overflow-y-auto">
          <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full flex flex-col flex-1 min-h-0">
            {/* Header (Mobile) */}
            <div className="flex sm:flex-row flex-col gap-6 sm:items-center justify-between mb-4 pb-2 border-b border-border/50 break-words md:hidden">
              <div className="flex items-center gap-5">
                <Link href="/" className="p-3 rounded-xl bg-card border border-border hover:bg-muted transition-all text-primary" title="Back to Home">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </Link>
                <div className="flex items-center gap-4">
                  <AdminLogo />
                  <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight leading-none">Adwali<span className="text-primary">didi</span></h1>
                    <p className="text-muted-foreground text-[10px] uppercase tracking-[0.25em] font-black opacity-80 mt-1">Admin Panel</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <form action={logout}>
                  <button type="submit" className="text-xs font-bold bg-card hover:bg-destructive/10 text-foreground px-5 py-2.5 rounded-lg transition-all border border-border flex items-center justify-center gap-2 group hover:border-destructive/30 hover:text-destructive cursor-pointer">
                    Logout
                  </button>
                </form>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AdminThemeProvider>
  );
}
