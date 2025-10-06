
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import { translateText } from '@/services/translation-service';

const baseQuestions = [
  "I'm having trouble uploading a product.",
  "My sales are not showing up correctly.",
  "How do I manage my sponsorships?",
  "I have a question about payments.",
  "My AI-generated details are not accurate.",
  "Other",
];

export default function SupportDialog({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [translatedContent, setTranslatedContent] = useState({
    title: 'How can we help?',
    description: 'Select one of the common issues below. Our team will be notified.',
    questions: baseQuestions,
    submitButton: 'Submit Concern',
    cancelButton: 'Cancel',
    toastTitle: 'Concern Received',
    toastDescription: 'Thank you for your feedback. Our support team will reach out to you shortly.',
    noQuestionSelected: 'Please select an issue.',
  });

  useEffect(() => {
    if (isOpen) {
        const translate = async () => {
            if (language !== 'en') {
                const textsToTranslate = [
                    'How can we help?',
                    'Select one of the common issues below. Our team will be notified.',
                    ...baseQuestions,
                    'Submit Concern',
                    'Cancel',
                    'Concern Received',
                    'Thank you for your feedback. Our support team will reach out to you shortly.',
                    'Please select an issue.',
                ];
                const { translatedTexts } = await translateText({ texts: textsToTranslate, targetLanguage: language });
                
                setTranslatedContent({
                    title: translatedTexts[0],
                    description: translatedTexts[1],
                    questions: translatedTexts.slice(2, 2 + baseQuestions.length),
                    submitButton: translatedTexts[2 + baseQuestions.length],
                    cancelButton: translatedTexts[3 + baseQuestions.length],
                    toastTitle: translatedTexts[4 + baseQuestions.length],
                    toastDescription: translatedTexts[5 + baseQuestions.length],
                    noQuestionSelected: translatedTexts[6 + baseQuestions.length],
                });
            } else {
                 setTranslatedContent({
                    title: 'How can we help?',
                    description: 'Select one of the common issues below. Our team will be notified.',
                    questions: baseQuestions,
                    submitButton: 'Submit Concern',
                    cancelButton: 'Cancel',
                    toastTitle: 'Concern Received',
                    toastDescription: 'Thank you for your feedback. Our support team will reach out to you shortly.',
                    noQuestionSelected: 'Please select an issue.',
                });
            }
        };
        translate();
    }
  }, [language, isOpen]);

  const handleSubmit = () => {
    if (!selectedQuestion) {
      toast({
        variant: 'destructive',
        title: translatedContent.noQuestionSelected,
      });
      return;
    }
    
    // In a real app, this would send the concern to a backend service.
    console.log('Support issue submitted:', selectedQuestion);

    toast({
      title: translatedContent.toastTitle,
      description: translatedContent.toastDescription,
    });
    setSelectedQuestion(null);
    setIsOpen(false);
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
        setSelectedQuestion(null);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{translatedContent.title}</DialogTitle>
          <DialogDescription>{translatedContent.description}</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
            {translatedContent.questions.map((question, index) => (
                <Button
                key={index}
                variant={selectedQuestion === question ? 'default' : 'outline'}
                className="w-full justify-start text-left h-auto py-2 whitespace-normal"
                onClick={() => setSelectedQuestion(question)}
                >
                {question}
                </Button>
            ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {translatedContent.cancelButton}
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit}>{translatedContent.submitButton}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    