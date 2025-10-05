
'use client';

import ArtisanSidebar from '@/components/artisan-sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ArtisanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const noSidebarRoutes = ['/artisan/register', '/artisan/category-selection', '/artisan/post-auth'];

  if (noSidebarRoutes.includes(pathname)) {
    return <main>{children}</main>;
  }

  return (
    <div className="flex h-full flex-col md:flex-row">
      <ArtisanSidebar />
      <main className="flex-1 flex flex-col bg-secondary/30 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
        {pathname !== '/artisan/add-product' && (
            <Link href="/artisan/add-product" className="fixed bottom-8 right-8 z-30">
              <Button size="icon" className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90 shadow-lg">
                <Plus className="h-6 w-6" />
              </Button>
            </Link>
          )}
      </main>
    </div>
  );
}
