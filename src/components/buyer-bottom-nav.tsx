
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/buyer/home', label: 'Home', icon: Home },
  { href: '/buyer/categories', label: 'Categories', icon: LayoutGrid },
  { href: '/buyer/profile', label: 'Profile', icon: User },
];

export default function BuyerBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] z-40 border-t bg-card md:hidden">
      <div className="grid h-16 grid-cols-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              href={item.href}
              key={item.label}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
