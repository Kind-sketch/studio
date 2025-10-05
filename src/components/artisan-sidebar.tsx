'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  Lightbulb,
  User,
  Settings,
  PanelLeft,
  Package,
  HeartHandshake,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


const navItems = [
  { href: '/artisan/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/artisan/trends', label: 'Trends', icon: TrendingUp },
  { href: '/artisan/stats', label: 'Statistics', icon: BarChart3 },
  { href: '/artisan/promote', label: 'AI Promote', icon: Lightbulb },
  { href: '/artisan/profile', label: 'Profile', icon: User },
];

const secondaryNav = [
    {
        title: 'Orders',
        icon: Package,
        items: [
            {href: '/artisan/orders/requests', label: 'Order Requests'},
            {href: '/artisan/orders/my-orders', label: 'My Orders'},
        ]
    },
    {
        title: 'Sponsors',
        icon: HeartHandshake,
        items: [
            {href: '/artisan/sponsors/requests', label: 'Sponsor Requests'},
            {href: '/artisan/sponsors/my-sponsors', label: 'My Sponsors'},
        ]
    }
]

function NavContent() {
    const pathname = usePathname();
    
    const isLinkActive = (href: string) => pathname === href;

    return (
        <div className="flex h-full flex-col">
        <div className="flex h-16 shrink-0 items-center border-b px-4">
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
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent',
                    isLinkActive(item.href) && 'bg-accent text-primary font-semibold'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Separator className="my-4" />
           <Accordion type="multiple" defaultValue={secondaryNav.map(item => item.title)} className="w-full">
            {secondaryNav.map(nav => (
              <AccordionItem key={nav.title} value={nav.title} className="border-b-0">
                <AccordionTrigger className="px-3 py-2 text-muted-foreground hover:no-underline hover:text-primary hover:bg-accent rounded-lg [&[data-state=open]]:text-primary [&[data-state=open]]:bg-accent [&[data-state=open]]:font-semibold">
                   <div className="flex items-center gap-3">
                     <nav.icon className="h-4 w-4" />
                     <span>{nav.title}</span>
                   </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1">
                  <ul className="space-y-1 pl-7">
                    {nav.items.map(item => (
                       <li key={item.label}>
                         <Link
                           href={item.href}
                           className={cn(
                             'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-primary hover:bg-accent/80',
                             isLinkActive(item.href) && 'bg-accent/50 text-primary font-medium'
                           )}
                         >
                           {item.label}
                         </Link>
                       </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </nav>
        <div className="mt-auto border-t p-2">
            <Link
                href="/artisan/settings"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent", isLinkActive("/artisan/settings") && "bg-accent text-primary font-semibold" )}
                >
                <Settings className="h-4 w-4" />
                Settings
            </Link>
        </div>
      </div>
    );
}


export default function ArtisanSidebar() {
  return (
    <>
      <aside className="hidden w-64 flex-col border-r bg-card md:flex h-screen sticky top-0">
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
            <NavContent />
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}
