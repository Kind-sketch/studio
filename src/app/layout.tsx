
'use client';

import React, { useEffect, useState } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-context';
import { TranslationProvider } from '@/context/translation-context';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase';

const metadata: Metadata = {
  title: 'Artistry Havens',
  description: 'A marketplace for artisans, buyers, and sponsors.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Open+Sans:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <FirebaseClientProvider>
          <LanguageProvider>
            <TranslationProvider>
              <div className="flex items-center justify-center min-h-screen w-full bg-zinc-200 dark:bg-zinc-800">
                  <div className="relative w-full max-w-[390px] h-screen max-h-[844px] bg-background shadow-2xl overflow-y-auto no-scrollbar">
                      {children}
                      {isClient && <Toaster />}
                  </div>
              </div>
            </TranslationProvider>
          </LanguageProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
