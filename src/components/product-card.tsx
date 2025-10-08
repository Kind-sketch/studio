
'use client';

import Image from 'next/image';
import { Heart, Bookmark, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
          <div className="absolute top-1 right-1 flex flex-col gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white flex flex-col"
              onClick={handleLike}
            >
              <Heart
                className={cn(
                  'h-4 w-4 text-slate-700',
                  isLiked && 'fill-red-500 text-red-500'
                )}
              />
              <span className="text-[10px] text-slate-700 font-bold">{likeCount}</span>
            </Button>
            {showSaveButton && onSave && (
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white"
                    onClick={onSave}
                >
                    <Bookmark className='h-4 w-4 text-slate-700' />
                </Button>
            )}
          </div>
        </div>
        <div className="p-2">
          <h3 className="font-headline text-xs font-semibold truncate">{product.name}</h3>
          <p className="text-[10px] text-muted-foreground truncate">
            by {product.artisan.name}
          </p>
          <p className="mt-1 font-semibold text-sm">₹{product.price.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
