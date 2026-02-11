'use client';

import type { Movie } from '@/lib/types';
import MovieCard from './movie-card';
import { useTranslation } from 'react-i18next';

type MovieCarouselProps = {
  title: string;
  movies: Movie[];
};

export default function MovieCarousel({ title, movies }: MovieCarouselProps) {
  const { t } = useTranslation();
  return (
    <section className="space-y-4 my-8">
      <h2 className="text-2xl font-semibold font-headline px-4 md:px-8">{t(`genres.${title}`, title)}</h2>
      <div className="relative">
        <div className="flex space-x-4 rtl:space-x-reverse overflow-x-auto pb-4 px-4 md:px-8 scrollbar-hide">
          {movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 w-[40vw] sm:w-[30vw] md:w-[24vw] lg:w-[18vw]">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
