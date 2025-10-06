'use server';
/**
 * @fileOverview A flow for translating text into different languages using a generative model.
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

// In-memory cache for translations to reduce API calls
const translationCache = new Map<string, string[]>();

// Queueing and rate-limiting state
const translationQueue: {
  input: TranslateTextInput;
  resolve: (value: TranslateTextOutput) => void;
  reject: (reason?: any) => void;
}[] = [];
let isProcessing = false;
let isCoolingDown = false;
const COOL_DOWN_PERIOD = 60000; // 60 seconds

const prompt = ai.definePrompt({
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

async function processQueue() {
  if (isProcessing || translationQueue.length === 0 || isCoolingDown) {
    return;
  }
  isProcessing = true;

  const { input, resolve, reject } = translationQueue.shift()!;
  
  try {
    const result = await performTranslation(input);
    resolve(result);
  } catch (error) {
    console.error("Translation failed, re-queueing after cool-down:", error);
    // Put it back at the front of the queue to be retried.
    translationQueue.unshift({ input, resolve, reject });
    
    // Check if it's a rate limit error to trigger cool-down
    if (error instanceof Error && (error.message.includes('429') || error.message.includes('rate limit'))) {
        console.log(`Rate limit detected. Cooling down for ${COOL_DOWN_PERIOD / 1000} seconds.`);
        isCoolingDown = true;
        setTimeout(() => {
            isCoolingDown = false;
            processQueue(); // Resume processing after cool-down
        }, COOL_DOWN_PERIOD);
    }
  } finally {
    isProcessing = false;
    // Process next item if not cooling down
    if (!isCoolingDown) {
      setTimeout(processQueue, 1000); // Process next item after a short delay
    }
  }
}

async function performTranslation(input: TranslateTextInput): Promise<TranslateTextOutput> {
    const { texts, targetLanguage } = input;
    
    if (targetLanguage === 'en') {
      return { translatedTexts: texts };
    }
    
    const cacheKey = `${targetLanguage}:${texts.join('||')}`;
    if (translationCache.has(cacheKey)) {
      const cachedTranslations = translationCache.get(cacheKey);
      if (cachedTranslations) {
        return { translatedTexts: cachedTranslations };
      }
    }

    try {
        const { output } = await prompt(input);
        
        if (output?.translatedTexts && output.translatedTexts.length === texts.length) {
            translationCache.set(cacheKey, output.translatedTexts);
            return { translatedTexts: output.translatedTexts };
        } else {
            console.warn("Translation returned incorrect number of items, returning original texts.");
            return { translatedTexts: texts };
        }
    } catch (error: any) {
        console.error("Generative AI translation failed:", error);
        // Re-throw to be caught by the queue processor
        throw error;
    }
}

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
    return new Promise((resolve, reject) => {
        translationQueue.push({ input, resolve, reject });
        processQueue();
    });
}