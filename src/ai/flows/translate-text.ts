
'use server';
/**
 * @fileOverview A flow for translating text into different languages using the Gemini API.
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
  input: { schema: z.object({
    texts: z.array(z.string()),
    targetLanguage: z.string(),
  })},
  output: { schema: TranslateTextOutputSchema },
  prompt: `Translate the following array of texts into the language with code "{{targetLanguage}}".
  
  Return a JSON object containing a single key "translatedTexts", which is an array of the translated strings. The translated array must have the same number of elements as the input array.

  Input Texts:
  {{#each texts}}
  - "{{this}}"
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
  async (input: TranslateTextInput) => {
    if (input.targetLanguage === 'en') {
      return { translatedTexts: input.texts };
    }

    const { texts, targetLanguage } = input;
    const finalTranslations = new Array<string>(texts.length);
    const textsToTranslate: { text: string, index: number }[] = [];
    
    // Check cache for existing translations and prepare for API call
    texts.forEach((text, index) => {
      const cacheKey = `${targetLanguage}:${text}`;
      if (translationCache.has(cacheKey)) {
        finalTranslations[index] = translationCache.get(cacheKey)!;
      } else {
        textsToTranslate.push({ text, index });
      }
    });

    // If there are any texts that need translation, call the AI
    if (textsToTranslate.length > 0) {
      try {
        const sourceTexts = textsToTranslate.map(t => t.text);
        const { output } = await prompt({ texts: sourceTexts, targetLanguage });
        
        if (output && output.translatedTexts && output.translatedTexts.length === sourceTexts.length) {
            // Store new translations in cache and populate the results array
            output.translatedTexts.forEach((translatedText, i) => {
                const originalIndex = textsToTranslate[i].index;
                const originalText = textsToTranslate[i].text;
                const cacheKey = `${targetLanguage}:${originalText}`;
                
                translationCache.set(cacheKey, translatedText);
                finalTranslations[originalIndex] = translatedText;
            });
        } else {
             throw new Error("Translation output format is invalid.");
        }
      } catch (error) {
        console.error("Gemini API failed for translation, using original texts as fallback:", error);
        // On error, fill missing translations with original text
        textsToTranslate.forEach(({ text, index }) => {
           finalTranslations[index] = text;
        });
      }
    }
    
    // As a final fallback, if any translation is missing, fill it with the original text.
    for(let i = 0; i < finalTranslations.length; i++) {
        if (finalTranslations[i] === undefined || finalTranslations[i] === null) {
             finalTranslations[i] = texts[i];
        }
    }

    return { translatedTexts: finalTranslations };
  }
);
