
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
  async ({ prompt, style }) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: `Generate a single, photorealistic image of a handmade artisan craft based on the following description. The product should be: "${prompt}". The craft style is ${style}. The image must be on a clean, neutral background, looking like a professional product photo for an e-commerce website. Do not include any text in the image.`,
      config: {
        responseModalities: ['IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed to return media.');
    }
    return { imageUrl: media.url };
  }
);


export async function buyerAiDesignedProducts(input: BuyerAiDesignedProductsInput): Promise<BuyerAiDesignedProductsOutput> {
  const fallbackImage = PlaceHolderImages.find(p => p.id === 'product-7')?.imageUrl || 'https://picsum.photos/seed/fallback/512/512';
  
  try {
    const result = await generateProductImage(input);
    return result;

  } catch (error) {
    console.error('Error generating image with Gemini, returning fallback.', error);
    return {
      imageUrl: fallbackImage,
    };
  }
}
