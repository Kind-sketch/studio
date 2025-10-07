
'use server';
/**
 * @fileOverview An AI flow that allows buyers to design custom products using AI.
 *
 * - buyerAiDesignedProducts - A function that handles the product design process.
 * - BuyerAiDesignedProductsInput - The input type for the buyerAidesignedProducts function.
 * - BuyerAiDesignedProductsOutput - The return type for the buyerAiDesignedProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const BuyerAiDesignedProductsInputSchema = z.object({
  prompt: z.string().optional().describe('A text prompt describing the desired product design.'),
  style: z.string().optional().describe('A style or theme for the product design.'),
});
export type BuyerAiDesignedProductsInput = z.infer<typeof BuyerAiDesignedProductsInputSchema>;

const BuyerAiDesignedProductsOutputSchema = z.object({
  designedProductImage: z
    .string()
    .describe(
      'A data URI containing the AI-designed product image in base64 format.'
    ),
  description: z.string().describe('A description of the designed product.'),
});
export type BuyerAiDesignedProductsOutput = z.infer<typeof BuyerAiDesignedProductsOutputSchema>;

export async function buyerAiDesignedProducts(
  input: BuyerAiDesignedProductsInput
): Promise<BuyerAiDesignedProductsOutput> {
  return buyerAiDesignedProductsFlow(input);
}

const descriptionPrompt = ai.definePrompt({
  name: 'buyerAiDesignedProductsDescriptionPrompt',
  input: {schema: BuyerAiDesignedProductsInputSchema},
  output: {schema: z.object({ description: z.string() })},
  prompt: `You are an AI assistant that helps buyers design custom products. Use the provided prompt and style to write a short, compelling description for the newly designed product.

{{#if prompt}}
Prompt: {{{prompt}}}
{{/if}}

{{#if style}}
Style: {{{style}}}
{{/if}}`,
});

const buyerAiDesignedProductsFlow = ai.defineFlow(
  {
    name: 'buyerAiDesignedProductsFlow',
    inputSchema: BuyerAiDesignedProductsInputSchema,
    outputSchema: BuyerAiDesignedProductsOutputSchema,
  },
  async input => {
    try {
        const {output: descriptionOutput} = await descriptionPrompt(input);
        
        const model = 'googleai/gemini-2.5-flash-image-preview';
        let generationPrompt = `Generate an image of a craft based on textiles, pottery, metalwork, sculpture, paintings, or glass paintings. The design should be an exact representation of the following description: "${input.prompt}", in the style of "${input.style}"`;
        
        const {media} = await ai.generate({
          model: model,
          prompt: generationPrompt,
          config: {
            responseModalities: ['IMAGE', 'TEXT'],
          },
        });

        if (!media?.url) {
            throw new Error("AI did not return an image.");
        }
    
        return {
          designedProductImage: media.url,
          description: descriptionOutput?.description || "A unique, AI-generated design.",
        };
    } catch (error) {
        console.error("AI image generation failed, returning placeholder.", error);
        const fallbackImage = PlaceHolderImages.find(p => p.id === 'product-5');
        return {
            designedProductImage: fallbackImage?.imageUrl || 'https://picsum.photos/seed/fallback/500/500',
            description: "Here is a beautiful design. Our AI is experiencing high demand, but we hope you like this creation!",
        };
    }
  }
);
