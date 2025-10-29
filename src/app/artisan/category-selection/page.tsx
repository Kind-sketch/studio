
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';
import { categories as baseCategories } from '@/lib/data';
import { useTranslation } from '@/context/translation-context';

export default function CategorySelectionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { translations } = useTranslation();
  const t = translations.category_selection_page;
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = baseCategories.map((category, index) => ({
    ...category,
    name: translations.product_categories[index] || category.name,
  }));

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
        title: t.noSelectionToast,
        description: t.noSelectionToastDesc,
      });
      return;
    }
    // In a real app, save this to the user's profile
    console.log('Selected categories:', selectedCategories);
    toast({
      title: t.savedToast,
      description: t.savedToastDesc,
    });
    router.push('/artisan/post-auth');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategories.includes(category.id) ? 'default' : 'outline'}
                className="h-24 flex-col gap-2 relative text-xs"
                onClick={() => toggleCategory(category.id)}
              >
                {selectedCategories.includes(category.id) && (
                  <div className="absolute top-2 right-2 bg-background text-primary rounded-full p-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <category.icon className="h-8 w-8" />
                <span className="text-center">{category.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
        <CardContent>
          <Button onClick={handleSave} className="w-full">
            {t.saveButton}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
