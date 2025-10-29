import { z } from 'genkit';

export const BuyerAiDesignedProductsInputSchema = z.object({
  prompt: z.string().describe("The buyer's description of the product."),
  style: z.string().describe('The style or category of the craft.'),
  language: z.string().optional().describe('The language of the prompt.'),
});
export type BuyerAiDesignedProductsInput = z.infer<typeof BuyerAiDesignedProductsInputSchema>;

// The output is a string, which will contain the base64 data URI of the generated image.
export const BuyerAiDesignedProductsOutputSchema = z.string().describe('A data URI of the generated image.');
export type BuyerAiDesignedProductsOutput = z.infer<typeof BuyerAiDesignedProductsOutputSchema>;
