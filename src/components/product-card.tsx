
'use client';

import Image from 'next/image';
import { Heart, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  onSave?: () => void;
  showSaveButton?: boolean;
}

export default function ProductCard({ product, onSave, showSaveButton }: ProductCardProps) {
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
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart
                className={cn(
                  'h-4 w-4 sm:h-5 sm:w-5 text-slate-700',
                  isLiked && 'fill-red-500 text-red-500'
                )}
              />
            </Button>
            {showSaveButton && onSave && (
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white"
                    onClick={onSave}
                >
                    <Bookmark className='h-4 w-4 sm:h-5 sm:w-5 text-slate-700' />
                </Button>
            )}
          </div>
        </div>
        <div className="p-2 sm:p-4">
          <h3 className="font-headline text-base sm:text-lg font-semibold truncate">{product.name}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            by {product.artisan.name}
          </p>
          <p className="mt-1 sm:mt-2 font-semibold text-md sm:text-lg">₹{product.price.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
