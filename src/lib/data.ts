
import type { Product, Artisan, Category, Language } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { Palette, Gem, Brush, Hammer, Scissors, ShoppingBag, VenetianMask, SprayCan } from 'lucide-react';

export const productCategories = [
    'Textiles',
    'Sculpture',
    'Woodwork',
    'Metalwork',
    'Paintings',
    'Pottery',
    'Jewelry',
];

const getImage = (id: string) => {
  const img = PlaceHolderImages.find((p) => p.id === id);
  return {
    url: img?.imageUrl || `https://picsum.photos/seed/${id}/400/500`,
    hint: img?.imageHint || 'product image',
  };
};

export const artisans: Artisan[] = [
  { id: '1', name: 'Elena Vance', avatar: getImage('artisan-1'), crafts: ['Pottery', 'Glasswork'] },
  { id: '2', name: 'Marcus Stone', avatar: getImage('artisan-2'), crafts: ['Woodwork', 'Leatherwork']},
  { id: '3', name: 'Aria Wu', avatar: getImage('artisan-3'), crafts: ['Textiles'] },
  { id: '4', name: 'Leo Rivera', avatar: getImage('artisan-4'), crafts: ['Paintings', 'Sculpture'] },
  { id: '5', name: 'Nia Patel', avatar: getImage('artisan-5'), crafts: ['Jewelry', 'Metalwork'] },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Ceramic Dawn Vase',
    artisan: artisans[0],
    price: 45.0,
    image: getImage('product-1'),
    category: 'Pottery',
    description: 'A beautiful hand-thrown ceramic vase with a warm, gradient glaze reminiscent of a sunrise. Perfect for holding fresh flowers or as a standalone decorative piece. Each vase is unique, with slight variations that add to its charm.',
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
    description: 'A large, hand-woven wall hanging that brings a touch of bohemian warmth to any room. Made with natural cotton and wool fibers, it features intricate macrame knots and a beautiful, flowing fringe.',
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
    description: 'A handcrafted serving bowl made from sustainable acacia wood. Its rich, natural grain makes each piece one-of-a-kind. Ideal for salads, fruits, or as a stunning centerpiece on your dining table.',
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
    description: 'An elegant silver necklace featuring a stunning azure-blue gemstone. The delicate chain and minimalist design make it a versatile piece for both everyday wear and special occasions. Hand-finished to perfection.',
    likes: 310,
    sales: 60,
  },
  {
    id: '5',
    name: 'Chromatic Burst',
    artisan: artisans[3],
    price: 250.0,
    image: getImage('product-5'),
    category: 'Paintings',
    description: 'A vibrant abstract painting on a large canvas. This piece is a burst of color and energy, designed to be a focal point in any modern space. The artist uses a mixed-media approach, adding texture and depth to the work.',
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
    description: 'A rustic, hand-stitched leather journal perfect for capturing your thoughts, sketches, or travel memories. The durable leather cover will develop a beautiful patina over time, making it uniquely yours.',
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
    description: 'A delicate, hand-blown glass sculpture that captures the movement of an ocean wave. The swirling blues and greens create a mesmerizing effect as they catch the light. A true statement piece for any art collector.',
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
    description: 'A soft, lightweight silk scarf featuring a hand-embroidered floral design in shades of crimson and gold. This versatile accessory adds a pop of color and elegance to any outfit, whether draped over the shoulders or tied around the neck.',
    likes: 140,
    sales: 50,
  },
  {
    id: '9',
    name: 'Bronze Leaf Sculpture',
    artisan: artisans[3],
    price: 320.0,
    image: getImage('product-9'),
    category: 'Sculpture',
    description: 'A stunning bronze sculpture of a cluster of leaves, capturing the delicate details of nature in a permanent form. This piece has a classic, timeless appeal and will enhance any home or office decor.',
    likes: 180,
    sales: 12,
  },
  {
    id: '10',
    name: 'Forged Iron Candlesticks',
    artisan: artisans[4],
    price: 90.0,
    image: getImage('product-10'),
    category: 'Metalwork',
    description: 'A pair of hand-forged iron candlesticks with a rustic, textured finish. Their sturdy and elegant design provides a perfect accent for a mantlepiece or dining table, adding a touch of old-world charm.',
    likes: 85,
    sales: 32,
  },
  {
    id: '11',
    name: 'Earthenware Pitcher Set',
    artisan: artisans[0],
    price: 75.0,
    image: getImage('product-11'),
    category: 'Pottery',
    description: 'A charming set of an earthenware pitcher and two matching cups. The pieces are finished with a speckled, cream-colored glaze. Ideal for serving beverages or for use as a decorative set.',
    likes: 155,
    sales: 40,
  }
];

const categoryIcons: { [key: string]: React.ElementType } = {
  'Textiles': Scissors,
  'Sculpture': VenetianMask,
  'Woodwork': Hammer,
  'Metalwork': SprayCan,
  'Paintings': Brush,
  'Pottery': Palette,
  'Jewelry': Gem,
  'Default': ShoppingBag,
}

export const categories: Category[] = [
  ...productCategories.map((cat, i) => ({ 
      id: (i + 1).toString(), 
      name: cat, 
      icon: categoryIcons[cat] || categoryIcons['Default']
  }))
];

export const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
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
