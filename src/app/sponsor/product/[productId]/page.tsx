
'use client';

import { useParams, useRouter } from 'next/navigation';
import { products } from '@/lib/data';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft } from 'lucide-react';
import Reviews from '@/components/reviews';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const productId = params.productId as string;
  const product = products.find(p => p.id === productId);

  if (!product) {
    return <div className="p-4 text-center">Product not found.</div>;
  }

  const handleSponsor = () => {
    toast({
      title: 'Sponsorship Sent!',
      description: `Your request to sponsor ${product.artisan.name} has been sent.`,
    });
  };

  return (
    <div className="p-4">
       <Button onClick={() => router.back()} variant="ghost" className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-square w-full">
            <Image
              src={product.image.url}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        </CardContent>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-2xl md:text-3xl">{product.name}</CardTitle>
            <p className="font-semibold text-xl md:text-2xl pt-2">₹{product.price.toFixed(2)}</p>
          </div>
           {product.reviews && <Reviews rating={product.reviews.rating} count={product.reviews.count} />}
        </CardHeader>
        <CardContent>
            <Separator className="my-4" />
             <div>
                <h3 className="font-headline text-lg font-semibold mb-2">Artisan Details</h3>
                <p className="text-muted-foreground">Name: {product.artisan.name}</p>
                {product.artisan.phone && <p className="text-muted-foreground">Phone: {product.artisan.phone}</p>}
            </div>
            <Separator className="my-4" />
            <div>
                <h3 className="font-headline text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
            </div>
            {product.story && (
                <>
                    <Separator className="my-4" />
                    <div>
                        <h3 className="font-headline text-lg font-semibold mb-2">The Story Behind</h3>
                        <p className="text-muted-foreground italic">"{product.story}"</p>
                    </div>
                </>
            )}
        </CardContent>
        <CardContent>
            <Button onClick={handleSponsor} className="w-full">Sponsor Artisan</Button>
        </CardContent>
      </Card>
    </div>
  );
}
