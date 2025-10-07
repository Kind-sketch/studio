
'use client';

import ArtisanSidebar, { HeaderActions } from '@/components/artisan-sidebar';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

export default function ArtisanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const noSidebarRoutes = ['/artisan/register', '/artisan/category-selection', '/artisan/post-auth', '/artisan/register-recovery'];
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  if (noSidebarRoutes.includes(pathname)) {
    return <main className="h-full overflow-y-auto">{children}</main>;
  }

  return (
    <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <ArtisanSidebar />
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 w-full max-w-[280px]">
               <ArtisanSidebar closeSheet={() => setIsSheetOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Can add a search bar here if needed */}
          </div>
          <HeaderActions />
        </header>
        <main className="flex-1 overflow-y-auto bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
}
