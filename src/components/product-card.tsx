'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Card className="overflow-hidden shadow-md transition-shadow hover:shadow-xl h-full flex flex-col">
      <CardContent className="p-0 flex-grow">
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={product.image.url}
            alt={product.name}
            data-ai-hint={product.image.hint}
            fill
            className="object-cover"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-10 w-10 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart
              className={cn(
                'h-5 w-5 text-slate-700',
                isLiked && 'fill-red-500 text-red-500'
              )}
            />
          </Button>
        </div>
        <div className="p-4">
          <h3 className="font-headline text-lg font-semibold truncate">{product.name}</h3>
          <p className="text-sm text-muted-foreground">
            by {product.artisan.name}
          </p>
          <p className="mt-2 font-semibold text-lg">₹{product.price.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
