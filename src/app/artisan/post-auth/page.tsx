
'use client';

import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Upload, User, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/services/translation-service';
import { useState, useEffect } from 'react';
import { HeaderActions } from '@/components/artisan-sidebar';

const baseOptions = [
  {
    name: 'Upload a Product',
    description: 'Add a new creation to your shop.',
    href: '/artisan/add-product',
    icon: Upload,
  },
  {
    name: 'Visit My Page',
    description: 'View your trends, and bestsellers.',
    href: '/artisan/home',
    icon: LayoutDashboard,
  },
];

export default function ArtisanPostAuthPage() {
  const { language } = useLanguage();
  const [options, setOptions] = useState(baseOptions);
  const [translatedTitle, setTranslatedTitle] = useState('What would you like to do next?');

  useEffect(() => {
    const translateContent = async () => {
      if (language !== 'en') {
        const textsToTranslate = [
          'What would you like to do next?',
          ...baseOptions.map(o => o.name),
          ...baseOptions.map(o => o.description),
        ];

        const { translatedTexts } = await translateText({
          texts: textsToTranslate,
          targetLanguage: language,
        });

        setTranslatedTitle(translatedTexts[0]);
        const translatedOptions = baseOptions.map((option, index) => ({
          ...option,
          name: translatedTexts[1 + index],
          description: translatedTexts[1 + baseOptions.length + index],
        }));
        setOptions(translatedOptions);
      } else {
        setTranslatedTitle('What would you like to do next?');
        setOptions(baseOptions);
      }
    };
    translateContent();
  }, [language]);

  return (
    <>
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:hidden sticky top-0 z-40">
        
    </header>
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-xs text-center">
        <h1 className="font-headline text-2xl font-bold mb-8">{translatedTitle}</h1>
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
