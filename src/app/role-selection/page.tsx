'use client';

import Link from 'next/link';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Palette, ShoppingBag, HeartHandshake } from 'lucide-react';
import { Logo } from '@/components/icons';
import { useTranslation } from '@/context/translation-context';

const baseRoles = [
  {
    name: 'Artisan',
    description: 'Showcase your creations, connect with buyers.',
    href: '/artisan/register',
    icon: Palette,
    role: 'artisan'
  },
  {
    name: 'Buyer',
    description: 'Discover and purchase unique handmade goods.',
    href: '/auth?role=buyer',
    icon: ShoppingBag,
    role: 'buyer'
  },
  {
    name: 'Sponsor',
    description: 'Support artisans and the creative community.',
    href: '/auth?role=sponsor',
    icon: HeartHandshake,
    role: 'sponsor'
  },
  {
    name: 'Test Firestore & Storage',
    description: 'Test data persistence and image uploads.',
    href: '/test-firestore-storage',
    icon: HeartHandshake,
    role: 'test'
  },
];


export default function RoleSelectionPage() {
  const { translations } = useTranslation();
  const t = translations.role_selection_page;

  // Filter out the test role in production
  const roles = baseRoles
    .filter(role => process.env.NODE_ENV === 'development' || role.role !== 'test')
    .map((role, index) => ({
      ...role,
      name: role.role === 'test' ? role.name : t.roles[index].name,
      description: role.role === 'test' ? role.description : t.roles[index].description,
    }));

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-xs text-center">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4">
            <Logo className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-headline text-xl font-bold">
            {t.welcome}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t.joinCommunity}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {roles.map((role, index) => (
            <Link href={role.href} key={role.name} passHref>
              <Card className="transform-gpu cursor-pointer text-left transition-transform hover:scale-105 hover:shadow-xl">
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                  <role.icon className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="font-headline text-lg">
                      {role.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {role.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          {t.footer}
        </p>
      </div>
    </div>
  );
}