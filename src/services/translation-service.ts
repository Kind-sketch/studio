
'use server';
/**
 * @fileOverview A service for translating text, with caching.
 *
 * - translateText - A function that handles text translation.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import { translateText as translateTextFlow } from '@/ai/flows/translate-text';
import type { TranslateTextInput, TranslateTextOutput } from '@/ai/flows/translate-text-types';

// In-memory cache for translations to reduce API calls
const translationCache = new Map<string, string[]>();

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
    const { texts, targetLanguage } = input;

    if (targetLanguage === 'en' || !texts || texts.length === 0) {
      return { translatedTexts: texts || [] };
    }
    
    // Filter out any empty or non-string values to avoid sending invalid data
    const validTexts = texts.filter(t => typeof t === 'string' && t.trim() !== '');
    if (validTexts.length === 0) {
        return { translatedTexts: texts };
    }

    const cacheKey = `${targetLanguage}:${validTexts.join('||')}`;
    if (translationCache.has(cacheKey)) {
        const cachedTranslations = translationCache.get(cacheKey)!;
        // Re-map the translated texts to the original array structure
        const result = texts.map(originalText => {
            const index = validTexts.indexOf(originalText);
            return index !== -1 ? cachedTranslations[index] : originalText;
        });
        return { translatedTexts: result };
    }

    try {
        const result = await translateTextFlow({ texts: validTexts, targetLanguage });
        
        if (result?.translatedTexts && result.translatedTexts.length === validTexts.length) {
            translationCache.set(cacheKey, result.translatedTexts);
             // Re-map the translated texts to the original array structure
            const finalResult = texts.map(originalText => {
                const index = validTexts.indexOf(originalText);
                return index !== -1 ? result.translatedTexts[index] : originalText;
            });
            return { translatedTexts: finalResult };
        } else {
            console.warn("Translation returned incorrect number of items, returning original texts.");
            return { translatedTexts: texts };
        }
    } catch (error: any) {
        console.error("Generative AI translation failed:", error);
        // In case of an error, return the original texts to prevent UI breakage
        return { translatedTexts: texts };
    }
}
