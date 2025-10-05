
'use server';
import { config } from 'dotenv';
config({ path: `.env.local` });
config();

import '@/ai/flows/community-trend-insights.ts';
import '@/ai/flows/buyer-ai-designed-products.ts';
import '@/ai/flows/translate-text.ts';
import '@/ai/flows/generate-product-details.ts';
