
'use client';

import BuyerBottomNav from '@/components/buyer-bottom-nav';
import BuyerHeader from '@/components/buyer-header';
import { usePathname } from 'next/navigation';

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      <BuyerHeader />
      <main className="flex-1 pb-20 pt-16 md:pb-0 md:pt-0 relative">
        {children}
      </main>
      <BuyerBottomNav />
    </div>
  );
}
