export const dynamic = 'force-dynamic';
import Header from '@/components/header';
import HeroBanner from '@/components/hero-banner';
import MovieCarousel from '@/components/movie-carousel';
import { getMoviesByGenre, getFeaturedMovie } from '@/lib/data';
import NoMoviesFound from '@/components/no-movies-found';
import Footer from '@/components/footer';
import WelcomeModal from '@/components/welcome-modal';

export default async function Home() {
  const movieGenres = await getMoviesByGenre();
  const featuredMovie = await getFeaturedMovie();

  if (!featuredMovie) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-start bg-background">
        <Header />
        <NoMoviesFound />
        <Footer />
        <WelcomeModal />
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
      <Footer />
      <WelcomeModal />
    </main>
  );
}
