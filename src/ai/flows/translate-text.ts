
'use server';
/**
 * @fileOverview A flow for translating text into different languages using a generative model.
 *
 * This file defines the actual Genkit flow for translation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

export const TranslateTextInputSchema = z.object({
  texts: z.array(z.string()).describe('An array of texts to be translated.'),
  targetLanguage: z.string().describe('The target language code (e.g., "hi", "es").'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;


export const TranslateTextOutputSchema = z.object({
  translatedTexts: z.array(z.string()).describe('The translated texts.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;


const translateTextPrompt = ai.definePrompt({
    name: 'translateTextPrompt',
    input: { schema: TranslateTextInputSchema },
    output: { schema: TranslateTextOutputSchema },
    prompt: `Translate the following array of JSON strings from English to the language with code '{{targetLanguage}}'. 
    
    Return a JSON object with a single key "translatedTexts" that contains an array of the translated strings. The order of the translated strings in the array must exactly match the order of the original strings.
    
    Original Texts:
    {{jsonStringify texts}}
    
    Your response MUST be a valid JSON object.
    `,
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async (input) => {
    const { output } = await translateTextPrompt(input);
    if (!output) {
      throw new Error('Translation failed to produce an output.');
    }
    return output;
  }
);


export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
    return translateTextFlow(input);
}
