
'use client';

import BuyerBottomNav from '@/components/buyer-bottom-nav';
import BuyerHeader from '@/components/buyer-header';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isProfilePage = pathname === '/buyer/profile';

  return (
    <div className="flex min-h-screen flex-col">
      <BuyerHeader />
      <main className="flex-1 pb-20 pt-16 md:pb-0 md:pt-0 relative">
        {children}

        {!isProfilePage && (
           <Link href="/buyer/profile" passHref>
            <Button
              size="icon"
              className="absolute bottom-6 right-6 h-16 w-16 rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110 hover:bg-primary/90 md:hidden"
              aria-label="My Profile"
            >
              <User className="h-8 w-8" />
            </Button>
          </Link>
        )}
      </main>
      <BuyerBottomNav />
    </div>
  );
}
