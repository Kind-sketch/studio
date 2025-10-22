
'use client';

import Link from 'next/link';
import { Search, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function BuyerHeader() {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] z-30 flex h-16 items-center gap-2 border-b bg-card px-4 md:relative md:max-w-none md:left-0 md:translate-x-0">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for products..."
          className="pl-8"
        />
      </div>
      <div className="flex flex-col items-center justify-center">
          <Link href="/buyer/customize" passHref>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="sr-only">Customize</span>
            </Button>
          </Link>
           <Link href="/buyer/profile" passHref>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Profile</span>
            </Button>
          </Link>
      </div>
    </header>
  );
}
