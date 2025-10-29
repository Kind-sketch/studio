
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      // Using a location for Vertex AI, which uses Application Default Credentials.
      // Make sure your environment is authenticated for Google Cloud.
      location: 'us-central1',
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
