
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import 'regenerator-runtime/runtime';
import {
  Home,
  FileText,
  DollarSign,
  LogOut,
  PanelLeft,
  MessageCircleQuestion,
  Mic,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/ai/flows/translate-text';
import { useEffect, useState, useRef } from 'react';
import { ScrollArea } from './ui/scroll-area';

const baseNavItems = [
  { href: '/sponsor/dashboard', label: 'Dashboard', icon: Home, keywords: ['dashboard', 'home', 'main'] },
  { href: '/sponsor/revenue', label: 'Revenue Generated', icon: DollarSign, keywords: ['revenue', 'generated', 'money', 'earnings'] },
  { href: '/sponsor/requests', label: 'Requests', icon: FileText, keywords: ['requests', 'offers'] },
];

function HeaderActions() {
    const { toast } = useToast();
    const router = useRouter();
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

    const handleSupportClick = () => {
        toast({
        title: 'Support',
        description: 'Support functionality is not yet implemented.',
        });
    };

    const handleVoiceCommand = (command: string) => {
        for (const item of baseNavItems) {
            if (item.keywords.some(keyword => command.includes(keyword))) {
                router.push(item.href);
                return;
            }
        }

        toast({
            variant: 'destructive',
            title: 'Command Not Recognized',
            description: `Could not find a page for "${command}".`,
        });
    };

    return (
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
    )
}

function NavContent() {
    const pathname = usePathname();
    const { toast } = useToast();
    const { language } = useLanguage();
    const [navItems, setNavItems] = useState(baseNavItems);
    const [translatedLogout, setTranslatedLogout] = useState('Logout');

    useEffect(() => {
        const translateNav = async () => {
            if (language !== 'en') {
                const labels = baseNavItems.map(item => item.label);
                const { translatedTexts } = await translateText({ texts: [...labels, 'Logout'], targetLanguage: language });
                
                const translatedNavItems = baseNavItems.map((item, index) => ({
                    ...item,
                    label: translatedTexts[index],
                }));
                setNavItems(translatedNavItems);
                setTranslatedLogout(translatedTexts[labels.length]);
            } else {
                setNavItems(baseNavItems);
                setTranslatedLogout('Logout');
            }
        };
        translateNav();
    }, [language]);


    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out."
        });
        // In a real app, you would handle actual logout logic here.
        // For now, we can just navigate to a public page.
        window.location.href = '/'; 
    };

    return (
        <div className="flex h-full flex-col bg-card">
            <div className="flex h-16 shrink-0 items-center border-b px-4">
            <Link href="/sponsor/dashboard" className="flex items-center gap-2 font-semibold">
                <Logo className="h-8 w-8 text-primary" />
                <span className="font-headline text-xl">Artistry Havens</span>
            </Link>
            </div>
            <ScrollArea className='flex-1'>
            <nav className="py-4 px-2">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                    <li key={item.label}>
                        <Link
                        href={item.href}
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent',
                            pathname === item.href && 'bg-accent text-primary font-semibold'
                        )}
                        >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                        </Link>
                    </li>
                    ))}
                </ul>
            </nav>
            </ScrollArea>
            <div className="mt-auto border-t p-4 space-y-2">
                <Link
                    href="/"
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent"
                >
                    <LogOut className="h-4 w-4" />
                    {translatedLogout}
                </Link>
                 <div className="flex justify-center pt-4">
                    <Logo className="h-10 w-10 text-muted-foreground" />
                </div>
            </div>
        </div>
    );
}

export default function SponsorSidebar() {
  return (
    <>
      <aside className="hidden w-64 flex-col border-r md:flex h-screen sticky top-0">
        <NavContent />
      </aside>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
             <SheetHeader className='p-4'>
              <SheetTitle className='sr-only'>Menu</SheetTitle>
            </SheetHeader>
            <NavContent />
          </SheetContent>
        </Sheet>
        <HeaderActions />
      </header>
    </>
  );
}

    