'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { categories as baseCategories } from '@/lib/data';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/ai/flows/translate-text';

export default function CategorySelectionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { language } = useLanguage();
  const [categories, setCategories] = useState(baseCategories);
  const [translatedContent, setTranslatedContent] = useState({
    title: 'Select Your Crafts',
    description: 'Choose the categories that best describe your work. You can select more than one.',
    saveButton: 'Save and Continue',
    noSelectionToast: 'No categories selected',
    noSelectionToastDesc: 'Please select at least one craft category.',
    savedToast: 'Categories Saved!',
    savedToastDesc: "You're ready to start selling.",
  });

  useEffect(() => {
    const translateContent = async () => {
      if (language !== 'en') {
        const categoryNames = baseCategories.map(c => c.name);
        const textsToTranslate = [
          'Select Your Crafts',
          'Choose the categories that best describe your work. You can select more than one.',
          'Save and Continue',
          'No categories selected',
          'Please select at least one craft category.',
          'Categories Saved!',
          "You're ready to start selling.",
          ...categoryNames,
        ];

        const { translatedTexts } = await translateText({ texts: textsToTranslate, targetLanguage: language });
        
        setTranslatedContent({
          title: translatedTexts[0],
          description: translatedTexts[1],
          saveButton: translatedTexts[2],
          noSelectionToast: translatedTexts[3],
          noSelectionToastDesc: translatedTexts[4],
          savedToast: translatedTexts[5],
          savedToastDesc: translatedTexts[6],
        });

        const translatedCategories = baseCategories.map((category, index) => ({
          ...category,
          name: translatedTexts[7 + index],
        }));
        setCategories(translatedCategories);
      } else {
        setCategories(baseCategories);
        setTranslatedContent({
          title: 'Select Your Crafts',
          description: 'Choose the categories that best describe your work. You can select more than one.',
          saveButton: 'Save and Continue',
          noSelectionToast: 'No categories selected',
          noSelectionToastDesc: 'Please select at least one craft category.',
          savedToast: 'Categories Saved!',
          savedToastDesc: "You're ready to start selling.",
        });
      }
    };
    translateContent();
  }, [language]);


  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSave = () => {
    if (selectedCategories.length === 0) {
      toast({
        variant: 'destructive',
        title: translatedContent.noSelectionToast,
        description: translatedContent.noSelectionToastDesc,
      });
      return;
    }
    // In a real app, save this to the user's profile
    console.log('Selected categories:', selectedCategories);
    toast({
      title: translatedContent.savedToast,
      description: translatedContent.savedToastDesc,
    });
    router.push('/artisan/profile');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{translatedContent.title}</CardTitle>
          <CardDescription>{translatedContent.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategories.includes(category.id) ? 'default' : 'outline'}
                className="h-20 flex-col gap-2 relative"
                onClick={() => toggleCategory(category.id)}
              >
                {selectedCategories.includes(category.id) && (
                  <div className="absolute top-2 right-2 bg-background text-primary rounded-full p-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <category.icon className="h-6 w-6" />
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
        <CardContent>
          <Button onClick={handleSave} className="w-full">
            {translatedContent.saveButton}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
