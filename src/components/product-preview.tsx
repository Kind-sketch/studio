
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from './ui/separator';

interface ProductPreviewProps {
    product: Product;
}

export default function ProductPreview({ product }: ProductPreviewProps) {
    return (
        <div className="p-0">
            <Card className="overflow-hidden border-none shadow-none">
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
                    <CardTitle className="font-headline text-2xl md:text-3xl">{product.name}</CardTitle>
                    <CardDescription className="text-md">by {product.artisan.name}</CardDescription>
                    <p className="font-semibold text-xl md:text-2xl pt-2">₹{Number(product.price).toFixed(2)}</p>
                </CardHeader>
                <CardContent>
                    <Separator className="my-4" />
                    <div>
                        <h3 className="font-headline text-lg font-semibold mb-2">Description</h3>
                        <p className="text-muted-foreground">{product.description}</p>
                    </div>
                    {product.story && (
                        <>
                            <Separator className="my-4" />
                            <div>
                                <h3 className="font-headline text-lg font-semibold mb-2">The Story</h3>
                                <p className="text-muted-foreground italic">"{product.story}"</p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
