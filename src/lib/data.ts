import type { Product, Artisan, Category, Language } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { Palette, Gem, Brush, Hammer, Scissors } from 'lucide-react';

const getImage = (id: string) => {
  const img = PlaceHolderImages.find((p) => p.id === id);
  return {
    url: img?.imageUrl || `https://picsum.photos/seed/${id}/400/500`,
    hint: img?.imageHint || 'product image',
  };
};

export const artisans: Artisan[] = [
  { id: '1', name: 'Elena Vance', avatar: getImage('artisan-1'), crafts: ['Ceramics', 'Glasswork'] },
  { id: '2', name: 'Marcus Stone', avatar: getImage('artisan-2'), crafts: ['Woodwork', 'Leatherwork']},
  { id: '3', name: 'Aria Wu', avatar: getImage('artisan-3'), crafts: ['Textiles'] },
  { id: '4', name: 'Leo Rivera', avatar: getImage('artisan-4'), crafts: ['Painting'] },
  { id: '5', name: 'Nia Patel', avatar: getImage('artisan-5'), crafts: ['Jewelry'] },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Ceramic Dawn Vase',
    artisan: artisans[0],
    price: 45.0,
    image: getImage('product-1'),
    category: 'Ceramics',
    likes: 120,
    sales: 30,
  },
  {
    id: '2',
    name: 'Bohemian Wall Weave',
    artisan: artisans[2],
    price: 75.0,
    image: getImage('product-2'),
    category: 'Textiles',
    likes: 250,
    sales: 45,
  },
  {
    id: '3',
    name: 'Acacia Serving Bowl',
    artisan: artisans[1],
    price: 60.0,
    image: getImage('product-3'),
    category: 'Woodwork',
    likes: 95,
    sales: 22,
  },
  {
    id: '4',
    name: 'Azure Dream Necklace',
    artisan: artisans[4],
    price: 120.0,
    image: getImage('product-4'),
    category: 'Jewelry',
    likes: 310,
    sales: 60,
  },
  {
    id: '5',
    name: 'Chromatic Burst',
    artisan: artisans[3],
    price: 250.0,
    image: getImage('product-5'),
    category: 'Painting',
    likes: 450,
    sales: 15,
  },
  {
    id: '6',
    name: 'The Wanderer\'s Journal',
    artisan: artisans[1],
    price: 35.0,
    image: getImage('product-6'),
    category: 'Leatherwork',
    likes: 180,
    sales: 80,
  },
   {
    id: '7',
    name: 'Ocean Whisper Sculpture',
    artisan: artisans[0],
    price: 180.0,
    image: getImage('product-7'),
    category: 'Glasswork',
    likes: 210,
    sales: 25,
  },
  {
    id: '8',
    name: 'Crimson Bloom Scarf',
    artisan: artisans[2],
    price: 55.0,
    image: getImage('product-8'),
    category: 'Textiles',
    likes: 140,
    sales: 50,
  },
];

export const categories: Category[] = [
  { id: '1', name: 'Painting', icon: Brush },
  { id: '2', name: 'Ceramics', icon: Palette },
  { id: '3', name: 'Jewelry', icon: Gem },
  { id: '4', name: 'Textiles', icon: Scissors },
  { id: '5', name: 'Woodwork', icon: Hammer },
];

export const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
];

export const statsData = {
  monthly: [
    { month: "Jan", likes: 1200, sales: 240 },
    { month: "Feb", likes: 2100, sales: 139 },
    { month: "Mar", likes: 800, sales: 980 },
    { month: "Apr", likes: 1500, sales: 390 },
    { month: "May", likes: 1890, sales: 480 },
    { month: "Jun", likes: 2390, sales: 380 },
  ],
  weekly: [
    { week: "Week 1", likes: 300, sales: 60 },
    { week: "Week 2", likes: 525, sales: 35 },
    { week: "Week 3", likes: 200, sales: 245 },
    { week: "Week 4", likes: 375, sales: 98 },
  ],
  yearly: [
    { year: "2022", likes: 15000, sales: 2900 },
    { year: "2023", likes: 22000, sales: 4100 },
    { year: "2024", likes: 18000, sales: 3500 },
  ],
};
