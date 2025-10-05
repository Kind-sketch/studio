import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Palette, ShoppingBag, HeartHandshake } from 'lucide-react';
import { Logo } from '@/components/icons';

const roles = [
  {
    name: 'Artisan',
    description: 'Showcase your creations, connect with buyers.',
    href: '/artisan/register',
    icon: Palette,
  },
  {
    name: 'Buyer',
    description: 'Discover and purchase unique handmade goods.',
    href: '/auth',
    icon: ShoppingBag,
  },
  {
    name: 'Sponsor',
    description: 'Support artisans and the creative community.',
    href: '/auth',
    icon: HeartHandshake,
  },
];

export default function RoleSelectionPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-secondary/50 p-4">
      <div className="w-full max-w-lg text-center">
        <div className="mb-8 flex flex-col items-center">
          <Logo className="mb-4 h-16 w-16 text-primary" />
          <h1 className="font-headline text-4xl font-bold">
            Welcome to Artistry Havens
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            How would you like to join our community?
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {roles.map((role) => (
            <Link href={role.href} key={role.name} passHref>
              <Card className="transform-gpu cursor-pointer text-left transition-transform hover:scale-105 hover:shadow-xl">
                <CardHeader className="flex flex-row items-center gap-4">
                  <role.icon className="h-10 w-10 text-primary" />
                  <div>
                    <CardTitle className="font-headline text-2xl">
                      I am a {role.name}
                    </CardTitle>
                    <CardDescription className="text-md">
                      {role.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
         <p className="mt-8 text-sm text-muted-foreground">
          For artisans, the first step will be to register.
        </p>
      </div>
    </div>
  );
}
