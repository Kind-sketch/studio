
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

  const handleLike = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  }

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if(onSave) {
      onSave();
    }
  }

  return (
    <Card className={cn("overflow-hidden shadow-sm transition-shadow hover:shadow-lg h-full flex flex-col", className)}>
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
        <div className="p-1 sm:p-2 space-y-1">
          <h3 className="font-headline text-[10px] sm:text-xs font-semibold truncate leading-tight">{product.name}</h3>
          <p className="text-[9px] sm:text-[10px] text-muted-foreground truncate">
            by {product.artisan.name}
          </p>
          <div className="flex justify-between items-center pt-0.5">
            <p className="font-semibold text-[10px] sm:text-xs">₹{product.price.toFixed(2)}</p>
            <div className="flex items-center gap-0.5">
               <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={handleLike}
                >
                <Heart
                    className={cn(
                    'h-3 w-3 text-slate-700',
                    isLiked && 'fill-red-500 text-red-500'
                    )}
                />
                </Button>
                {showSaveButton && onSave && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-1.5 py-0.5 text-[10px]"
                        onClick={handleSaveClick}
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

    