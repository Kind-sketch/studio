
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import 'regenerator-runtime/runtime';
import {
  Home,
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  User,
  PanelLeft,
  Package,
  HeartHandshake,
  Mic,
  MessageCircleQuestion,
  DollarSign,
  ShoppingBag,
  Bookmark
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
import { Separator } from './ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/ai/flows/translate-text';
import { useEffect, useState, useRef } from 'react';
import { ScrollArea } from './ui/scroll-area';


const baseNavItems = [
  { href: '/artisan/home', label: 'Home', icon: Home, keywords: ['home', 'main', 'start'] },
  { href: '/artisan/dashboard', label: 'Revenue', icon: DollarSign, keywords: ['revenue', 'money', 'earnings', 'dashboard'] },
  { href: '/artisan/my-products', label: 'My Products', icon: ShoppingBag, keywords: ['my products', 'products', 'creations', 'gallery', 'uploaded'] },
  { href: '/artisan/trends', label: 'Trends', icon: TrendingUp, keywords: ['trends', 'community', 'popular'] },
  { href: '/artisan/stats', label: 'Statistics', icon: BarChart3, keywords: ['statistics', 'stats', 'performance', 'analytics'] },
  { href: '/artisan/profile', label: 'My Profile', icon: User, keywords: ['profile', 'account', 'me'] },
];

const bottomNavItems: any[] = [
    // Settings removed
];

function HeaderActions() {
    const { toast, dismiss } = useToast();
    const router = useRouter();
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
                        if(toastIdRef.current) dismiss(toastIdRef.current);
                    }, 2000);
                };

                recognitionRef.current = recognition;
            }
        }
    }, [language, toast, dismiss]);

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
    
    const handleSupportClick = () => {
        toast({
        title: 'Support',
        description: 'Support functionality is not yet implemented.',
        });
    };

    const handleVoiceCommand = (command: string) => {
        const allNavItems = [
            ...baseNavItems,
            ...bottomNavItems,
            { href: '/artisan/orders', label: 'Orders', keywords: ['orders', 'requests'] },
            { href: '/artisan/sponsors', label: 'Sponsors', keywords: ['sponsors', 'sponsorships', 'partners'] },
            { href: '/artisan/saved-collection', label: 'Saved Collection', keywords: ['saved', 'collection', 'bookmarks'] },
        ];

        for (const item of allNavItems) {
            if (item.keywords.some(keyword => command.includes(keyword))) {
                router.push(item.href);
                 if (toastIdRef.current) {
                    toast({
                        id: toastIdRef.current,
                        title: 'Navigating...',
                        description: `Navigating to ${item.label}.`,
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
    const { language } = useLanguage();
    const [navItems, setNavItems] = useState(baseNavItems);
    const [translatedBottomNav, setTranslatedBottomNav] = useState(bottomNavItems);
    const [translatedOrders, setTranslatedOrders] = useState('Orders');
    const [translatedSponsors, setTranslatedSponsors] = useState('Sponsors');
    const [translatedSavedCollection, setTranslatedSavedCollection] = useState('Saved Collection');

    useEffect(() => {
        const translateNav = async () => {
            if (language !== 'en') {
                const labels = baseNavItems.map(item => item.label);
                const bottomLabels = bottomNavItems.map(item => item.label);
                const { translatedTexts } = await translateText({ texts: [...labels, 'Orders', 'Sponsors', 'Saved Collection', ...bottomLabels], targetLanguage: language });
                
                const translatedNavItems = baseNavItems.map((item, index) => ({
                    ...item,
                    label: translatedTexts[index],
                }));
                setNavItems(translatedNavItems);

                setTranslatedOrders(translatedTexts[labels.length]);
                setTranslatedSponsors(translatedTexts[labels.length + 1]);
                setTranslatedSavedCollection(translatedTexts[labels.length + 2]);

                const newBottomNav = bottomNavItems.map((item, index) => ({
                    ...item,
                    label: translatedTexts[labels.length + 3 + index],
                }));
                setTranslatedBottomNav(newBottomNav);

            } else {
                setNavItems(baseNavItems);
                setTranslatedBottomNav(bottomNavItems);
                setTranslatedOrders('Orders');
                setTranslatedSponsors('Sponsors');
                setTranslatedSavedCollection('Saved Collection');
            }
        };
        translateNav();
    }, [language]);
    
    const isLinkActive = (href: string) => {
        if (href === '/artisan/orders') {
            return pathname.startsWith('/artisan/orders');
        }
        if (href === '/artisan/sponsors') {
            return pathname.startsWith('/artisan/sponsors');
        }
         if (href === '/artisan/profile') {
            return pathname === '/artisan/profile';
        }
        return pathname === href;
    };

    return (
        <div className="flex h-full flex-col bg-sidebar">
            <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-4">
                <Link href="/artisan/home" className="flex items-center gap-2 font-semibold">
                    <Logo className="h-8 w-8 text-primary" />
                    <span className="font-headline text-xl">Artistry Havens</span>
                </Link>
            </div>
            <ScrollArea className="flex-1">
                <nav className="py-4 px-2">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                    <li key={item.label}>
                        <Link
                        href={item.href}
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all hover:text-primary hover:bg-sidebar-accent',
                            isLinkActive(item.href) && 'bg-sidebar-accent text-primary font-semibold'
                        )}
                        >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                        </Link>
                    </li>
                    ))}
                </ul>
                <Separator className="my-4" />
                <div className="px-3 py-2">
                    <Link
                    href={'/artisan/orders'}
                    className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all hover:text-primary hover:bg-sidebar-accent',
                        isLinkActive('/artisan/orders') && 'bg-sidebar-accent text-primary font-semibold'
                    )}
                    >
                    <Package className="h-4 w-4" />
                    {translatedOrders}
                    </Link>
                </div>
                <div className="px-3 py-2">
                    <Link
                    href={'/artisan/sponsors'}
                    className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all hover:text-primary hover:bg-sidebar-accent',
                        isLinkActive('/artisan/sponsors') && 'bg-sidebar-accent text-primary font-semibold'
                    )}
                    >
                    <HeartHandshake className="h-4 w-4" />
                    {translatedSponsors}
                    </Link>
                </div>
                <div className="px-3 py-2">
                    <Link
                    href={'/artisan/saved-collection'}
                    className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all hover:text-primary hover:bg-sidebar-accent',
                        isLinkActive('/artisan/saved-collection') && 'bg-sidebar-accent text-primary font-semibold'
                    )}
                    >
                    <Bookmark className="h-4 w-4" />
                    {translatedSavedCollection}
                    </Link>
                </div>
                </nav>
            </ScrollArea>
            <div className="mt-auto border-t border-sidebar-border p-4 space-y-2">
                {translatedBottomNav.map(item => (
                     <Link
                        key={item.href}
                        href={item.href}
                        className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all hover:text-primary hover:bg-sidebar-accent", isLinkActive(item.href) && "bg-sidebar-accent text-primary font-semibold" )}
                        >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}


export default function ArtisanSidebar() {
  return (
    <>
      <aside className="hidden w-64 flex-col border-r md:flex h-screen sticky top-0 bg-sidebar">
        <NavContent />
      </aside>
      <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
             <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
            </SheetHeader>
            <NavContent />
          </SheetContent>
        </Sheet>
        <HeaderActions />
      </header>
    </>
  );
}
