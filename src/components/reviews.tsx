
'use client';

import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewsProps {
  rating: number;
  count: number;
  className?: string;
}

export default function Reviews({ rating, count, className }: ReviewsProps) {
  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="h-5 w-5 text-yellow-400 fill-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-5 w-5 text-yellow-400" />
          <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden">
             <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
      );
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />)
    }

    return stars;
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center">{renderStars()}</div>
      <span className="text-sm text-muted-foreground">({count} reviews)</span>
    </div>
  );
}
