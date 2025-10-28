
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useArtisan } from '@/context/ArtisanContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { translateText } from '@/ai/flows/translate-text';
import type { OrderStatus } from '@/context/ArtisanContext';


type TranslatedContent = {
    title: string;
    orderIdLabel: string;
    buyerLabel: string;
    quantityLabel: string;
    currentStatusLabel: string;
    newStatusLabel: string;
    saveButton: string;
    toastTitle: string;
    toastDescription: string;
    productName: string;
    statuses: {
        Processing: string;
        Shipped: string;
        Delivered: string;
    };
};

function UpdateOrder() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  const { orders, updateOrderStatus } = useArtisan();
  const { toast } = useToast();
  
  const order = orders.find(o => o.id === id);
  
  const [status, setStatus] = useState<OrderStatus>(order?.status || 'Processing');
  const [isSaving, setIsSaving] = useState(false);
  
  const [translatedContent, setTranslatedContent] = useState<TranslatedContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);
  
  useEffect(() => {
    if (!order) return;
    const originalContent = {
        title: "Update Order Status",
        orderIdLabel: "Order ID",
        buyerLabel: "Buyer",
        quantityLabel: "Quantity",
        currentStatusLabel: "Current Status",
        newStatusLabel: "New Status",
        saveButton: "Save Status",
        toastTitle: "Status Updated!",
        toastDescription: `Order ${order.id} has been marked as`,
        statuses: {
            Processing: "Processing",
            Shipped: "Shipped",
            Delivered: "Delivered",
        },
    };

    const translate = async () => {
        if (lang === 'en') {
            setTranslatedContent({ ...originalContent, productName: order.product.name });
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const texts = [
                originalContent.title,
                originalContent.orderIdLabel,
                originalContent.buyerLabel,
                originalContent.quantityLabel,
                originalContent.currentStatusLabel,
                originalContent.newStatusLabel,
                originalContent.saveButton,
                originalContent.toastTitle,
                originalContent.toastDescription,
                ...Object.values(originalContent.statuses),
                order.product.name,
            ];
            
            const translations = await Promise.all(texts.map(t => translateText({ text: t, targetLanguage: lang })));
            let i = 0;
            const newContent: TranslatedContent = {
                title: translations[i++].translatedText,
                orderIdLabel: translations[i++].translatedText,
                buyerLabel: translations[i++].translatedText,
                quantityLabel: translations[i++].translatedText,
                currentStatusLabel: translations[i++].translatedText,
                newStatusLabel: translations[i++].translatedText,
                saveButton: translations[i++].translatedText,
                toastTitle: translations[i++].translatedText,
                toastDescription: translations[i++].translatedText,
                statuses: {
                    Processing: translations[i++].translatedText,
                    Shipped: translations[i++].translatedText,
                    Delivered: translations[i++].translatedText,
                },
                productName: translations[i++].translatedText,
            };
            setTranslatedContent(newContent);
        } catch (error) {
            console.error("Translation failed for Update Order page:", error);
            setTranslatedContent({ ...originalContent, productName: order.product.name });
        } finally {
            setIsLoading(false);
        }
    };

    translate();
  }, [lang, order]);

  if (!order) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Order not found.</p>
      </div>
    );
  }
  
  const handleSave = () => {
    if (!translatedContent) return;
    setIsSaving(true);
    setTimeout(() => {
        updateOrderStatus(order.id, status);
        setIsSaving(false);
        toast({
            title: translatedContent.toastTitle,
            description: `${translatedContent.toastDescription} ${translatedContent.statuses[status]}.`,
        });
        router.push(`/artisan/dashboard/orders?lang=${lang}`);
    }, 1000);
  };

  if (isLoading || !translatedContent) {
      return <div className="flex h-full items-center justify-center">Loading...</div>
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft />
            </Button>
            <div>
                <h1 className="text-2xl font-bold font-headline">{translatedContent.title}</h1>
                <p className="text-muted-foreground">{translatedContent.orderIdLabel}: {order.id}</p>
            </div>
        </div>

        <Card>
            <CardHeader>
                <div className="flex gap-4">
                    {order.product.image && (
                         <div className="relative aspect-square w-24 rounded-lg overflow-hidden border flex-shrink-0">
                            <Image src={order.product.image.imageUrl} alt={order.product.name} fill className="object-cover" />
                        </div>
                    )}
                    <div className='flex-1'>
                        <CardTitle className="font-headline text-xl">{translatedContent.productName}</CardTitle>
                        <div className="pt-2 text-sm text-muted-foreground">
                            <p><strong>{translatedContent.buyerLabel}:</strong> {order.buyer}</p>
                            <p><strong>{translatedContent.quantityLabel}:</strong> {order.quantity}</p>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <h3 className="font-semibold">{translatedContent.currentStatusLabel}: {translatedContent.statuses[order.status]}</h3>
                <div>
                    <Label htmlFor="status-group" className='font-semibold'>{translatedContent.newStatusLabel}</Label>
                    <RadioGroup id="status-group" value={status} onValueChange={(value) => setStatus(value as OrderStatus)} className="mt-2 space-y-2">
                        {Object.entries(translatedContent.statuses).map(([key, value]) => (
                            <div key={key} className="flex items-center space-x-2">
                                <RadioGroupItem value={key} id={key.toLowerCase()} />
                                <Label htmlFor={key.toLowerCase()}>{value}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            </CardContent>
            <CardFooter>
                 <Button onClick={handleSave} disabled={isSaving || status === order.status} className="w-full">
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {translatedContent.saveButton}
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}


export default function UpdateOrderPage() {
    return (
        <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
            <UpdateOrder />
        </Suspense>
    )
}

    
