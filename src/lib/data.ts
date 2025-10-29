
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
  { id: '1', name: 'Elena Vance', avatar: getImage('artisan-1'), crafts: ['Pottery', 'Glasswork'], phone: '123-456-7890' },
  { id: '2', name: 'Marcus Stone', avatar: getImage('artisan-2'), crafts: ['Woodwork', 'Leatherwork'], phone: '123-456-7891' },
  { id: '3', name: 'Aria Wu', avatar: getImage('artisan-3'), crafts: ['Textiles'], phone: '123-456-7892' },
  { id: '4', name: 'Leo Rivera', avatar: getImage('artisan-4'), crafts: ['Paintings', 'Sculpture'], phone: '123-456-7893' },
  { id: '5', name: 'Nia Patel', avatar: getImage('artisan-5'), crafts: ['Jewelry', 'Metalwork'], phone: '123-456-7894' },
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
    reviews: { rating: 4.5, count: 28 },
    story: "Inspired by the quiet moments of dawn at my studio, this vase captures the first light of day. Each one is a reminder of a new beginning."
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
    reviews: { rating: 4.8, count: 52 },
    story: "Woven with stories of my travels, this piece brings together patterns and textures from across the globe. It's a tapestry of memories and dreams."
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
    reviews: { rating: 4.6, count: 18 },
    story: "I let the wood guide my hands. This bowl is carved from a single piece of acacia, honoring the tree's natural beauty and strength."
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
    reviews: { rating: 4.9, count: 78 },
     story: "Crafted to hold the color of the sky on a perfect day, this necklace is a piece of wearable serenity. It's a simple reminder of endless possibility."
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
    reviews: { rating: 4.7, count: 21 },
    story: "This painting is a visual representation of a joyful memory. It's the chaos and beauty of life, all captured in a single moment of inspiration."
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
     reviews: { rating: 4.9, count: 112 },
     story: "For those who wander, this journal is a faithful companion. I craft each one to be as resilient and unique as the journeys it will document."
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
     reviews: { rating: 4.8, count: 33 },
     story: "I wanted to freeze a moment of the ocean's dance. This sculpture is that moment, a whisper of the sea's eternal rhythm."
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
    reviews: { rating: 4.7, count: 45 },
    story: "Each stitch is a tribute to the resilient flowers in my garden. This scarf is a wearable piece of nature's artistry."
  },
  {
    id: '12',
    name: 'Cityscape at Dusk',
    artisan: artisans[3],
    price: 450.0,
    image: getImage('product-12'),
    category: 'Paintings',
    description: 'An evocative oil painting that captures the mood of a city as day turns to night. The warm glow of streetlights reflects on wet pavement, creating a sense of both energy and intimacy. A perfect piece for a contemporary living space.',
    likes: 520,
    sales: 10,
    reviews: { rating: 4.9, count: 18 },
    story: "I love the city's dual personality. This painting is my attempt to capture that magical moment when the bustling day gives way to the electric energy of the night."
  },
  {
    id: '13',
    name: 'Tree of Life Pendant',
    artisan: artisans[4],
    price: 150.0,
    image: getImage('product-13'),
    category: 'Jewelry',
    description: 'A beautifully detailed silver pendant depicting the Tree of Life, symbolizing connection, family, and growth. This intricate piece is hung on a sturdy silver chain and makes a meaningful gift.',
    likes: 480,
    sales: 95,
    reviews: { rating: 4.9, count: 150 },
    story: 'The Tree of Life is a powerful symbol that connects us all. I crafted this pendant as a reminder that we are all rooted together in this world.'
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
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
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

    
    
