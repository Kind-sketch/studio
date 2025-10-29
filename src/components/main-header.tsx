
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import 'regenerator-runtime/runtime';
import { MessageCircleQuestion, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/services/translation-service';
import SupportDialog from '@/components/support-dialog';


interface MainHeaderProps {
    isArtisanFlow?: boolean;
}

export default function MainHeader({ isArtisanFlow = false }: MainHeaderProps) {
  const pathname = usePathname();

  const isSponsorPage = pathname.startsWith('/sponsor/');
  const shouldHideOnDesktop = isSponsorPage && !isArtisanFlow;

  return (
    <div className={cn("ml-auto flex items-center gap-2", shouldHideOnDesktop && "md:hidden")}>
        <SupportDialog>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Support"
          >
            <MessageCircleQuestion className="h-5 w-5" />
          </Button>
        </SupportDialog>
      </div>
  );
}
