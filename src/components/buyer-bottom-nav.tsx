
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, User, Sparkles } from 'lucide-react';
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
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] z-40 border-t bg-card md:hidden">
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
                isCustomize && 'bg-red-500/20 text-red-700 hover:text-red-800'
              )}
            >
              <div className={cn(
                'absolute -top-3 rounded-full p-2.5 leading-none transition-all duration-300',
                isCustomize ? 'bg-red-500 shadow-lg' : 'bg-transparent'
              )}>
                 <item.icon className={cn('h-5 w-5', isCustomize ? 'text-white' : '')} />
              </div>
              <span className={cn('mt-4', isCustomize ? 'font-bold' : '')}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
