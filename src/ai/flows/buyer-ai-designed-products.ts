
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

const generateProductImage = ai.defineFlow(
  {
    name: 'generateProductImageFlow',
    inputSchema: BuyerAiDesignedProductsInputSchema,
    outputSchema: BuyerAiDesignedProductsOutputSchema,
  },
  async ({ prompt: userInput, style }) => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `A single... image of a handmade artisan craft. The product should be: "${userInput}". The craft style is ${style}.`,
    });

    if (!media?.url) {
      throw new Error('Image generation failed to return a valid media URL.');
    }
    return media.url;
  }
);


export async function buyerAiDesignedProducts(input: BuyerAiDesignedProductsInput): Promise<BuyerAiDesignedProductsOutput> {
  const fallbackImage = PlaceHolderImages.find(p => p.id === 'product-7')?.imageUrl || 'https://picsum.photos/seed/fallback/512/512';
  
  try {
    const result = await generateProductImage(input);
    return result;

  } catch (error) {
    console.error('Error generating image with AI, returning fallback.', error);
    return fallbackImage;
  }
}
