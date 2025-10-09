
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import 'regenerator-runtime/runtime';
import {
  Home,
  User,
  LogOut,
  PanelLeft,
  X,
  DollarSign,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import MainHeader from './main-header';

const navItems = [
  { href: '/sponsor/dashboard', label: 'Home', icon: Home },
  { href: '/sponsor/revenue', label: 'Revenue', icon: DollarSign },
  { href: '/sponsor/profile', label: 'Account', icon: User },
];

function NavContent({ closeSheet }: { closeSheet?: () => void }) {
    const pathname = usePathname();
    const { toast } = useToast();
    const router = useRouter();

    const handleLinkClick = (href: string) => {
        router.push(href);
        if (closeSheet) {
          closeSheet();
        }
    };

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        if (closeSheet) closeSheet();
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out."
        });
        window.location.href = '/'; 
    };

    return (
        <div className="flex h-full flex-col bg-card">
            <SheetHeader className="relative flex h-16 shrink-0 items-center border-b px-4">
                <Link href="/sponsor/dashboard" onClick={() => handleLinkClick('/sponsor/dashboard')} className="flex items-center gap-2 font-semibold">
                    <Logo className="h-8 w-8 text-primary" />
                    <span className="font-headline text-xl">Artistry Havens</span>
                </Link>
            </SheetHeader>
            <nav className="flex-1 overflow-y-auto py-4 px-2">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                    <li key={item.label}>
                        <button
                            onClick={() => handleLinkClick(item.href)}
                            className={cn(
                                'w-full flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent',
                                pathname === item.href && 'bg-accent text-primary font-semibold'
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </button>
                    </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-auto border-t p-4 space-y-2">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
                 <div className="flex justify-center pt-4">
                    <Logo className="h-10 w-10 text-muted-foreground" />
                </div>
            </div>
        </div>
    );
}

export default function SponsorSidebar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
      <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-card px-4">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-[300px] p-0 z-[101]">
            <NavContent closeSheet={() => setIsSheetOpen(false)} />
          </SheetContent>
        </Sheet>
        <div className="ml-auto">
            <MainHeader />
        </div>
      </header>
  );
}
