
'use client';

import { products, categories } from '@/lib/data';
import ProductCard from '@/components/product-card';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

export default function BuyerHomePage() {
  const trendingProducts = [...products].sort((a, b) => b.likes - a.likes);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Discover Handcrafted Wonders
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore unique creations from artisans around the world.
        </p>
      </header>

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="mb-4 font-headline text-2xl font-semibold">
          Categories
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group cursor-pointer overflow-hidden text-center transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <CardContent className="flex flex-col items-center justify-center p-6">
                <category.icon className="mb-2 h-8 w-8 text-primary transition-colors group-hover:text-accent-foreground" />
                <span className="font-semibold text-foreground group-hover:text-accent-foreground">{category.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="mb-12">
        <h2 className="mb-4 font-headline text-2xl font-semibold">
          Trending Now
        </h2>
        <Carousel
          opts={{ align: 'start', loop: true }}
          plugins={[Autoplay({ delay: 2500, stopOnInteraction: false })]}
        >
          <CarouselContent>
            {trendingProducts.map((product) => (
              <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      {/* Main Product Feed */}
      <section>
        <h2 className="mb-4 font-headline text-2xl font-semibold">
          All Products
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
