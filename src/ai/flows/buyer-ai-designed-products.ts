
'use server';
/**
 * @fileOverview An AI flow that generates custom product images for buyers.
 */

import { ai } from '@/ai/genkit';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { 
    type BuyerAiDesignedProductsInput, 
    type BuyerAiDesignedProductsOutput,
    BuyerAiDesignedProductsInputSchema,
    BuyerAiDesignedProductsOutputSchema
} from './buyer-ai-designed-products-types';

const generateProductImageFlow = ai.defineFlow(
  {
    name: 'generateProductImageFlow',
    inputSchema: BuyerAiDesignedProductsInputSchema,
    outputSchema: BuyerAiDesignedProductsOutputSchema,
  },
  async ({ prompt: userInput, style }) => {
    // This call gets the specific Imagen model and generates a single image.
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `A single, photorealistic image of a handmade artisan craft. The product should be: "${userInput}". The craft style is ${style}. The image should be well-lit, on a clean background, as if for an e-commerce product page.`,
      config: {
        // We explicitly ask for one image.
        numberOfImages: 1,
      }
    });

    // The response contains the image as a media object with a data URI.
    if (!media?.url) {
      throw new Error('Image generation failed to return a valid media URL.');
    }

    // We return the data URI string.
    return media.url;
  }
);


export async function buyerAiDesignedProducts(input: BuyerAiDesignedProductsInput): Promise<BuyerAiDesignedProductsOutput> {
  const fallbackImage = PlaceHolderImages.find(p => p.id === 'product-7')?.imageUrl || 'https://picsum.photos/seed/fallback/512/512';
  
  try {
    // We call the correctly defined flow.
    const result = await generateProductImageFlow(input);
    return result;

  } catch (error) {
    console.error('Error generating image with AI, returning fallback.', error);
    return fallbackImage;
  }
}
