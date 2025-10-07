
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useLanguage } from './language-context';
import { translateText } from '@/services/translation-service';
import { translations as englishTranslations } from '@/lib/translations';

type Translations = typeof englishTranslations.en;
type TranslationContextType = {
  translations: Translations;
  isTranslating: boolean;
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

function deepObjectValues(obj: any): string[] {
    return Object.values(obj).flatMap((v) => (typeof v === 'object' && v !== null ? deepObjectValues(v) : (Array.isArray(v) ? v.flat() : v) )).filter(v => typeof v === 'string');
}


export function TranslationProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<Translations>(englishTranslations.en);
  const [isTranslating, setIsTranslating] = useState(false);

  const getAndSetTranslations = useCallback(async (lang: string) => {
    if (lang === 'en') {
      setTranslations(englishTranslations.en);
      setIsTranslating(false);
      return;
    }

    setIsTranslating(true);
    try {
        const englishValues = deepObjectValues(englishTranslations.en);
        const { translatedTexts } = await translateText({ texts: englishValues, targetLanguage: lang });

        let counter = 0;
        const deepSet = (obj: any): any => {
            return Object.entries(obj).reduce((acc, [key, value]) => {
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    acc[key] = deepSet(value);
                } else if (Array.isArray(value)) {
                    acc[key] = value.map(item => {
                        if (typeof item === 'object' && item !== null) {
                            return deepSet(item);
                        }
                        // It's a string in an array
                        return translatedTexts[counter++] || item;
                    });
                }
                else {
                    acc[key] = translatedTexts[counter++] || value;
                }
                return acc;
            }, {} as any);
        }

        const newTranslations = deepSet(englishTranslations.en);
        setTranslations(newTranslations);

    } catch (error) {
      console.error('Failed to translate content:', error);
      // Fallback to English
      setTranslations(englishTranslations.en);
    } finally {
      setIsTranslating(false);
    }
  }, []);

  useEffect(() => {
    getAndSetTranslations(language);
  }, [language, getAndSetTranslations]);

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
