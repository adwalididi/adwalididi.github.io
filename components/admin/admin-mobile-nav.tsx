'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Send, Activity, Home } from 'lucide-react';

const adminNavItems = [
  { href: '/', label: 'Site', icon: Home },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/outreach', label: 'Outreach', icon: Send },
  { href: '/admin/health', label: 'Health', icon: Activity },
];

export function AdminMobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return false; // never highlight "Site" as active
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Admin mobile navigation"
    >
      <div className="bg-card/95 backdrop-blur-xl border-t border-border shadow-[0_-4px_24px_rgba(0,0,0,0.15)]">
        <div className="flex items-stretch h-16">
          {adminNavItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
                aria-current={active ? 'page' : undefined}
                aria-label={`Navigate to ${item.label}`}
              >
                {active && (
                  <span
                    className="absolute top-0 left-1/4 right-1/4 h-[2px] rounded-full bg-primary"
                    aria-hidden="true"
                  />
                )}
                <Icon
                  size={20}
                  className={active ? 'text-primary' : 'text-muted-foreground'}
                  aria-hidden="true"
                />
                <span
                  className={`text-[10px] font-semibold tracking-wide ${
                    active ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
