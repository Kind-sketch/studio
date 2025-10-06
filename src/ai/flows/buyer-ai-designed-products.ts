'use server';
/**
 * @fileOverview An AI flow that allows buyers to design custom products using AI.
 *
 * - buyerAiDesignedProducts - A function that handles the product design process.
 * - BuyerAiDesignedProductsInput - The input type for the buyerAiDesignedProducts function.
 * - BuyerAiDesignedProductsOutput - The return type for the buyerAiDesignedProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BuyerAiDesignedProductsInputSchema = z.object({
  imageUri: z
    .string()
    .optional()
    .describe(
      "An image provided by the buyer, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
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

const prompt = ai.definePrompt({
  name: 'buyerAiDesignedProductsPrompt',
  input: {schema: BuyerAiDesignedProductsInputSchema},
  output: {schema: BuyerAiDesignedProductsOutputSchema},
  prompt: `You are an AI assistant that helps buyers design custom products. Use the provided image, prompt and style to design a product that meets the buyer's needs. Return the designed product image as a data URI and provide a description of the designed product.

{{#if imageUri}}
Image: {{media url=imageUri}}
{{/if}}

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
    const {output} = await prompt(input);
    let model = 'googleai/imagen-4.0-fast-generate-001';
    let generationPrompt: any = input.prompt;
    let config: any = {};

    if (input.imageUri) {
      model = 'googleai/gemini-2.5-flash-image-preview';
      generationPrompt = [
        {media: {url: input.imageUri}},
        {text: `generate an image of this with the following prompt: ${input.prompt}`},
      ];
      config = {
        responseModalities: ['TEXT', 'IMAGE'],
      };
    }

    const {media} = await ai.generate({
      model: model,
      prompt: generationPrompt,
      config: config,
    });

    return {
      designedProductImage: media!.url,
      description: output!.description,
    };
  }
);
