
'use client';

import ArtisanSidebar, { HeaderActions } from '@/components/artisan-sidebar';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PanelLeft, Plus } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import TutorialDialog from '@/components/tutorial-dialog';

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

  const isAddProductPage = pathname === '/artisan/add-product';

  return (
    <div className="flex flex-col h-full w-full">
      {!isAddProductPage && (
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-4">
          <div className="flex items-center gap-2">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                >
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-0 w-[260px]">
                <ArtisanSidebar closeSheet={() => setIsSheetOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="ml-auto flex items-center">
            <HeaderActions />
          </div>
        </header>
      )}
      
      <main className={cn("flex-1 overflow-y-auto bg-muted/40 relative", isAddProductPage && "pt-14")}>
        {children}
        
        {!isAddProductPage && (
          <Link href="/artisan/add-product" passHref>
            <Button
              size="icon"
              className="absolute bottom-6 right-6 h-16 w-16 rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110 hover:bg-primary/90"
              aria-label="Add New Product"
            >
              <Plus className="h-8 w-8" />
            </Button>
          </Link>
        )}
      </main>
    </div>
  );
}
