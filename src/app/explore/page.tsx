'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks/use-debounce';
import type { Movie } from '@/lib/types';
import { discoverMovies } from './actions';
import { GENRES_TO_DISPLAY } from '@/lib/data';
import MovieCard from '@/components/movie-card';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';

const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1900; year--) {
    years.push(String(year));
  }
  return years;
};

export default function ExplorePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  // Filters state reflects the URL search params
  const genre = searchParams.get('genre') || '';
  const year = searchParams.get('year') || '';
  const rating = Number(searchParams.get('rating')) || 0;
  
  // Local state for controlled components to provide a better UX
  const [localRating, setLocalRating] = useState(rating);
  const debouncedRating = useDebounce(localRating, 500);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const yearOptions = generateYearOptions();

  const handleFilterChange = useCallback((type: 'genre' | 'year' | 'rating', value: string | number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const stringValue = String(value);

    if (stringValue && stringValue !== '0') {
      current.set(type, stringValue);
    } else {
      current.delete(type);
    }
    
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`, { scroll: false });
  }, [searchParams, router, pathname]);

  useEffect(() => {
    if (debouncedRating !== rating) {
      handleFilterChange('rating', debouncedRating);
    }
  }, [debouncedRating, rating, handleFilterChange]);

  const resetFilters = () => {
    setLocalRating(0);
    router.push(pathname, { scroll: false });
  };
  
  const fetchAndSetMovies = useCallback(async (filters, pageNum) => {
    setIsLoading(true);
    try {
      const newMovies = await discoverMovies({ ...filters, page: pageNum });
      if (pageNum === 1) {
        setMovies(newMovies);
      } else {
        setMovies(prev => [...prev, ...newMovies]);
      }
      setHasMore(newMovies.length > 0);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to reset and fetch movies when filters change in the URL
  useEffect(() => {
    fetchAndSetMovies({ genre, year, rating }, 1);
  }, [genre, year, rating, fetchAndSetMovies]);

  // Effect for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && page > 0) {
          fetchAndSetMovies({ genre, year, rating }, page + 1);
        }
      },
      { rootMargin: '0px 0px 400px 0px' }
    );
    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoading, page, genre, year, rating, fetchAndSetMovies]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <aside className="w-full md:w-64 lg:w-72 md:pr-8 space-y-6 hidden md:block sticky top-16 self-start pt-8 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
          <h2 className="text-2xl font-bold">{t('explorePage.filters')}</h2>

          <div className="space-y-2">
            <Label htmlFor="genre-select">{t('explorePage.genre')}</Label>
            <Select value={genre} onValueChange={(val) => handleFilterChange('genre', val)}>
              <SelectTrigger id="genre-select">
                <SelectValue placeholder={t('explorePage.allGenres')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('explorePage.allGenres')}</SelectItem>
                {GENRES_TO_DISPLAY.map((g) => (
                  <SelectItem key={g.id} value={String(g.id)}>{t(`genres.${g.name}`, g.name)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year-select">{t('explorePage.year')}</Label>
            <Select value={year} onValueChange={(val) => handleFilterChange('year', val)}>
              <SelectTrigger id="year-select">
                <SelectValue placeholder={t('explorePage.allYears')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('explorePage.allYears')}</SelectItem>
                {yearOptions.map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating-slider">{t('explorePage.rating')}: {localRating.toFixed(1)} / 10</Label>
            <Slider
              id="rating-slider"
              min={0}
              max={10}
              step={0.5}
              value={[localRating]}
              onValueChange={(value) => setLocalRating(value[0])}
            />
          </div>

          <Button onClick={resetFilters} variant="outline" className="w-full">{t('explorePage.reset')}</Button>
        </aside>

        <main className="flex-1 pt-8 md:pl-8">
          <h1 className="text-3xl font-bold mb-6">{t('explorePage.title')}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {(isLoading && page === 1 ? Array.from({ length: 20 }) : movies).map((movie, index) => 
              movie ? (
                <MovieCard movie={movie} key={`${movie.id}-${index}`} />
              ) : (
                <Skeleton key={index} className="w-full aspect-video rounded-md" />
              )
            )}
          </div>
          <div ref={loadMoreRef} className="h-10 w-full" />
          {isLoading && page > 1 && (
             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={`loader-${i}`} className="w-full aspect-video rounded-md" />
                ))}
             </div>
          )}
          {!isLoading && !hasMore && movies.length > 0 && (
            <p className="text-center text-muted-foreground my-8">{t('explorePage.noMoreMovies')}</p>
          )}
           {!isLoading && !hasMore && movies.length === 0 && (
            <p className="text-center text-muted-foreground my-8">No movies found matching your criteria.</p>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
