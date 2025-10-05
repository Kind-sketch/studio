import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Logo } from './icons';

export default function SplashScreen() {
  const splashImage = PlaceHolderImages.find((p) => p.id === 'splash-screen');

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-background">
      {splashImage && (
        <Image
          src={splashImage.imageUrl}
          alt={splashImage.description}
          data-ai-hint={splashImage.imageHint}
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex flex-col items-center text-center text-white">
        <Logo className="h-24 w-24 text-primary-foreground" />
        <h1 className="mt-4 font-headline text-5xl font-bold">
          Artistry Havens
        </h1>
        <p className="mt-2 text-lg text-primary-foreground/80">
          Where creativity finds a home.
        </p>
      </div>
    </div>
  );
}
