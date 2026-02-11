import { getMovieDetails } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Star, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type MoviePageProps = {
  params: {
    id: string;
  };
};

export default async function MoviePage({ params }: MoviePageProps) {
  const movie = await getMovieDetails(params.id);

  if (!movie) {
    notFound();
  }

  return (
    <div className="bg-background text-foreground">
      <Header />
      <main className="pt-16">
        <div className="relative h-[40vh] md:h-[60vh] w-full">
          {movie.backdropURL && (
            <Image
              src={movie.backdropURL}
              alt={`${movie.title} backdrop`}
              fill
              className="object-cover object-top"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-8 -mt-24 md:-mt-48 relative z-10 pb-16">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
              <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={movie.thumbnailURL}
                  alt={`${movie.title} poster`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-2/3 lg:w-3/4 pt-8 md:pt-20">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span>{movie.voteAverage.toFixed(1)} / 10</span>
                </div>
                <span>•</span>
                <span>{movie.releaseYear}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres?.map((genre) => (
                  <Badge key={genre.id} variant="outline">{genre.name}</Badge>
                ))}
              </div>

              <p className="max-w-3xl text-foreground/80 mb-8">{movie.description}</p>

              <Link href={`/watch/${movie.id}`}>
                <Button size="lg" className="text-lg h-12 px-10">
                  <Play className="mr-2 h-6 w-6" />
                  Watch Now
                </Button>
              </Link>
            </div>
          </div>

          {movie.cast && movie.cast.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-6">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {movie.cast.map((actor) => (
                  <div key={actor.id} className="text-center">
                    <div className="aspect-[2/3] relative rounded-lg overflow-hidden mb-2 bg-muted">
                        <Avatar className="h-full w-full rounded-none">
                            <AvatarImage src={actor.profileURL} alt={actor.name} className="object-cover" />
                            <AvatarFallback className="rounded-none">{actor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>
                    <p className="font-semibold">{actor.name}</p>
                    <p className="text-sm text-muted-foreground">{actor.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
