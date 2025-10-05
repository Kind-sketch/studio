
'use server';

import {TranslationServiceClient} from '@google-cloud/translate';

const translationClient = new TranslationServiceClient();

/**
 * Translates an array of texts to a target language.
 * @param texts The texts to translate.
 * @param targetLanguageCode The ISO 639-1 code of the target language.
 * @returns A promise that resolves to an array of translated texts.
 */
export async function translateTexts(texts: string[], targetLanguageCode: string): Promise<string[]> {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT;
  if (!projectId) {
    throw new Error("GOOGLE_CLOUD_PROJECT environment variable not set.");
  }
  
  const location = 'global'; 

  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: texts,
    mimeType: 'text/plain',
    sourceLanguageCode: 'en',
    targetLanguageCode: targetLanguageCode,
  };

  try {
    const [response] = await translationClient.translateText(request);
    
    if (!response.translations) {
        return texts;
    }

    return response.translations.map(translation => translation.translatedText || '');
    
  } catch (error) {
    console.error('Error calling Cloud Translation API:', error);
    // On error, return original texts as a fallback
    return texts;
  }
}
