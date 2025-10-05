
'use client';

import ArtisanSidebar, { HeaderActions } from '@/components/artisan-sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, PanelLeft } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

export default function ArtisanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const noSidebarRoutes = ['/artisan/register', '/artisan/category-selection', '/artisan/post-auth'];
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  if (noSidebarRoutes.includes(pathname)) {
    return <main>{children}</main>;
  }

  return (
    <div className="flex h-screen w-full flex-col bg-secondary/30">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full fixed top-0 left-0 z-50">
        <ArtisanSidebar />
      </div>

      <div className="md:ml-64 flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card px-4 md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-[300px] p-0 z-[101]">
              <ArtisanSidebar closeSheet={() => setIsSheetOpen(false)} />
            </SheetContent>
          </Sheet>
          <HeaderActions />
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        
        {pathname !== '/artisan/add-product' && (
          <Link href="/artisan/add-product" className="fixed bottom-8 right-8 z-30">
            <Button size="icon" className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90 shadow-lg">
              <Plus className="h-6 w-6" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
