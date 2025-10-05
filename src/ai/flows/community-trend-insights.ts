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

const CommunityTrendInsightsInputSchema = z.object({
  artisanId: z.string().describe('The ID of the artisan.'),
  productDescription: z.string().describe('The description of the product.'),
});
export type CommunityTrendInsightsInput = z.infer<typeof CommunityTrendInsightsInputSchema>;

const CommunityTrendInsightsOutputSchema = z.object({
  aiReview: z.string().describe('An AI-powered review of the product, including an opinion on the idea, income potential, target audience, and suggestions for improvement.'),
});
export type CommunityTrendInsightsOutput = z.infer<typeof CommunityTrendInsightsOutputSchema>;

export async function getCommunityTrendInsights(input: CommunityTrendInsightsInput): Promise<CommunityTrendInsightsOutput> {
  return communityTrendInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'communityTrendInsightsPrompt',
  input: {schema: CommunityTrendInsightsInputSchema},
  output: {schema: CommunityTrendInsightsOutputSchema},
  prompt: `You are an expert AI business consultant for artisans. Your goal is to provide insightful, honest, and actionable feedback on their product ideas.

  An artisan has submitted the following product idea for your review:
  Product Description: {{{productDescription}}}

  Your task is to provide a comprehensive review.

  Your response must be in a JSON object with one key: "aiReview".

  1.  **aiReview**: Structure your review as a string with the following four sections, clearly marked with markdown headers:

      ### Opinion on the Idea
      Provide your honest opinion on the viability and potential of this product idea. Is it a strong concept? What are its strengths and weaknesses?

      ### Target Audience
      Describe the ideal target audience for this product. Be specific about demographics, interests, and psychographics.

      ### Income Potential
      Analyze the potential for income generation. Consider market demand, pricing strategies, and competition. Provide a rough estimation if possible, but qualify it as an estimate.

      ### Suggested Improvements
      Offer specific, actionable suggestions for improvement. This could include design modifications, marketing angles, or different materials.`,
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
