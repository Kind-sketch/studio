
'use server';
/**
 * @fileOverview An AI flow that generates product details from an image.
 *
 * - generateProductDetails - A function that handles the product detail generation.
 * - GenerateProductDetailsInput - The input type for the generateProductDetails function.
 * - GenerateProductDetailsOutput - The return type for the generateProductDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { productCategories } from '@/lib/data';
import { translateText } from '@/services/translation-service';

const GenerateProductDetailsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  targetLanguage: z.string().optional().describe('The optional language to translate the output to.'),
});
export type GenerateProductDetailsInput = z.infer<typeof GenerateProductDetailsInputSchema>;

const GenerateProductDetailsOutputSchema = z.object({
  productName: z.string().describe('A creative and marketable name for the product.'),
  productCategory: z.enum(productCategories as [string, ...string[]]).describe('The category that best fits the product.'),
  productStory: z.string().describe('A short, engaging story about how the product was made, its inspiration, or its unique qualities.'),
  productDescription: z.string().describe('A compelling, marketable description of the product suitable for an e-commerce listing.'),
});
export type GenerateProductDetailsOutput = z.infer<typeof GenerateProductDetailsOutputSchema>;

export async function generateProductDetails(input: GenerateProductDetailsInput): Promise<GenerateProductDetailsOutput> {
  return generateProductDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductDetailsPrompt',
  input: {schema: z.object({ photoDataUri: GenerateProductDetailsInputSchema.shape.photoDataUri })},
  output: {schema: GenerateProductDetailsOutputSchema},
  prompt: `You are an expert product marketer for artisanal crafts. Analyze the provided image of a handmade product and generate the following details in English: a product name, a product category, a product story, and a product description.

The product category must be one of the following: ${productCategories.join(', ')}.

The product story should be a brief, compelling narrative (2-3 sentences) that describes the craftsmanship, inspiration, or unique qualities of the item.

The product description should be a detailed and enticing paragraph suitable for an online store, highlighting key features, materials, and potential uses.

Image: {{media url=photoDataUri}}`,
});

const generateProductDetailsFlow = ai.defineFlow(
  {
    name: 'generateProductDetailsFlow',
    inputSchema: GenerateProductDetailsInputSchema,
    outputSchema: GenerateProductDetailsOutputSchema,
  },
  async ({ photoDataUri, targetLanguage }) => {
    const {output} = await prompt({ photoDataUri });
    if (!output) {
      throw new Error("Failed to generate product details from the AI model.");
    }
    
    // If a target language is provided and it's not English, translate the text fields.
    if (targetLanguage && targetLanguage !== 'en') {
      const textsToTranslate = [
        output.productName,
        output.productStory,
        output.productDescription,
      ];
      
      const { translatedTexts } = await translateText({
        texts: textsToTranslate,
        targetLanguage,
      });

      if (translatedTexts.length === 3) {
        // Return the translated output.
        return {
          productName: translatedTexts[0],
          productCategory: output.productCategory, // Category is not translated
          productStory: translatedTexts[1],
          productDescription: translatedTexts[2],
        };
      }
    }

    // Return the original English output if no translation is needed or if translation fails.
    return output;
  }
);
