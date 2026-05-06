'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Send, Activity, LogOut, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { AdminLogo } from '@/components/admin/admin-logo';

import { logout } from '@/app/actions/auth';

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const links = [
    { id: 'leads', label: 'Leads CRM', href: '/admin/leads', icon: Users },
    { id: 'outreach', label: 'Outreach Console', href: '/admin/outreach', icon: Send },
    { id: 'health', label: 'System Health', href: '/admin/health', icon: Activity },
  ];

  return (
    <div className={`shrink-0 border-r border-border/50 bg-card/30 flex flex-col h-full hidden md:flex transition-all duration-300 relative ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-card border border-border rounded-full p-1 text-muted-foreground hover:text-foreground hover:border-primary shadow-sm z-10 transition-colors cursor-pointer"
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={`p-6 border-b border-border/50 flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3'}`}>
        <div className="shrink-0">
          <AdminLogo />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden whitespace-nowrap">
            <h2 className="font-bold text-foreground leading-tight tracking-tight">Adwalididi</h2>
            <p className="text-[10px] uppercase tracking-widest text-primary font-black">Admin</p>
          </div>
        )}
      </div>

      <div className={`flex-1 py-6 flex flex-col gap-2 overflow-x-hidden ${isCollapsed ? 'px-3 items-center' : 'px-4'}`}>
        <Link 
          href="/" 
          prefetch={false}
          className={`flex items-center rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted transition-all mb-4 overflow-hidden whitespace-nowrap ${isCollapsed ? 'justify-center w-12 h-12 p-0' : 'gap-3 px-4 py-3'}`}
          title="Back to Website"
        >
          <Home size={18} className="shrink-0" />
          {!isCollapsed && <span>Back to Website</span>}
        </Link>

        {!isCollapsed && (
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-black px-4 mb-2 whitespace-nowrap">
            Modules
          </div>
        )}

        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.id}
              href={link.href}
              prefetch={false}
              title={isCollapsed ? link.label : undefined}
              className={`flex items-center rounded-xl text-sm font-semibold transition-all overflow-hidden whitespace-nowrap ${
                isActive 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-muted-foreground hover:bg-muted border border-transparent'
              } ${isCollapsed ? 'justify-center w-12 h-12 p-0 shrink-0' : 'gap-3 px-4 py-3'}`}
            >
              <Icon size={18} className="shrink-0" />
              {!isCollapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </div>

      <div className={`p-4 border-t border-border/50 flex ${isCollapsed ? 'justify-center' : ''}`}>
        <form action={logout} className={isCollapsed ? '' : 'w-full'}>
          <button 
            type="submit" 
            title={isCollapsed ? "Logout" : undefined}
            className={`flex items-center justify-center rounded-xl text-sm font-bold text-foreground bg-background border border-border hover:border-destructive/30 hover:text-destructive hover:bg-destructive/10 transition-all group cursor-pointer overflow-hidden whitespace-nowrap ${isCollapsed ? 'w-12 h-12 p-0' : 'w-full gap-2 px-4 py-3'}`}
          >
            <LogOut size={16} className="opacity-70 group-hover:opacity-100 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
