
'use server';
/**
 * @fileOverview A flow for translating text into different languages using a generative model.
 *
 * This file defines the actual Genkit flow for translation.
 */

import {ai} from '@/ai/genkit';
import {
  TranslateTextInputSchema,
  TranslateTextOutputSchema,
  type TranslateTextInput,
  type TranslateTextOutput
} from './translate-text-types';


const translateTextPrompt = ai.definePrompt({
    name: 'translateTextPrompt',
    input: { schema: TranslateTextInputSchema },
    output: { schema: TranslateTextOutputSchema },
    prompt: `Translate the following array of strings from their original language to the target language with code '{{targetLanguage}}'. 
    
Return a JSON object with a single key "translatedTexts" that contains an array of the translated strings. The order of the translated strings in the array must exactly match the order of the original strings.

Original Texts:
{{#each texts}}
- "{{this}}"
{{/each}}
    
Your response MUST be a valid JSON object.
    `,
});

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
    const { output } = await translateTextPrompt(input);
    if (!output) {
      throw new Error('Translation failed to produce an output.');
    }
    return output;
}
