
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import 'regenerator-runtime/runtime';
import { Mic, MessageCircleQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

const navKeywords: { [key: string]: string[] } = {
  '/buyer/home': ['home', 'main', 'start'],
  '/buyer/categories': ['categories', 'browse', 'sections'],
  '/buyer/customize': ['customize', 'design', 'create'],
  '/buyer/profile': ['profile', 'account', 'me'],
};

export default function MainHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const command = event.results[0][0].transcript.toLowerCase();
          handleVoiceCommand(command);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          toast({
            variant: 'destructive',
            title: 'Voice Error',
            description: 'Could not recognize your voice. Please try again.',
          });
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [toast, router]);

  const handleMicClick = () => {
     if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
        toast({
          title: 'Listening...',
          description: 'Please say a command.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Not Supported',
          description: 'Voice command is not supported on your browser.',
        });
      }
    }
  };

  const handleVoiceCommand = (command: string) => {
    for (const path in navKeywords) {
      if (navKeywords[path].some(keyword => command.includes(keyword))) {
        router.push(path);
        return;
      }
    }
    toast({
      variant: 'destructive',
      title: 'Command Not Recognized',
      description: `Could not find a page for "${command}".`,
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
      <header className={cn("sticky top-0 z-50 flex h-16 items-center border-b bg-card px-4 md:px-6", shouldHideOnMobile && "hidden md:flex")}>
        <div className="flex items-center gap-2 font-semibold">
          <Logo className="h-8 w-8 text-primary" />
          <span className="hidden font-headline text-xl sm:inline-block">Artistry Havens</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
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
            className={cn("rounded-full bg-primary/10 text-primary hover:bg-primary/20", isListening && "animate-pulse")}
          >
            <Mic className="h-5 w-5" />
          </Button>
        </div>
      </header>
   )
}

    