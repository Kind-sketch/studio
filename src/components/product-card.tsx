
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
  className?: string;
}

export default function ProductCard({ product, onSave, showSaveButton, className }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(product.likes);

  const handleLike = () => {
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  }

  return (
    <Card className={cn("overflow-hidden shadow-md transition-shadow hover:shadow-xl h-full flex flex-col", className)}>
      <CardContent className="p-0 flex-grow">
        <div className="relative aspect-[3/4] w-full">
          <Image
            src={product.image.url}
            alt={product.name}
            data-ai-hint={product.image.hint}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-2">
          <h3 className="font-headline text-sm font-semibold truncate">{product.name}</h3>
          <p className="text-xs text-muted-foreground truncate">
            by {product.artisan.name}
          </p>
          <div className="mt-2 flex justify-between items-center">
            <p className="font-semibold text-sm">₹{product.price.toFixed(2)}</p>
            <div className="flex items-center gap-1">
               <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={handleLike}
                >
                <Heart
                    className={cn(
                    'h-4 w-4 text-slate-700',
                    isLiked && 'fill-red-500 text-red-500'
                    )}
                />
                </Button>
                {showSaveButton && onSave && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 py-1 text-xs"
                        onClick={onSave}
                    >
                        Save
                    </Button>
                )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
