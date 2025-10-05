'use client';

import ArtisanSidebar from '@/components/artisan-sidebar';
import { usePathname } from 'next/navigation';

export default function ArtisanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const noSidebarRoutes = ['/artisan/register', '/artisan/register-recovery', '/artisan/category-selection', '/artisan/profile', '/artisan/post-auth', '/artisan/add-product'];

  if (noSidebarRoutes.includes(pathname)) {
    return <main>{children}</main>;
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        <ArtisanSidebar />
        <main className="flex-1 overflow-y-auto bg-secondary/30">{children}</main>
      </div>
    </div>
  );
}
