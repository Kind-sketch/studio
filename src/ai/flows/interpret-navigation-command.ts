
'use server';
/**
 * @fileOverview An AI flow to interpret voice navigation commands.
 *
 * - interpretNavCommand - A function that understands user's spoken command and maps it to a page.
 * - InterpretNavCommandInput - Input type for the function.
 * - InterpretNavCommandOutput - Output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { translateText } from '@/services/translation-service';

// Define the valid page slugs the AI can return.
const pageSlugs = [
  'home', 'my-products', 'saved-collection', 'dashboard', 'orders', 
  'sponsors', 'sponsors/requests', 'sponsors/my-sponsors', 'profile', 'add-product',
  'statistics', 'logout'
] as const;

const InterpretNavCommandInputSchema = z.object({
  command: z.string().describe('The spoken command from the user.'),
  language: z.string().describe('The language code of the command (e.g., "en", "ta").'),
});
export type InterpretNavCommandInput = z.infer<typeof InterpretNavCommandInputSchema>;


const InterpretNavCommandOutputSchema = z.object({
  page: z.enum([...pageSlugs, 'unknown']).describe('The page slug the user wants to navigate to, or "unknown" if not identifiable.'),
});
export type InterpretNavCommandOutput = z.infer<typeof InterpretNavCommandOutputSchema>;


export async function interpretNavCommand(input: InterpretNavCommandInput): Promise<InterpretNavCommandOutput> {
  return interpretNavCommandFlow(input);
}


const prompt = ai.definePrompt({
  name: 'interpretNavCommandPrompt',
  input: { schema: z.object({ command: z.string() }) },
  output: { schema: InterpretNavCommandOutputSchema },
  prompt: `You are an expert AI assistant for an artisan marketplace app. Your task is to interpret a user's spoken command in English and determine which page they want to navigate to.

The user's command is: "{{command}}"

Here are the available pages and keywords associated with them:
- 'home': Trends, inspirational products, popular items, home page, main page.
- 'my-products': My creations, items I have made, my shop, view my products.
- 'saved-collection': Inspirations, saved ideas, my collection, bookmarks.
- 'add-product': Add a new product, upload a creation, new item.
- 'dashboard': Revenue, earnings, money, income, sales overview.
- 'orders': Manage orders, new orders, track shipments.
- 'statistics': Performance, stats, analytics, charts, graphs.
- 'sponsors': Manage sponsors, find sponsors.
- 'sponsors/requests': Sponsor requests, new sponsors, people who want to donate, funding requests.
- 'sponsors/my-sponsors': My current sponsors, existing partnerships.
- 'profile': My account, my details, edit profile.
- 'logout': Logout, sign out, close the app, exit.

Analyze the user's command, considering synonyms and context. For example, if the user says "I want to see people who want to give me money for my art", you should map this to 'sponsors/requests'. If they say "show my performance", it should map to 'statistics'. If the command is unclear, return 'unknown'.

Based on the command, identify the single most relevant page slug from the list.
`,
});


const interpretNavCommandFlow = ai.defineFlow(
  {
    name: 'interpretNavCommandFlow',
    inputSchema: InterpretNavCommandInputSchema,
    outputSchema: InterpretNavCommandOutputSchema,
    model: 'googleai/gemini-1.5-flash-preview',
  },
  async ({ command, language }) => {
    try {
      let commandToProcess = command;

      // If the language is not English, translate the command first.
      if (language !== 'en' && command) {
        const translationResponse = await translateText({
          texts: [command],
          targetLanguage: 'en',
        });
        if (translationResponse.translatedTexts.length > 0 && translationResponse.translatedTexts[0]) {
          commandToProcess = translationResponse.translatedTexts[0];
        }
      }

      const { output } = await prompt({ command: commandToProcess });
      
      if (!output) {
        return { page: 'unknown' };
      }
      return output;
    } catch (error) {
      console.error('Error in interpretNavCommandFlow:', error);
      return { page: 'unknown' };
    }
  }
);
