
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Sparkles, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/buyer/home', label: 'Home', icon: Home },
  { href: '/buyer/categories', label: 'Categories', icon: LayoutGrid },
  { href: '/buyer/customize', label: 'Customize', icon: Sparkles },
  { href: '/buyer/profile', label: 'Profile', icon: User },
];

export default function BuyerBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card md:hidden">
      <div className="grid h-16 grid-cols-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isCustomize = item.label === 'Customize';
          return (
            <Link
              href={item.href}
              key={item.label}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors relative',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary',
                isCustomize && 'bg-yellow-100/70 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 rounded-lg m-1 shadow-[0_0_15px_rgba(253,244,140,0.8)]'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className={cn(isCustomize && 'font-bold')}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
