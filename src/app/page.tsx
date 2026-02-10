import Header from '@/components/header';
import HeroBanner from '@/components/hero-banner';
import MovieCarousel from '@/components/movie-carousel';
import { getMoviesByGenre, getFeaturedMovie } from '@/lib/data';

export default function Home() {
  const movieGenres = getMoviesByGenre();
  const featuredMovie = getFeaturedMovie();

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-background">
      <Header />
      <HeroBanner movie={featuredMovie} />
      <div className="w-full">
        {movieGenres.map((genre) => (
          <MovieCarousel key={genre.title} title={genre.title} movies={genre.movies} />
        ))}
      </div>
      <footer className="w-full text-center p-8 text-muted-foreground text-sm">
        StreamVerse - All rights reserved.
      </footer>
    </main>
  );
}
