'use server';

/**
 * @fileOverview A flow for artisans to view trending crafts and AI-powered reviews of their products.
 *
 * - getCommunityTrendInsights - A function that retrieves trending crafts and AI-powered reviews.
 * - CommunityTrendInsightsInput - The input type for the getCommunityTrendInsights function.
 * - CommunityTrendInsightsOutput - The return type for the getCommunityTrendInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CommunityTrendInsightsInputSchema = z.object({
  artisanId: z.string().describe('The ID of the artisan.'),
  productDescription: z.string().describe('The description of the product.'),
});
export type CommunityTrendInsightsInput = z.infer<typeof CommunityTrendInsightsInputSchema>;

const CommunityTrendInsightsOutputSchema = z.object({
  trendingCrafts: z.array(z.string()).describe('A list of trending crafts.'),
  aiReview: z.string().describe('An AI-powered review of the product, targeting audience insights and revenue metrics.'),
});
export type CommunityTrendInsightsOutput = z.infer<typeof CommunityTrendInsightsOutputSchema>;

export async function getCommunityTrendInsights(input: CommunityTrendInsightsInput): Promise<CommunityTrendInsightsOutput> {
  return communityTrendInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'communityTrendInsightsPrompt',
  input: {schema: CommunityTrendInsightsInputSchema},
  output: {schema: CommunityTrendInsightsOutputSchema},
  prompt: `You are an AI assistant providing insights to artisans on trending crafts and AI-powered reviews for their products.

  Given the artisan ID: {{{artisanId}}} and product description: {{{productDescription}}}.

  Provide a list of trending crafts and an AI-powered review of the product, targeting audience insights and revenue metrics.

  Format the output as a JSON object with \"trendingCrafts\" (an array of strings) and \"aiReview\" (a string).
  trendingCrafts should be a comma separated list of trending crafts
  aiReview should be a detailed report with audience insights and revenue metrics
  \n`,
});

const communityTrendInsightsFlow = ai.defineFlow(
  {
    name: 'communityTrendInsightsFlow',
    inputSchema: CommunityTrendInsightsInputSchema,
    outputSchema: CommunityTrendInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
