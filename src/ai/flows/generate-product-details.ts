'use server';
/**
 * @fileOverview An AI flow that generates product details from an image.
 *
 * - generateProductDetails - A function that handles the product detail generation.
 * - GenerateProductDetailsInput - The input type for the generateProductDetails function.
 * - GenerateProductDetailsOutput - The return type for the generateProductDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const productCategories = [
    'Textiles',
    'Sculpture',
    'Woodwork',
    'Metalwork',
    'Paintings',
    'Pottery',
    'Jewelry',
];

const GenerateProductDetailsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateProductDetailsInput = z.infer<typeof GenerateProductDetailsInputSchema>;

const GenerateProductDetailsOutputSchema = z.object({
  productName: z.string().describe('A creative and marketable name for the product.'),
  productCategory: z.enum(productCategories as [string, ...string[]]).describe('The category that best fits the product.'),
  productStory: z.string().describe('A short, engaging story about how the product was made, its inspiration, or its unique qualities.'),
});
export type GenerateProductDetailsOutput = z.infer<typeof GenerateProductDetailsOutputSchema>;

export async function generateProductDetails(input: GenerateProductDetailsInput): Promise<GenerateProductDetailsOutput> {
  return generateProductDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductDetailsPrompt',
  input: {schema: GenerateProductDetailsInputSchema},
  output: {schema: GenerateProductDetailsOutputSchema},
  prompt: `You are an expert product marketer for artisanal crafts. Analyze the provided image of a handmade product and generate the following details: a product name, a product category, and a product story.

The product category must be one of the following: ${productCategories.join(', ')}.

The product story should be a brief, compelling narrative (2-3 sentences) that describes the craftsmanship, inspiration, or unique qualities of the item.

Image: {{media url=photoDataUri}}`,
});

const generateProductDetailsFlow = ai.defineFlow(
  {
    name: 'generateProductDetailsFlow',
    inputSchema: GenerateProductDetailsInputSchema,
    outputSchema: GenerateProductDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
