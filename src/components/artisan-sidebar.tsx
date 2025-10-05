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
  Settings,
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


const baseNavItems = [
  { href: '/artisan/home', label: 'Home', icon: Home, keywords: ['home', 'main', 'start'] },
  { href: '/artisan/dashboard', label: 'Revenue', icon: DollarSign, keywords: ['revenue', 'money', 'earnings', 'dashboard'] },
  { href: '/artisan/my-products', label: 'My Products', icon: ShoppingBag, keywords: ['my products', 'products', 'creations', 'gallery'] },
  { href: '/artisan/trends', label: 'Trends', icon: TrendingUp, keywords: ['trends', 'community', 'popular'] },
  { href: '/artisan/stats', label: 'Statistics', icon: BarChart3, keywords: ['statistics', 'stats', 'performance', 'analytics'] },
];

const bottomNavItems = [
    { href: '/artisan/settings', label: 'Settings', icon: Settings, keywords: ['settings', 'configuration', 'profile'] },
]

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
    }, [toast]);

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
        return pathname === href;
    };

    return (
        <div className="flex h-full flex-col bg-sidebar">
            <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
                <Logo className="h-8 w-8 text-primary" />
                <span className="font-headline text-xl">Artistry Havens</span>
            </Link>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-2">
            <ul className="space-y-1">
                {navItems.map((item) => (
                <li key={item.label}>
                    <Link
                    href={item.href}
                    className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-sidebar-accent',
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
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-sidebar-accent',
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
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-sidebar-accent',
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
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-sidebar-accent',
                    isLinkActive('/artisan/saved-collection') && 'bg-sidebar-accent text-primary font-semibold'
                )}
                >
                <Bookmark className="h-4 w-4" />
                {translatedSavedCollection}
                </Link>
            </div>
            </nav>
            <div className="mt-auto border-t border-sidebar-border p-4 space-y-2">
                {translatedBottomNav.map(item => (
                     <Link
                        key={item.href}
                        href={item.href}
                        className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-sidebar-accent", isLinkActive(item.href) && "bg-sidebar-accent text-primary font-semibold" )}
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
            <NavContent />
          </SheetContent>
        </Sheet>
        <HeaderActions />
      </header>
    </>
  );
}
