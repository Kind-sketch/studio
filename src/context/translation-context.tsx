
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useLanguage } from './language-context';
import { translations as allTranslations } from '@/lib/translations';

type Translations = typeof allTranslations.en;
type TranslationContextType = {
  translations: Translations;
  isTranslating: boolean;
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<Translations>(allTranslations.en);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    setIsTranslating(true);
    // Treat allTranslations as a typed map to Translations to satisfy TS
    const translationsMap = allTranslations as unknown as Record<string, Translations>;
    const next = translationsMap[language] ?? translationsMap['en'];
    setTranslations(next);
    setIsTranslating(false);
  }, [language]);

  return (
    <TranslationContext.Provider value={{ translations, isTranslating }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
