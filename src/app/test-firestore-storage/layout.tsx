'use client';

import { FirebaseClientProvider } from '@/context/firebase-context';
import { LanguageProvider } from '@/context/language-context';
import { TranslationProvider } from '@/context/translation-context';
import { Toaster } from '@/components/ui/toaster';

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <LanguageProvider>
        <TranslationProvider>
          {children}
          <Toaster />
        </TranslationProvider>
      </LanguageProvider>
    </FirebaseClientProvider>
  );
}