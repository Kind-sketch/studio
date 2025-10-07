
'use server';
/**
 * @fileOverview An AI flow that generates custom product images for buyers.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const BuyerAiDesignedProductsInputSchema = z.object({
  prompt: z.string().describe('The buyer\'s description of the product.'),
  style: z.string().describe('The style or category of the craft.'),
});
export type BuyerAiDesignedProductsInput = z.infer<typeof BuyerAiDesignedProductsInputSchema>;

export const BuyerAiDesignedProductsOutputSchema = z.object({
  imageUrl: z.string().describe('The URL of the generated image.'),
});
export type BuyerAiDesignedProductsOutput = z.infer<typeof BuyerAiDesignedProductsOutputSchema>;

export async function buyerAiDesignedProducts(input: BuyerAiDesignedProductsInput): Promise<BuyerAiDesignedProductsOutput> {
  const fallbackImage = PlaceHolderImages.find(p => p.id === 'product-7')?.imageUrl || 'https://picsum.photos/seed/fallback/512/512';
  
  try {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate a photorealistic image of a handmade artisan craft. The product should be: ${input.prompt}. The craft style is ${input.style}. The image should be on a clean, neutral background.`,
    });

    if (!media || !media.url) {
        throw new Error('Image generation failed to return media.');
    }
    
    return {
      imageUrl: media.url,
    };

  } catch (error) {
    console.error('Error generating image with Imagen, returning fallback.', error);
    return {
      imageUrl: fallbackImage,
    };
  }
}
