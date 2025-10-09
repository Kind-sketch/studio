
'use client';

import ArtisanSidebar, { HeaderActions } from '@/components/artisan-sidebar';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PanelLeft, Plus } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ArtisanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const noSidebarRoutes = ['/artisan/register', '/artisan/category-selection', '/artisan/post-auth', '/artisan/register-recovery'];
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showDesktopAside, setShowDesktopAside] = useState(true);

  if (noSidebarRoutes.includes(pathname)) {
    return <main className="h-full overflow-y-auto">{children}</main>;
  }

  return (
    <div
      className={cn(
        "grid min-h-screen w-full",
        showDesktopAside ? "md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]" : "md:grid-cols-[0px_1fr] lg:grid-cols-[0px_1fr]"
      )}
    >
      <div className={cn("hidden md:block border-r bg-card overflow-y-auto scroll-smooth")} aria-hidden={!showDesktopAside}>
        <ArtisanSidebar />
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center justify-between border-b bg-card px-4 lg:h-[60px] lg:px-6">
          {/* Desktop toggle for collapsing/expanding sidebar */}
          <div className="hidden md:block">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowDesktopAside((v) => !v)}
              aria-label="Toggle navigation menu"
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
          </div>
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
            <SheetContent side="left" className="flex flex-col p-0">
               <ArtisanSidebar closeSheet={() => setIsSheetOpen(false)} />
            </SheetContent>
          </Sheet>
          <HeaderActions />
        </header>
        <main className="flex-1 bg-muted/40 relative overflow-visible md:overflow-y-auto">
          {children}
           <Link href="/artisan/add-product" passHref>
              <Button
                size="icon"
                className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110 hover:bg-primary/90"
                aria-label="Add New Product"
              >
                <Plus className="h-8 w-8" />
              </Button>
            </Link>
        </main>
      </div>
    </div>
  );
}
