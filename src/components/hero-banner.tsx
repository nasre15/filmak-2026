import Image from 'next/image';
import Link from 'next/link';
import { Info, Play } from 'lucide-react';
import type { Movie } from '@/lib/types';
import { Button } from '@/components/ui/button';

type HeroBannerProps = {
  movie: Movie;
};

export default function HeroBanner({ movie }: HeroBannerProps) {
  if (!movie.backdropURL) {
    return null;
  }

  return (
    <div className="relative h-[56.25vw] min-h-[400px] max-h-[800px] w-full">
      <Image
        src={movie.backdropURL}
        alt={movie.title}
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent"></div>

      <div className="absolute bottom-[20%] md:bottom-[30%] left-4 md:left-16 max-w-md space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold font-headline">{movie.title}</h1>
        <p className="text-sm md:text-base text-foreground/80 line-clamp-3">{movie.description}</p>
        <div className="flex items-center gap-4">
          <Link href={`/watch/${movie.id}`}>
            <Button size="lg">
              <Play className="mr-2" />
              Play
            </Button>
          </Link>
          <Button size="lg" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
            <Info className="mr-2" />
            More Info
          </Button>
        </div>
      </div>
    </div>
  );
}
