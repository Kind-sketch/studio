
'use server';
/**
 * @fileOverview Generates a unique image for a given user role.
 *
 * - generateRoleImage - A function that handles the image generation for roles.
 */

import {ai} from '@/ai/genkit';
import { GenerateRoleImageInput, GenerateRoleImageInputSchema, GenerateRoleImageOutput, GenerateRoleImageOutputSchema } from '@/ai/types/generate-role-image-types';


export async function generateRoleImage(
  input: GenerateRoleImageInput
): Promise<GenerateRoleImageOutput> {
  return generateRoleImageFlow(input);
}

const generateRoleImageFlow = ai.defineFlow(
  {
    name: 'generateRoleImageFlow',
    inputSchema: GenerateRoleImageInputSchema,
    outputSchema: GenerateRoleImageOutputSchema,
  },
  async (input) => {
    
    if (input.roleName === 'Artisan') {
        return { imageDataUri: 'https://image2url.com/images/1758398342370-5ab14d02-0dc5-4db2-a827-b098c96e830e.jpg' };
    }

    if (input.roleName === 'Buyer') {
        return { imageDataUri: 'https://image2url.com/images/1758455871777-6eaf44fb-b711-47ed-9d1e-58c268a2b846.jpg' };
    }

    if (input.roleName === 'Sponsor') {
        return { imageDataUri: 'https://image2url.com/images/1758456095335-272c45d4-4c2a-49d6-9e0b-b0b8cf58ae6a.png' };
    }
    
    // Fallback for any other role
    throw new Error(`No static image URL defined for role: ${input.roleName}`);
  }
);
