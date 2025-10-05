'use server';

/**
 * @fileOverview A flow that helps artisans create compelling product listings using AI.
 *
 * - generateProductListing - A function that generates a product listing with AI assistance.
 * - ArtisanProductListingInput - The input type for the generateProductListing function.
 * - ArtisanProductListingOutput - The return type for the generateProductListing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ArtisanProductListingInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A detailed description of the product.'),
  productCategory: z.string().describe('The category of the product (e.g., painting, sculpture, jewelry).'),
  targetAudience: z.string().describe('The target audience for the product (e.g., young adults, collectors, home decorators).'),
  socialMediaPlatform: z.string().describe('The social media platform for which content is being generated (e.g., Instagram, Facebook, Pinterest).'),
  keywords: z.string().describe('Relevant keywords to include in the description and social media content.'),
});
export type ArtisanProductListingInput = z.infer<typeof ArtisanProductListingInputSchema>;

const ArtisanProductListingOutputSchema = z.object({
  generatedDescription: z.string().describe('An AI-generated description of the product.'),
  generatedSocialMediaContent: z.string().describe('AI-generated content tailored for the specified social media platform.'),
});
export type ArtisanProductListingOutput = z.infer<typeof ArtisanProductListingOutputSchema>;

export async function generateProductListing(input: ArtisanProductListingInput): Promise<ArtisanProductListingOutput> {
  return artisanProductListingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'artisanProductListingPrompt',
  input: {schema: ArtisanProductListingInputSchema},
  output: {schema: ArtisanProductListingOutputSchema},
  prompt: `You are an AI assistant helping artisans create compelling product listings and social media content.

  Based on the following information, generate a product description and tailored social media content for the specified platform.

  Product Name: {{{productName}}}
  Product Description: {{{productDescription}}}
  Product Category: {{{productCategory}}}
  Target Audience: {{{targetAudience}}}
  Social Media Platform: {{{socialMediaPlatform}}}
  Keywords: {{{keywords}}}

  Product Description:
  --------------------
  [Generate a detailed and engaging description of the product, highlighting its unique features and benefits. Use the provided keywords to optimize the description for search engines.]

  Social Media Content:
  ----------------------
  [Create content tailored for {{socialMediaPlatform}}, designed to capture the attention of {{targetAudience}}. Use relevant hashtags and a call to action.]`,
});

const artisanProductListingFlow = ai.defineFlow(
  {
    name: 'artisanProductListingFlow',
    inputSchema: ArtisanProductListingInputSchema,
    outputSchema: ArtisanProductListingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
