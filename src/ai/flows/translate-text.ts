'use server';
/**
 * @fileOverview A flow for translating text into different languages.
 *
 * - translateText - A function that handles text translation.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

const prompt = ai.definePrompt({
  name: 'translateTextPrompt',
  input: {schema: TranslateTextInputSchema},
  output: {schema: TranslateTextOutputSchema},
  prompt: `Translate the following array of texts into the language with code "{{targetLanguage}}".
When translating, ensure that all pronouns are correctly translated according to the grammar and context of the target language. Do not leave pronouns in English unless their pronunciation is identical in the target language.
Return the result as a JSON object with a single key "translatedTexts" which is an array of the translated strings, in the same order as the input.

Input Texts:
{{#each texts}}
- {{{this}}}
{{/each}}
`,
});

// Simple in-memory cache
const translationCache = new Map<string, string>();

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async input => {
    if (input.targetLanguage === 'en') {
      return { translatedTexts: input.texts };
    }

    const { texts, targetLanguage } = input;
    const translatedTexts: string[] = [];
    const textsToTranslate: string[] = [];
    const indicesToTranslate: number[] = [];

    // Check cache for existing translations
    texts.forEach((text, index) => {
      const cacheKey = `${targetLanguage}:${text}`;
      if (translationCache.has(cacheKey)) {
        translatedTexts[index] = translationCache.get(cacheKey)!;
      } else {
        textsToTranslate.push(text);
        indicesToTranslate.push(index);
      }
    });

    // If all texts are in cache, return them
    if (textsToTranslate.length === 0) {
      // Need to build the final array in the correct order
      const finalTexts: string[] = [];
      texts.forEach((text, index) => {
         const cacheKey = `${targetLanguage}:${text}`;
         finalTexts[index] = translationCache.get(cacheKey)!;
      });
      return { translatedTexts: finalTexts };
    }

    // Call AI for texts that are not in the cache
    const { output } = await prompt({ texts: textsToTranslate, targetLanguage });

    if (output) {
      // Store new translations in cache and populate the results
      output.translatedTexts.forEach((translatedText, i) => {
        const originalIndex = indicesToTranslate[i];
        const originalText = textsToTranslate[i];
        const cacheKey = `${targetLanguage}:${originalText}`;
        
        translationCache.set(cacheKey, translatedText);
        translatedTexts[originalIndex] = translatedText;
      });
    }

    // Fill any gaps with original text if translation failed for some items
    for(let i = 0; i < texts.length; i++) {
        if (translatedTexts[i] === undefined) {
             const cacheKey = `${targetLanguage}:${texts[i]}`;
             if (translationCache.has(cacheKey)) {
                translatedTexts[i] = translationCache.get(cacheKey)!;
             }
        }
    }

    return { translatedTexts };
  }
);
