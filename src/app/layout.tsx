
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-context';
import { TranslationProvider } from '@/context/translation-context';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

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
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
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
        <LanguageProvider>
          <TranslationProvider>
            <div className="min-h-screen w-full sm:block flex items-center justify-center">
                <div className="relative w-full bg-background max-w-[390px] min-h-screen shadow-2xl overflow-visible sm:max-w-none sm:min-h-0 sm:h-auto sm:max-h-none sm:shadow-none">
                    {children}
                    {isClient && <Toaster />}
                </div>
            </div>
          </TranslationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
