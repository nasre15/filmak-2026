import Header from '@/components/header';
import HeroBanner from '@/components/hero-banner';
import MovieCarousel from '@/components/movie-carousel';
import { getMoviesByGenre, getFeaturedMovie } from '@/lib/data';

export default async function Home() {
  const movieGenres = await getMoviesByGenre();
  const featuredMovie = await getFeaturedMovie();

  if (!featuredMovie) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-start bg-background">
        <Header />
        <div className="w-full flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">No movies found.</h2>
            <p className="text-muted-foreground mt-2">
              Try adding some movies in the admin panel.
            </p>
          </div>
        </div>
        <footer className="w-full text-center p-8 text-muted-foreground text-sm">
          StreamVerse - All rights reserved.
        </footer>
      </main>
    );
  }

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
