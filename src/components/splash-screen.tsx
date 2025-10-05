import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function SplashScreen() {
  const splashImage = PlaceHolderImages.find((p) => p.id === 'splash-screen');

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center bg-black">
      {splashImage && (
        <Image
          src={splashImage.imageUrl}
          alt={splashImage.description}
          data-ai-hint={splashImage.imageHint}
          fill
          className="object-contain"
          priority
        />
      )}
    </div>
  );
}
