
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import 'regenerator-runtime/runtime';
import {
  Home,
  BarChart3,
  User,
  Package,
  HeartHandshake,
  Mic,
  MessageCircleQuestion,
  ShoppingBag,
  Bookmark,
  LogOut,
  Bell,
  DollarSign,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/services/translation-service';
import { useEffect, useState, useRef } from 'react';
import SupportDialog from './support-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from './ui/badge';
import { useTranslation } from '@/context/translation-context';

const baseNavItems = [
  { href: '/artisan/home', icon: Home, label: 'Home' },
  { href: '/artisan/dashboard', icon: DollarSign, label: 'Revenue' },
  { href: '/artisan/my-products', icon: ShoppingBag, label: 'My Products' },
  { href: '/artisan/stats', icon: BarChart3, label: 'Statistics' },
  { href: '/artisan/profile', icon: User, label: 'My Profile' },
];


interface Notification {
    id: string;
    title: string;
    description: string;
    read: boolean;
    createdAt: Date;
}

export function HeaderActions() {
    const { toast, dismiss } = useToast();
    const router = useRouter();
    const { language } = useLanguage();
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);
    const toastIdRef = useRef<string | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const hasUnread = notifications.some(n => !n.read);

    useEffect(() => {
        // Mock notifications
        const mockNotifications: Notification[] = [
            { id: '1', title: 'New Order Request', description: 'You have a new request for "Ceramic Dawn Vase".', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 5) },
            { id: '2', title: 'New Sponsor', description: 'ArtLover22 wants to sponsor you!', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
            { id: '3', title: 'Milestone Reached', description: 'Congrats! You\'ve reached 100 sales.', read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
        ];
        setNotifications(mockNotifications);
    }, []);

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }


    const navKeywords: { [key: string]: string[] } = {
        '/artisan/home': ['home', 'main', 'start', 'trends', 'community', 'popular', 'feed', 'feedback', 'review'],
        '/artisan/dashboard': ['revenue', 'money', 'earnings', 'dashboard', 'income', 'finances', 'sales'],
        '/artisan/my-products': ['my products', 'products', 'creations', 'gallery', 'uploaded', 'items', 'inventory'],
        '/artisan/stats': ['statistics', 'stats', 'performance', 'analytics', 'charts', 'data'],
        '/artisan/profile': ['profile', 'account', 'me', 'my details', 'user'],
        '/artisan/orders': ['orders', 'requests', 'shipments', 'manage orders'],
        '/artisan/sponsors': ['sponsors', 'sponsorships', 'partners', 'supporters'],
        '/artisan/saved-collection': ['saved', 'collection', 'bookmarks', 'favorites', 'inspirations'],
    };

    const handleVoiceCommand = (command: string): boolean => {
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
                return true;
            }
        }
        return false;
    };

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
                        const lowerCaseSpokenText = spokenText.toLowerCase();
                        let commandFound = false;
                        
                        commandFound = handleVoiceCommand(lowerCaseSpokenText);

                        if (!commandFound && language !== 'en') {
                            try {
                                const { translatedTexts } = await translateText({ texts: [spokenText], targetLanguage: 'en' });
                                const translatedCommand = translatedTexts[0];
                                if (translatedCommand) {
                                    commandFound = handleVoiceCommand(translatedCommand.toLowerCase());
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

                        if (!commandFound && toastIdRef.current) {
                            toast({
                                id: toastIdRef.current,
                                variant: 'destructive',
                                title: 'Command Not Recognized',
                                description: `Could not find a page for "${spokenText}".`,
                            });
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

    return (
        <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Notifications"
                        className="relative"
                    >
                        <Bell className="h-5 w-5" />
                        {hasUnread && (
                            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.length > 0 ? (
                        notifications.map((n) => (
                            <DropdownMenuItem key={n.id} onClick={() => markAsRead(n.id)} className={cn("flex items-start gap-2", !n.read && "bg-accent/50")}>
                                {!n.read && <span className="mt-1 h-2 w-2 rounded-full bg-primary" />}
                                <div className={cn(!n.read && 'pl-1')}>
                                    <p className="font-semibold">{n.title}</p>
                                    <p className="text-xs text-muted-foreground">{n.description}</p>
                                </div>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <p className="p-4 text-center text-sm text-muted-foreground">No new notifications</p>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <SupportDialog>
              <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Support"
              >
                  <MessageCircleQuestion className="h-5 w-5" />
              </Button>
            </SupportDialog>
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

interface ArtisanSidebarProps {
  closeSheet?: () => void;
}

export default function ArtisanSidebar({ closeSheet }: ArtisanSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { toast } = useToast();
    const { translations } = useTranslation();
    const t = translations.artisan_sidebar;
    
    const handleLinkClick = (href: string) => {
        router.push(href);
        if (closeSheet) {
          closeSheet();
        }
    };

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        handleLinkClick('/');
        toast({
            title: t.logoutToastTitle,
            description: t.logoutToastDesc
        });
    };
    
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
        <div className="flex h-full max-h-screen flex-col bg-sidebar text-sidebar-foreground">
            <div className="flex h-14 shrink-0 items-center border-b border-sidebar-border px-4 lg:h-[60px]">
                <button onClick={() => handleLinkClick('/artisan/home')} className="flex items-center gap-2 font-semibold">
                    <Logo className="h-6 w-6 text-primary lg:h-8 lg:w-8" />
                    <span className="font-headline text-lg lg:text-xl">Artistry Havens</span>
                </button>
                 {closeSheet && (
                    <button onClick={closeSheet} className="ml-auto rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto">
                <nav className="px-2 py-4 lg:px-4">
                    <ul className="space-y-1">
                        {t.navItems.map((item, index) => (
                        <li key={item.label}>
                            <button
                                onClick={() => handleLinkClick(baseNavItems[index].href)}
                                className={cn(
                                    'w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all hover:text-primary hover:bg-sidebar-accent',
                                    isLinkActive(baseNavItems[index].href) && 'bg-sidebar-accent text-primary font-semibold'
                                )}
                            >
                                <baseNavItems[index].icon className="h-4 w-4" />
                                {item.label}
                            </button>
                        </li>
                        ))}
                    </ul>
                    <Separator className="my-4" />
                    <ul className="space-y-1">
                      <li>
                        <button
                            onClick={() => handleLinkClick('/artisan/orders')}
                            className={cn(
                                'w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all hover:text-primary hover:bg-sidebar-accent',
                                isLinkActive('/artisan/orders') && 'bg-sidebar-accent text-primary font-semibold'
                            )}
                        >
                            <Package className="h-4 w-4" />
                            {t.orders}
                        </button>
                      </li>
                      <li>
                        <button
                            onClick={() => handleLinkClick('/artisan/sponsors')}
                            className={cn(
                                'w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all hover:text-primary hover:bg-sidebar-accent',
                                isLinkActive('/artisan/sponsors') && 'bg-sidebar-accent text-primary font-semibold'
                            )}
                        >
                            <HeartHandshake className="h-4 w-4" />
                            {t.sponsors}
                        </button>
                      </li>
                      <li>
                        <button
                            onClick={() => handleLinkClick('/artisan/saved-collection')}
                            className={cn(
                                'w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all hover:text-primary hover:bg-sidebar-accent',
                                isLinkActive('/artisan/saved-collection') && 'bg-sidebar-accent text-primary font-semibold'
                            )}
                        >
                            <Bookmark className="h-5 w-5" />
                            {t.savedCollection}
                        </button>
                      </li>
                    </ul>
                </nav>
            </div>
            <div className="mt-auto border-t border-sidebar-border p-4">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/80 transition-all hover:text-primary hover:bg-sidebar-accent"
                >
                    <LogOut className="h-4 w-4" />
                    {t.logout}
                </button>
            </div>
        </div>
    );
}

    