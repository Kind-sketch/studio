
import { z } from 'genkit';

export const BuyerAiDesignedProductsInputSchema = z.object({
  prompt: z.string().describe("The buyer's description of the product."),
  style: z.string().describe('The style or category of the craft.'),
});
export type BuyerAiDesignedProductsInput = z.infer<typeof BuyerAiDesignedProductsInputSchema>;

export const BuyerAiDesignedProductsOutputSchema = z.string().describe('A data URI of the generated image.');
export type BuyerAiDesignedProductsOutput = z.infer<typeof BuyerAiDesignedProductsOutputSchema>;
