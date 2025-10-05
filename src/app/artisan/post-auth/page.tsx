'use client';

import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Upload, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/ai/flows/translate-text';
import { useState, useEffect } from 'react';

const baseOptions = [
  {
    name: 'Upload a Product',
    description: 'Add a new creation to your shop.',
    href: '/artisan/add-product',
    icon: Upload,
  },
  {
    name: 'Go to Dashboard',
    description: 'View your sales, trends, and statistics.',
    href: '/artisan/dashboard',
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
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-lg text-center">
        <h1 className="font-headline text-4xl font-bold mb-8">{translatedTitle}</h1>
        <div className="grid grid-cols-1 gap-6">
          {options.map((option) => (
            <Link href={option.href} key={option.name} passHref>
              <Card className="transform-gpu cursor-pointer text-left transition-transform hover:scale-105 hover:shadow-xl">
                <CardHeader className="flex flex-row items-center gap-4">
                  <option.icon className="h-10 w-10 text-primary" />
                  <div>
                    <CardTitle className="font-headline text-2xl">
                      {option.name}
                    </CardTitle>
                    <CardDescription className="text-md">
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
  );
}
