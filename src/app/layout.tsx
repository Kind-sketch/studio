
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import MainHeader from '@/components/main-header';
import { LanguageProvider } from '@/context/language-context';
import { usePathname } from 'next/navigation';


const metadata: Metadata = {
  title: 'Artistry Havens',
  description: 'A marketplace for artisans, buyers, and sponsors.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const noHeaderPaths = ['/', '/language-selection', '/role-selection'];
  const showHeader = !noHeaderPaths.includes(pathname);

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
      <body className="font-body antialiased">
        <LanguageProvider>
          {showHeader && <MainHeader />}
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
