
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

// Define the valid page slugs the AI can return.
const pageSlugs = [
  'my-products', 'saved-collection', 'dashboard', 'orders', 
  'sponsors', 'sponsors/requests', 'sponsors/my-sponsors', 'profile', 'add-product'
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
  input: { schema: InterpretNavCommandInputSchema },
  output: { schema: InterpretNavCommandOutputSchema },
  prompt: `You are an expert AI assistant for an artisan marketplace app. Your task is to interpret a user's spoken command and determine which page they want to navigate to.

The user's command is in the language '{{language}}'.
The command is: "{{command}}"

Here are the available pages and keywords associated with them:
- 'my-products': My creations, items I have made, my shop, view my products.
- 'saved-collection': Inspirations, saved ideas, my collection, bookmarks.
- 'add-product': Add a new product, upload a creation, new item.
- 'dashboard': Revenue, earnings, money, income, sales overview.
- 'orders': Manage orders, new orders, track shipments.
- 'sponsors': Manage sponsors, find sponsors.
- 'sponsors/requests': Sponsor requests, new sponsors, people who want to donate, funding requests.
- 'sponsors/my-sponsors': My current sponsors, existing partnerships.
- 'profile': My account, my details, edit profile.

Analyze the user's command, considering synonyms and context. For example, if the user says "I want to see people who want to give me money for my art", you should map this to 'sponsors/requests'. If they say "புதிய ஸ்பான்சர்களைப் பார்க்க வேண்டும்" (I want to see new sponsors) in Tamil, it should also map to 'sponsors/requests'. If the command is unclear, return 'unknown'.

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
  async (input) => {
    try {
      const { output } = await prompt(input);
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
