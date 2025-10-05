
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-context';
import { useEffect, useState } from 'react';

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
      <body className="font-body antialiased flex items-center justify-center min-h-screen bg-zinc-200 dark:bg-zinc-800" suppressHydrationWarning>
        <LanguageProvider>
          <div className="relative w-full max-w-[420px] h-screen bg-background shadow-2xl overflow-hidden">
            <div className="h-full w-full overflow-y-auto">
              {children}
            </div>
            {isClient && <Toaster />}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
