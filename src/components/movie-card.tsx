import Image from 'next/image';
import Link from 'next/link';
import { PlayCircle, Lock } from 'lucide-react';
import type { Movie } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  const placeholder = PlaceHolderImages.find(p => p.imageUrl === movie.thumbnailURL);

  return (
    <Link href={`/movie/${movie.id}`} className="block group relative aspect-video w-full overflow-hidden rounded-md shadow-lg">
      <Image
        src={movie.thumbnailURL}
        alt={movie.title}
        width={500}
        height={281}
        className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-110"
        data-ai-hint={placeholder?.imageHint}
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <PlayCircle className="h-16 w-16 text-white" />
      </div>
      {movie.isPremium && (
        <div className="absolute top-2 end-2 bg-primary p-1.5 rounded-full">
          <Lock className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      <div className={cn(
        "absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent",
        "opacity-100 group-hover:opacity-0 transition-opacity duration-300"
      )}>
        <h3 className="text-white font-semibold text-sm truncate">{movie.title}</h3>
      </div>
    </Link>
  );
}
