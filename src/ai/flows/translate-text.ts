'use server';
/**
 * @fileOverview A flow for translating text into different languages.
 *
 * - translateText - A function that handles text translation.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

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
    const finalTranslations = new Array<string>(texts.length);
    const textsToTranslate: string[] = [];
    const indicesToTranslate: number[] = [];

    // Check cache for existing translations and prepare for AI call
    texts.forEach((text, index) => {
      const cacheKey = `${targetLanguage}:${text}`;
      if (translationCache.has(cacheKey)) {
        finalTranslations[index] = translationCache.get(cacheKey)!;
      } else {
        textsToTranslate.push(text);
        indicesToTranslate.push(index);
      }
    });

    // If there are any texts that need translation, call the AI
    if (textsToTranslate.length > 0) {
      try {
        const { output } = await prompt({ texts: textsToTranslate, targetLanguage });

        if (output && output.translatedTexts) {
          // Store new translations in cache and populate the results array
          output.translatedTexts.forEach((translatedText, i) => {
            const originalIndex = indicesToTranslate[i];
            const originalText = textsToTranslate[i];
            const cacheKey = `${targetLanguage}:${originalText}`;
            
            translationCache.set(cacheKey, translatedText);
            finalTranslations[originalIndex] = translatedText;
          });
        }
      } catch (error) {
        console.error("AI translation failed, using original texts as fallback:", error);
        // On error, fill missing translations with original text
        indicesToTranslate.forEach((originalIndex, i) => {
           finalTranslations[originalIndex] = textsToTranslate[i];
        });
      }
    }
    
    // As a final fallback, if any translation is missing (e.g., AI failed for an item),
    // fill it with the original text.
    for(let i = 0; i < finalTranslations.length; i++) {
        if (finalTranslations[i] === undefined) {
             finalTranslations[i] = texts[i];
        }
    }


    return { translatedTexts: finalTranslations };
  }
);
