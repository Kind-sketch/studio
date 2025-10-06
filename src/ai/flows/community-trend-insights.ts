
'use server';
/**
 * @fileOverview A flow for artisans to view AI-powered reviews of their products.
 *
 * - getCommunityTrendInsights - A function that retrieves AI-powered reviews.
 * - CommunityTrendInsightsInput - The input type for a getCommunityTrendInsights function.
 * - CommunityTrendInsightsOutput - The return type for a getCommunityTrendInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { textToSpeech } from './text-to-speech';

const CommunityTrendInsightsInputSchema = z.object({
  artisanId: z.string().describe('The ID of the artisan.'),
  productDescription: z.string().describe('The description of the product.'),
});
export type CommunityTrendInsightsInput = z.infer<typeof CommunityTrendInsightsInputSchema>;

const CommunityTrendInsightsOutputSchema = z.object({
  aiReview: z.string().describe('A concise, AI-powered review of the product, including an opinion on the idea, income potential, target audience, and suggestions for improvement.'),
  aiReviewAudio: z.string().describe('A data URI containing the base64 encoded WAV audio of the AI review.'),
});
export type CommunityTrendInsightsOutput = z.infer<typeof CommunityTrendInsightsOutputSchema>;

export async function getCommunityTrendInsights(input: CommunityTrendInsightsInput): Promise<CommunityTrendInsightsOutput> {
  return communityTrendInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'communityTrendInsightsPrompt',
  input: {schema: CommunityTrendInsightsInputSchema},
  output: {schema: z.object({ aiReview: z.string() })},
  prompt: `You are an expert AI business consultant for artisans. Your goal is to provide insightful, honest, and actionable feedback on their product ideas. Keep your feedback concise and to the point, in a single paragraph.

  An artisan has submitted the following product idea for your review:
  Product Description: {{{productDescription}}}

  Your task is to provide a brief but comprehensive review covering the product's potential, target audience, and a key suggestion for improvement.`,
});

const communityTrendInsightsFlow = ai.defineFlow(
  {
    name: 'communityTrendInsightsFlow',
    inputSchema: CommunityTrendInsightsInputSchema,
    outputSchema: CommunityTrendInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("Failed to get review from AI.");
    }
    const audioDataUri = await textToSpeech(output.aiReview);
    return {
        aiReview: output.aiReview,
        aiReviewAudio: audioDataUri,
    };
  }
);
