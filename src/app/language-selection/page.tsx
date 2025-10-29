
'use client';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { languages } from '@/lib/data';
import { Logo } from '@/components/icons';
import { useLanguage } from '@/context/language-context';
import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LanguageSelectionPage() {
  const { setLanguage } = useLanguage();
  const router = useRouter();

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode);
    router.push('/role-selection');
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-secondary/50 p-4">
       <div className="text-center mb-8">
            <Logo className="mb-4 h-14 w-14 text-primary inline-block"/>
          <CardTitle className="font-headline text-2xl sm:text-3xl">
            Choose Your Language
          </CardTitle>
        </div>
      <Card className="w-full max-w-sm shadow-xl border-none">
        <CardContent className="p-2">
          <div className="flex flex-col gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className="flex w-full items-center justify-between rounded-lg p-4 text-left transition-colors hover:bg-accent"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-md">{lang.name}</span>
                  <span className="text-sm text-muted-foreground">{lang.nativeName}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
