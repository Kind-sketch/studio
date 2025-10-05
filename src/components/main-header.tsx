'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mic, MessageCircleQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function MainHeader() {
  const pathname = usePathname();
  const { toast } = useToast();

  const handleMicClick = () => {
    toast({
      title: 'Voice Input',
      description: 'Voice command functionality is not yet implemented.',
    });
  };
  
  const handleSupportClick = () => {
    toast({
      title: 'Support',
      description: 'Support functionality is not yet implemented.',
    });
  };

  const hiddenPaths = ['/', '/language-selection', '/role-selection'];
  if (hiddenPaths.includes(pathname)) {
    return null;
  }
  
  // Specific check for artisan/sponsor pages to avoid duplicating headers on mobile.
  // The sidebars provide their own header on mobile.
  const isArtisanPage = pathname.startsWith('/artisan/');
  const isSponsorPage = pathname.startsWith('/sponsor/');

  const shouldHideOnMobile = isArtisanPage || isSponsorPage;


   return (
      <header className={cn("sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-card px-4 md:px-6", shouldHideOnMobile && "md:hidden")}>
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Logo className="h-8 w-8 text-primary" />
          <span className="hidden font-headline text-xl sm:inline-block">Artistry Havens</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSupportClick}
            aria-label="Support"
          >
            <MessageCircleQuestion className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMicClick}
            aria-label="Use Voice Command"
            className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 animate-pulse"
          >
            <Mic className="h-5 w-5" />
          </Button>
        </div>
      </header>
   )
}
