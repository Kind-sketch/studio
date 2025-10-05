
'use server';
/**
 * @fileOverview A flow for translating text into different languages using the Google Cloud Translation API.
 *
 * - translateText - A function that handles text translation.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { translateTexts } from '@/services/translation-service';

const TranslateTextInputSchema = z.object({
  texts: z.array(z.string()).describe('An array of texts to be translated.'),
  targetLanguage: z.string().describe('The target language code (e.g., "hi", "es").'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translatedTexts: z.array(z.string()).describe('The translated texts.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

// In-memory cache for translations to reduce API calls
const translationCache = new Map<string, string[]>();

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async (input: TranslateTextInput) => {
    const { texts, targetLanguage } = input;
    
    // If target is English, no translation is needed.
    if (targetLanguage === 'en') {
      return { translatedTexts: texts };
    }
    
    // Use a composite key for caching based on language and all texts
    const cacheKey = `${targetLanguage}:${texts.join('||')}`;
    if (translationCache.has(cacheKey)) {
        const cachedTranslations = translationCache.get(cacheKey);
        if (cachedTranslations) {
            return { translatedTexts: cachedTranslations };
        }
    }

    try {
        const translatedTexts = await translateTexts(texts, targetLanguage);
        
        // Cache the successful translation
        translationCache.set(cacheKey, translatedTexts);

        return { translatedTexts };

    } catch (error) {
        console.error("Cloud Translation API failed, returning original texts as fallback:", error);
        // On failure, return the original texts
        return { translatedTexts: texts };
    }
  }
);
