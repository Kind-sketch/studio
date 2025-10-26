
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import ProductCard from '@/components/product-card';
import type { SavedCollection, Product } from '@/lib/types';
import { products as allProducts } from '@/lib/data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from '@/context/translation-context';
import TutorialDialog from '@/components/tutorial-dialog';

export default function SavedCollectionPage() {
  const [collections, setCollections] = useState<SavedCollection[]>([]);
  const [openCollections, setOpenCollections] = useState<string[]>([]);
  const { translations } = useTranslation();
  const t = translations.saved_collection_page;

  useEffect(() => {
    const storedCollections: SavedCollection[] = JSON.parse(localStorage.getItem('artisanCollections') || '[]');
    setCollections(storedCollections);
    setOpenCollections(storedCollections.map(c => c.id));
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8 relative">
      <TutorialDialog pageId="saved-collection" />
      <header className="mb-8 mt-12">
        <h1 className="font-headline text-4xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
      </header>

      {collections.length > 0 ? (
        <Accordion type="multiple" value={openCollections} onValueChange={setOpenCollections} className="w-full space-y-4">
          {collections.map(collection => (
            <Card key={collection.id}>
                <AccordionItem value={collection.id} className="border-b-0">
                    <AccordionTrigger className="p-6 hover:no-underline">
                        <div className="text-left">
                            <h2 className="font-headline text-2xl font-semibold">{collection.name}</h2>
                            <p className="text-sm text-muted-foreground">{collection.productIds.length} {t.items}</p>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {collection.productIds.map(productId => {
                            const product = allProducts.find(p => p.id === productId);
                            return product ? <ProductCard key={product.id} product={product} /> : null;
                        })}
                        </div>
                         {collection.productIds.length === 0 && (
                            <div className="text-center text-muted-foreground py-8">
                                <p>{t.noItems}</p>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
            </Card>
          ))}
        </Accordion>
      ) : (
        <Card className="flex items-center justify-center p-12">
          <div className="text-center text-muted-foreground">
            <p className="text-lg">{t.noCollectionsTitle}</p>
            <p>{t.noCollectionsDescription}</p>
          </div>
        </Card>
      )}
    </div>
  );
}
