
'use server';
/**
 * @fileOverview An AI flow that generates custom product images for buyers.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { 
    type BuyerAiDesignedProductsInput, 
    type BuyerAiDesignedProductsOutput,
    BuyerAiDesignedProductsInputSchema
} from './buyer-ai-designed-products-types';

const generateProductImage = ai.defineFlow(
  {
    name: 'generateProductImageFlow',
    inputSchema: BuyerAiDesignedProductsInputSchema,
    outputSchema: z.string(),
  },
  async ({ prompt, style }) => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate a photorealistic image of a handmade artisan craft. The product should be: ${prompt}. The craft style is ${style}. The image should be on a clean, neutral background, looking like a professional product photo.`,
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed to return media.');
    }
    return media.url;
  }
);


export async function buyerAiDesignedProducts(input: BuyerAiDesignedProductsInput): Promise<BuyerAiDesignedProductsOutput> {
  const fallbackImage = PlaceHolderImages.find(p => p.id === 'product-7')?.imageUrl || 'https://picsum.photos/seed/fallback/512/512';
  
  try {
    const imageUrl = await generateProductImage(input);
    return { imageUrl };

  } catch (error) {
    console.error('Error generating image with Imagen, returning fallback.', error);
    return {
      imageUrl: fallbackImage,
    };
  }
}
