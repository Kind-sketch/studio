
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
    if (language === 'en') {
      setTranslations(allTranslations.en);
      setIsTranslating(false);
    } else if (language in allTranslations) {
      setTranslations(allTranslations[language as keyof typeof allTranslations]);
      setIsTranslating(false);
    } else {
      // Fallback for languages not hardcoded
      // This part is kept for potential future dynamic additions,
      // but our primary method is now the hardcoded translations.
      setTranslations(allTranslations.en);
      setIsTranslating(false);
    }
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
