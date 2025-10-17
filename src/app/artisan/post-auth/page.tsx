
'use client';

import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Upload, LayoutDashboard } from 'lucide-react';
import { useTranslation } from '@/context/translation-context';
import { HeaderActions } from '@/components/artisan-sidebar';

const baseOptions = [
  {
    href: '/artisan/add-product',
    icon: Upload,
  },
  {
    href: '/artisan/home',
    icon: LayoutDashboard,
  },
];

export default function ArtisanPostAuthPage() {
  const { translations } = useTranslation();
  const t = translations.post_auth_page;

  const options = baseOptions.map((option, index) => ({
    ...option,
    name: t.options[index].name,
    description: t.options[index].description,
  }));

  return (
    <>
    <header className="flex h-14 items-center justify-end gap-4 border-b bg-card px-4 md:hidden sticky top-0 z-40">
        <HeaderActions />
    </header>
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-xs text-center">
        <h1 className="font-headline text-2xl font-bold mb-8">{t.title}</h1>
        <div className="grid grid-cols-1 gap-6">
          {options.map((option) => (
            <Link href={option.href} key={option.name} passHref>
              <Card className="transform-gpu cursor-pointer text-center transition-transform hover:scale-105 hover:shadow-xl">
                <CardHeader className="flex flex-col items-center gap-2 p-4">
                  <option.icon className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="font-headline text-lg">
                      {option.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {option.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
