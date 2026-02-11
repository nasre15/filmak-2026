"use client";
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks/use-debounce';
import type { Movie } from '@/lib/types';
import { discoverMovies, searchMovies } from './actions';
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
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

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
  const [isSearchActive, setIsSearchActive] = useState(false);

  // URL-driven state for filters
  const genre = searchParams.get('genre') || 'all';
  const year = searchParams.get('year') || 'all';
  const rating = Number(searchParams.get('rating')) || 0;
  const q = searchParams.get('q') || '';
  
  // Local state for controlled components to provide a better UX
  const [localRating, setLocalRating] = useState(rating);
  const [searchQuery, setSearchQuery] = useState(q);

  const debouncedRating = useDebounce(localRating, 500);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const yearOptions = generateYearOptions();

  const handleFilterChange = useCallback((type: 'genre' | 'year' | 'rating' | 'q', value: string | number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const stringValue = String(value);

    // If a search query is being applied, remove other filters for clarity
    if (type === 'q' && stringValue) {
      current.delete('genre');
      current.delete('year');
      current.delete('rating');
    }

    if (stringValue && stringValue !== '0' && stringValue !== 'all') {
      current.set(type, stringValue);
    } else {
      current.delete(type);
    }
    
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`, { scroll: false });
  }, [searchParams, router, pathname]);

  // Sync URL params to local state
  useEffect(() => {
    setLocalRating(rating);
    setSearchQuery(q);
    setIsSearchActive(!!q);
  }, [rating, q]);

  useEffect(() => {
    if (debouncedRating !== rating && !isSearchActive) {
      handleFilterChange('rating', debouncedRating);
    }
  }, [debouncedRating, rating, handleFilterChange, isSearchActive]);

  useEffect(() => {
    // Only trigger search if the debounced query is different from the URL query
    if (debouncedSearchQuery !== q) {
      handleFilterChange('q', debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, q, handleFilterChange]);

  const resetFilters = () => {
    setLocalRating(0);
    setSearchQuery('');
    router.push(pathname, { scroll: false });
  };
  
  const fetchAndSetMovies = useCallback(async (params, pageNum) => {
    setIsLoading(true);
    try {
      const { genre: filterGenre, year: filterYear, rating: filterRating, q: searchQuery } = params;
      let newMovies: Movie[];

      if (searchQuery) {
        newMovies = await searchMovies(searchQuery, pageNum);
      } else {
        newMovies = await discoverMovies({
          genre: filterGenre === 'all' ? '' : filterGenre,
          year: filterYear === 'all' ? '' : filterYear,
          rating: filterRating,
          page: pageNum,
        });
      }

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

  // Effect to reset and fetch movies when filters/search change in the URL
  useEffect(() => {
    fetchAndSetMovies({ genre, year, rating, q }, 1);
  }, [genre, year, rating, q, fetchAndSetMovies]);

  // Effect for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && page > 0) {
          fetchAndSetMovies({ genre, year, rating, q }, page + 1);
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
  }, [hasMore, isLoading, page, genre, year, rating, q, fetchAndSetMovies]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <aside className="w-full md:w-64 lg:w-72 md:pe-8 space-y-6 hidden md:block sticky top-16 self-start h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
          <h2 className="text-2xl font-bold">{t('explorePage.filters')}</h2>
          
          <fieldset disabled={isSearchActive} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="genre-select">{t('explorePage.genre')}</Label>
              <Select value={genre} onValueChange={(val) => handleFilterChange('genre', val)}>
                <SelectTrigger id="genre-select">
                  <SelectValue placeholder={t('explorePage.allGenres')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('explorePage.allGenres')}</SelectItem>
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
                  <SelectItem value="all">{t('explorePage.allYears')}</SelectItem>
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
          </fieldset>

          <Button onClick={resetFilters} variant="outline" className="w-full">{t('explorePage.reset')}</Button>
        </aside>

        <main className="flex-1 pt-8 md:ps-8">
          <h1 className="text-3xl font-bold mb-6">{isSearchActive ? t('explorePage.searchResults', 'Search Results') : t('explorePage.title')}</h1>
          
          <div className="relative mb-6">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={t('explorePage.searchPlaceholder', 'Search for movies...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 ps-10 pe-10 rounded-md bg-card border border-input focus:border-ring focus:outline-none transition-colors"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute end-2 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => handleFilterChange('q', '')}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">{t('explorePage.clearSearch', 'Clear search')}</span>
              </Button>
            )}
          </div>
          
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
            <p className="text-center text-muted-foreground my-8">{
              isSearchActive ? t('explorePage.noSearchResults', 'No results found for your search.') : t('explorePage.noMoviesFound')
            }</p>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
