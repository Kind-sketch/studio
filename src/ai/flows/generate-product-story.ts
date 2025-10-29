'use server';

/**
 * @fileOverview A product story generation AI agent.
 *
 * - generateProductStory - A function that handles the product story generation process.
 * - GenerateProductStoryInput - The input type for the generateProductStory function.
 * - GenerateProductStoryOutput - The return type for the generateProductStoryOutput function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const GenerateProductStoryInputSchema = z.object({
  voiceInput: z
    .string()
    .describe('The artisan\'s voice input describing the craft.'),
});
export type GenerateProductStoryInput = z.infer<typeof GenerateProductStoryInputSchema>;

const GenerateProductStoryOutputSchema = z.object({
  productStory: z.string().describe('The generated product story.'),
});
export type GenerateProductStoryOutput = z.infer<typeof GenerateProductStoryOutputSchema>;

export async function generateProductStory(input: GenerateProductStoryInput): Promise<GenerateProductStoryOutput> {
  return generateProductStoryFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateProductStoryPrompt',
    input: { schema: GenerateProductStoryInputSchema },
    output: { schema: GenerateProductStoryOutputSchema },
    prompt: `You are a skilled storyteller helping artisans craft compelling product stories.

    Based on the artisan's voice input, create a captivating and engaging product story that highlights the craft's unique qualities, origin, and the artisan's passion.

    Voice Input: {{{voiceInput}}}
    `,
});


const generateProductStoryFlow = ai.defineFlow(
  {
    name: 'generateProductStoryFlow',
    inputSchema: GenerateProductStoryInputSchema,
    outputSchema: GenerateProductStoryOutputSchema,
  },
  async input => {
    
    // Explicitly use Vertex AI for this flow.
    const llm = googleAI.model('gemini-1.5-flash-vertex');

    const { output } = await ai.generate({
      model: llm,
      prompt: (await prompt(input)).prompt,
      output: {
        schema: GenerateProductStoryOutputSchema,
      },
    });
    
    return output!;
  }
);
