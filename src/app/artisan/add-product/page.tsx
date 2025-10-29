
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateProductDetails } from '@/ai/flows/generate-product-details';
import { productCategories as baseProductCategories, artisans } from '@/lib/data';
import type { Product } from '@/lib/types';
import ProductPreview from '@/components/product-preview';


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Camera, Sparkles, ChevronLeft, Eye } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogClose } from '@/components/ui/dialog';
import ProductCard from '@/components/product-card';
import { useTranslation } from '@/context/translation-context';
import { useLanguage } from '@/context/language-context';


const formSchema = z.object({
  productName: z.string().min(3, 'Product name is required.'),
  productCategory: z.string().min(1, 'Product category is required.'),
  productDescription: z.string().min(10, 'Product description is required.'),
  productStory: z.string().min(10, 'Product story is required.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
});

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { translations } = useTranslation();
  const { language } = useLanguage();
  const t = translations.add_product_page;

  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useCamera, setUseCamera] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: '',
      productCategory: '',
      productDescription: '',
      productStory: '',
      price: 0,
    },
  });

  const formValues = form.watch();

  useEffect(() => {
    if (useCamera) {
      const getCameraPermission = async () => {
        if (typeof window !== 'undefined' && navigator.mediaDevices) {
          try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            setStream(mediaStream);
            if (videoRef.current) {
              videoRef.current.srcObject = mediaStream;
            }
            setHasCameraPermission(true);
          } catch (error) {
            console.error(t.cameraError, error);
            setHasCameraPermission(false);
            setUseCamera(false);
            toast({
              variant: 'destructive',
              title: t.cameraAccessDenied,
              description: t.cameraAccessDeniedDesc,
            });
          }
        } else {
          setHasCameraPermission(false);
        }
      };
      getCameraPermission();
    }
  
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [useCamera, stream, t.cameraAccessDenied, t.cameraAccessDeniedDesc, t.cameraError, toast]);


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
              canvas.width = img.width;
              canvas.height = img.height;
              context.drawImage(img, 0, 0);
              const dataUrl = canvas.toDataURL('image/png');
              setImagePreview(dataUrl);
              setImageData(dataUrl);
              stopCamera();
            }
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };
  
  const stopCamera = () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setUseCamera(false);
  }

  const handleGenerateDetails = async () => {
    if (!imageData) {
      toast({
        variant: 'destructive',
        title: t.noImageToast,
        description: t.noImageToastDesc,
      });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateProductDetails({ 
        photoDataUri: imageData,
        targetLanguage: language,
      });
      
      form.setValue('productName', result.productName);
      form.setValue('productDescription', result.productDescription);
      form.setValue('productStory', result.productStory);
      form.setValue('productCategory', result.productCategory);

      toast({
        title: t.detailsGeneratedToast,
        description: t.detailsGeneratedToastDesc,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: t.generationFailedToast,
        description: t.generationFailedToastDesc,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    const myProducts: Product[] = JSON.parse(localStorage.getItem('myArtisanProducts') || '[]');
    
    const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: values.productName,
        artisan: artisans[0], // Mocking artisan
        price: values.price,
        image: {
            url: imageData || '',
            hint: 'custom product'
        },
        category: values.productCategory,
        description: values.productDescription,
        story: values.productStory,
        likes: 0,
        sales: 0,
        createdAt: new Date().toISOString(),
    };
    
    myProducts.unshift(newProduct);
    localStorage.setItem('myArtisanProducts', JSON.stringify(myProducts));

    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: t.productSavedToast,
        description: t.productSavedToastDesc,
      });
      router.push('/artisan/my-products');
    }, 1000);
  }

  const startCamera = async () => {
    stopCamera();
    setImagePreview(null);
    setUseCamera(true);
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUrl = canvas.toDataURL('image/png');
      setImagePreview(dataUrl);
      setImageData(dataUrl);
      stopCamera();
    }
  };
  
  const handlePreview = async () => {
    const { productName, productDescription, productStory, productCategory, price } = form.getValues();

    setPreviewProduct({
      id: 'preview',
      name: productName || 'Product Name',
      artisan: artisans[0],
      price: price || 0,
      image: {
        url: imagePreview || `https://picsum.photos/seed/placeholder/400/500`,
        hint: 'product preview'
      },
      category: productCategory || 'Category',
      description: productDescription || 'Description',
      story: productStory || 'Your story about this product...',
      likes: 0,
      sales: 0
    });
  };

  const getCategoryDisplayValue = (value: string) => {
    const index = baseProductCategories.findIndex(c => c === value);
    if (index !== -1 && translations.product_categories.length > index) {
      return translations.product_categories[index];
    }
    return value;
  };


  return (
    <div className="p-4">
      <Button onClick={() => router.back()} variant="ghost" size="icon" className="mb-4 h-9 w-9 rounded-full bg-primary/10 text-primary hover:bg-primary/20 md:hidden">
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Card className="w-full max-w-xl mx-auto shadow-lg">
        <CardHeader>
          <div className="text-center">
              <CardTitle className="font-headline text-xl md:text-2xl">{t.title}</CardTitle>
              <CardDescription>{t.description}</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <div className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg bg-secondary overflow-hidden">
            {useCamera ? (
              <>
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                
                {hasCameraPermission === false && (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <Alert variant="destructive">
                      <AlertTitle>{t.cameraAccessRequired}</AlertTitle>
                      <AlertDescription>{t.cameraAccessDescription}</AlertDescription>
                    </Alert>
                  </div>
                )}
              </>
            ) : imagePreview ? (
              <div className="relative w-full h-full">
                <Image src={imagePreview} alt="Preview" fill className="object-contain"/>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <Upload className="w-8 h-8 mb-2" />
                <p className="text-sm font-semibold">{t.uploadPlaceholder}</p>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <Input id="dropzone-file" type="file" className="hidden" onChange={handleImageChange} accept="image/*" ref={fileInputRef} />
        </CardContent>

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {useCamera && stream ? (
                 <Button onClick={handleCapture} className="w-full">
                    <Camera className="mr-2 h-4 w-4" />
                    {t.captureButton}
                </Button>
            ) : (
                <>
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                        <Upload className="mr-2 h-4 w-4" />{t.uploadButton}
                    </Button>
                    <Button onClick={startCamera} variant="outline">
                        <Camera className="mr-2 h-4 w-4" />{t.cameraButton}
                    </Button>
                </>
            )}
        </CardContent>

        <CardContent>
            <Button onClick={handleGenerateDetails} disabled={isGenerating || !imageData} className="w-full">
                {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t.generatingDetailsButton}</> : <><Sparkles className="mr-2 h-4 w-4" />{t.generateDetailsButton}</>}
            </Button>
        </CardContent>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="productName" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.productNameLabel}</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
               <FormField control={form.control} name="productCategory" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.productCategoryLabel}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={t.selectCategoryPlaceholder}>
                                {getCategoryDisplayValue(field.value)}
                            </SelectValue>
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {baseProductCategories.map((cat, index) => (
                            <SelectItem key={cat} value={cat}>
                                {translations.product_categories[index] || cat}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}/>
               <FormField control={form.control} name="productDescription" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.productDescriptionLabel}</FormLabel>
                  <FormControl><Textarea {...field} className="h-24" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
               <FormField control={form.control} name="productStory" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.productStoryLabel}</FormLabel>
                  <FormControl><Textarea {...field} className="h-24" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.priceLabel}</FormLabel>
                  <FormControl><Input type="number" placeholder={t.pricePlaceholder} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full" onClick={handlePreview}>
                    <Eye className="mr-2 h-4 w-4" />
                    {t.previewButton}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-full w-full h-full max-h-full p-0 flex flex-col">
                    <div className="relative p-4 border-b">
                        <DialogTitle className="text-center font-headline">{t.previewTitle}</DialogTitle>
                         <DialogClose className="absolute right-2 top-1/2 -translate-y-1/2">
                            <Button variant="ghost" size="icon">
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                         </DialogClose>
                    </div>
                  <div className="flex-1 overflow-y-auto">
                     {previewProduct && <ProductPreview product={previewProduct} />}
                  </div>
                </DialogContent>
              </Dialog>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? t.savingProductButton : t.saveProductButton}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
