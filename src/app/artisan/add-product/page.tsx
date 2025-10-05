'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateProductDetails } from '@/ai/flows/generate-product-details';
import { productCategories } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Camera, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/ai/flows/translate-text';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  productName: z.string().min(3, 'Product name is required.'),
  productCategory: z.string().min(1, 'Product category is required.'),
  productStory: z.string().min(10, 'Product story is required.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
});

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const { language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useCamera, setUseCamera] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [translatedContent, setTranslatedContent] = useState({
    title: 'Add a New Product',
    description: 'Upload a photo, and let AI help you with the details.',
    uploadButton: 'Upload Photo',
    cameraButton: 'Use Camera',
    productNameLabel: 'Product Name',
    productCategoryLabel: 'Product Category',
    productStoryLabel: 'Product Story',
    priceLabel: 'Price (₹)',
    pricePlaceholder: 'e.g., 49.99',
    generateDetailsButton: 'Generate with AI',
    generatingDetailsButton: 'Generating...',
    saveProductButton: 'Save Product',
    savingProductButton: 'Saving...',
    detailsGeneratedToast: 'Product Details Generated!',
    detailsGeneratedToastDesc: 'Review and edit the details below.',
    generationFailedToast: 'Generation Failed',
    generationFailedToastDesc: 'Could not generate details from the image.',
    productSavedToast: 'Product Saved!',
    productSavedToastDesc: 'Your new product has been added to your page.',
    noImageToast: 'No Image Provided',
    noImageToastDesc: 'Please upload or capture an image first.',
    captureButton: 'Capture Photo',
    cameraAccessRequired: 'Camera Access Required',
    cameraAccessDescription: 'Please allow camera access to use this feature.',
    cameraError: 'Error accessing camera:',
    cameraAccessDenied: 'Camera Access Denied',
    cameraAccessDeniedDesc: 'Please enable camera permissions in your browser settings to use this app.',
    uploadPlaceholder: 'Click "Upload Photo" or "Use Camera"',
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: '',
      productCategory: '',
      productStory: '',
      price: 0,
    },
  });

  useEffect(() => {
    const translate = async () => {
      if (language !== 'en') {
        const values = Object.values(translatedContent);
        const { translatedTexts } = await translateText({ texts: values, targetLanguage: language });
        const newContent: any = {};
        Object.keys(translatedContent).forEach((key, index) => {
          newContent[key] = translatedTexts[index];
        });
        setTranslatedContent(newContent);
      }
    };
    translate();
  }, [language]);

  useEffect(() => {
    return () => {
      // Cleanup: stop camera stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        setHasCameraPermission(true);
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };

    getCameraPermission();
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        setImageData(dataUrl);
        stopCamera();
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
        title: translatedContent.noImageToast,
        description: translatedContent.noImageToastDesc,
      });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateProductDetails({ photoDataUri: imageData });
      form.setValue('productName', result.productName);
      form.setValue('productCategory', result.productCategory);
      form.setValue('productStory', result.productStory);
      toast({
        title: translatedContent.detailsGeneratedToast,
        description: translatedContent.detailsGeneratedToastDesc,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: translatedContent.generationFailedToast,
        description: translatedContent.generationFailedToastDesc,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Mock saving the product
    setTimeout(() => {
      console.log({ ...values, image: imageData });
      setIsLoading(false);
      toast({
        title: translatedContent.productSavedToast,
        description: translatedContent.productSavedToastDesc,
      });
      router.push('/artisan/home');
    }, 1500);
  }

  const startCamera = async () => {
    stopCamera();
    setImagePreview(null);
    setUseCamera(true);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error(translatedContent.cameraError, error);
      setHasCameraPermission(false);
      setUseCamera(false);
      toast({
        variant: 'destructive',
        title: translatedContent.cameraAccessDenied,
        description: translatedContent.cameraAccessDeniedDesc,
      });
    }
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{translatedContent.title}</CardTitle>
          <CardDescription>{translatedContent.description}</CardDescription>
        </CardHeader>

        <CardContent>
            <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg bg-secondary overflow-hidden">
                {useCamera ? (
                    <div className="relative w-full h-full">
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                        <canvas ref={canvasRef} className="hidden" />
                        {hasCameraPermission === false && (
                            <div className="absolute inset-0 flex items-center justify-center p-4">
                               <Alert variant="destructive">
                                    <AlertTitle>{translatedContent.cameraAccessRequired}</AlertTitle>
                                    <AlertDescription>{translatedContent.cameraAccessDescription}</AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </div>
                ) : imagePreview ? (
                    <Image src={imagePreview} alt="Preview" layout="fill" className="object-contain"/>
                ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Upload className="w-8 h-8 mb-2" />
                        <p className="text-sm font-semibold">{translatedContent.uploadPlaceholder}</p>
                    </div>
                )}
            </div>
             <Input id="dropzone-file" type="file" className="hidden" onChange={handleImageChange} accept="image/*" ref={fileInputRef} />
        </CardContent>

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {useCamera && stream ? (
                <Button onClick={handleCapture} className="w-full">
                    <Camera className="mr-2 h-4 w-4" />
                    {translatedContent.captureButton}
                </Button>
            ) : (
                <>
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                        <Upload className="mr-2 h-4 w-4" />{translatedContent.uploadButton}
                    </Button>
                    <Button onClick={startCamera} variant="outline">
                        <Camera className="mr-2 h-4 w-4" />{translatedContent.cameraButton}
                    </Button>
                </>
            )}
        </CardContent>

        <CardContent>
            <Button onClick={handleGenerateDetails} disabled={isGenerating || !imageData} className="w-full">
                {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{translatedContent.generatingDetailsButton}</> : <><Sparkles className="mr-2 h-4 w-4" />{translatedContent.generateDetailsButton}</>}
            </Button>
        </CardContent>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="productName" render={({ field }) => (
                <FormItem>
                  <FormLabel>{translatedContent.productNameLabel}</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
               <FormField control={form.control} name="productCategory" render={({ field }) => (
                <FormItem>
                  <FormLabel>{translatedContent.productCategoryLabel}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {productCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}/>
               <FormField control={form.control} name="productStory" render={({ field }) => (
                <FormItem>
                  <FormLabel>{translatedContent.productStoryLabel}</FormLabel>
                  <FormControl><Textarea {...field} className="h-24" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem>
                  <FormLabel>{translatedContent.priceLabel}</FormLabel>
                  <FormControl><Input type="number" placeholder={translatedContent.pricePlaceholder} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {translatedContent.saveProductButton}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
