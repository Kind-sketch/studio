
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
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/ai/flows/translate-text';

const navKeywords: { [key: string]: string[] } = {
  '/buyer/home': ['home', 'main', 'start', 'feed', 'discover'],
  '/buyer/categories': ['categories', 'browse', 'sections', 'types'],
  '/buyer/customize': ['customize', 'design', 'create', 'AI design'],
  '/buyer/profile': ['profile', 'account', 'me', 'my details'],
  '/artisan/home': ['home', 'main', 'start', 'trends', 'community', 'popular', 'feed'],
  '/artisan/dashboard': ['revenue', 'money', 'earnings', 'dashboard', 'income', 'finances'],
  '/artisan/my-products': ['my products', 'products', 'creations', 'gallery', 'uploaded', 'items', 'inventory'],
  '/artisan/stats': ['statistics', 'stats', 'performance', 'analytics', 'charts', 'data'],
  '/artisan/profile': ['profile', 'account', 'me', 'my details', 'user'],
  '/artisan/orders': ['orders', 'requests', 'shipments', 'manage orders'],
  '/artisan/sponsors': ['sponsors', 'sponsorships', 'partners', 'supporters'],
  '/artisan/saved-collection': ['saved', 'collection', 'bookmarks', 'favorites', 'inspirations'],
  '/sponsor/dashboard': ['dashboard', 'home', 'main', 'discover', 'sponsor dashboard'],
  '/sponsor/revenue': ['revenue', 'generated', 'money', 'earnings', 'returns', 'investment'],
  '/sponsor/requests': ['requests', 'offers', 'sent', 'pending', 'sponsorship requests'],
};

export default function MainHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast, dismiss } = useToast();
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const toastIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = language;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = async (event: any) => {
          const spokenText = event.results[0][0].transcript;
          if (toastIdRef.current) {
            const { id } = toast({
              id: toastIdRef.current,
              title: 'Processing Command...',
              description: `"${spokenText}"`,
            });
            toastIdRef.current = id;
          }

          if (event.results[0].isFinal) {
            if (language === 'en') {
              handleVoiceCommand(spokenText.toLowerCase());
            } else {
              try {
                const { translatedTexts } = await translateText({ texts: [spokenText], targetLanguage: 'en' });
                const translatedCommand = translatedTexts[0];
                if (translatedCommand) {
                  handleVoiceCommand(translatedCommand.toLowerCase());
                } else {
                  throw new Error('Translation failed');
                }
              } catch (e) {
                if (toastIdRef.current) {
                  toast({
                    id: toastIdRef.current,
                    variant: 'destructive',
                    title: 'Translation Error',
                    description: 'Could not translate your command.',
                  });
                }
              }
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          if (toastIdRef.current) {
            toast({
              id: toastIdRef.current,
              variant: 'destructive',
              title: 'Voice Error',
              description: 'Could not recognize your voice. Please try again.',
            });
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          setTimeout(() => {
            if (toastIdRef.current) dismiss(toastIdRef.current);
          }, 3000);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [language, toast, dismiss, router]);

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.lang = language;
        recognitionRef.current.start();
        setIsListening(true);
        const { id } = toast({
          title: 'Listening...',
          description: 'Please say a command.',
          duration: 5000,
        });
        toastIdRef.current = id;
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
        if (toastIdRef.current) {
          toast({
            id: toastIdRef.current,
            title: 'Navigating...',
            description: `Taking you to the requested page.`,
          });
        }
        return;
      }
    }
    if (toastIdRef.current) {
      toast({
        id: toastIdRef.current,
        variant: 'destructive',
        title: 'Command Not Recognized',
        description: `Could not find a page for "${command}".`,
      });
    }
  };

  const handleSupportClick = () => {
    toast({
      title: 'Support',
      description: 'Support functionality is not yet implemented.',
    });
  };

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
  );
}
