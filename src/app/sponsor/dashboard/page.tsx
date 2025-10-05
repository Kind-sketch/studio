'use client';

import { products, categories } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";

export default function SponsorDashboardPage() {
  const { toast } = useToast();

  const handleSponsor = (product: Product) => {
    toast({
      title: "Sponsorship Sent!",
      description: `Your request to sponsor ${product.artisan.name} for their "${product.name}" has been sent.`,
    });
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Sponsor Artisans</h1>
        <p className="text-lg text-muted-foreground">Discover and support talented creators.</p>
      </header>

      <div className="space-y-12">
        {categories.map((category) => (
          <section key={category.id}>
            <h2 className="font-headline text-2xl font-semibold mb-4">{category.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.filter(p => p.category === category.name).map(product => (
                <Card key={product.id} className="overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                       <Image
                        src={product.image.url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                       <div className="absolute bottom-0 left-0 p-4">
                        <h3 className="font-bold text-lg text-white font-headline">{product.name}</h3>
                        <p className="text-sm text-white/90">by {product.artisan.name}</p>
                       </div>
                    </div>
                  </CardContent>
                  <CardContent className="p-4">
                     <p className="text-sm text-muted-foreground mb-4 h-10">
                        {product.artisan.name} specializes in {product.category}. Support their craft to see more creations like this.
                     </p>
                    <Button className="w-full" onClick={() => handleSponsor(product)}>Sponsor Artisan</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
