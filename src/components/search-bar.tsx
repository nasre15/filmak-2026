'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { searchMovies } from '@/lib/data';
import type { Movie } from '@/lib/types';
import { useDebounce } from '@/hooks/use-debounce';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery) {
        const movies = await searchMovies(debouncedQuery);
        setResults(movies);
        setIsOpen(movies.length > 0);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    };
    fetchResults();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleResultClick = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-xs md:max-w-sm" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50 pointer-events-none" />
        <input
          type="text"
          placeholder="Search for movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          className="w-full h-10 pl-10 pr-4 rounded-md bg-black/50 border border-transparent focus:bg-black/70 focus:border-ring focus:outline-none transition-all text-sm"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full md:w-96 max-h-[70vh] overflow-y-auto rounded-md bg-card border border-border shadow-lg z-50 scrollbar-hide">
          <ul>
            {results.map((movie) => (
              <li key={movie.id}>
                <Link href={`/movie/${movie.id}`} onClick={handleResultClick} className="flex items-center gap-4 p-3 hover:bg-accent transition-colors">
                  <div className="relative w-16 h-24 flex-shrink-0 bg-muted rounded-sm">
                    {movie.thumbnailURL && (
                       <Image
                        src={movie.thumbnailURL}
                        alt={movie.title}
                        fill
                        className="object-cover rounded-sm"
                      />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold truncate">{movie.title}</p>
                    <p className="text-sm text-muted-foreground">{movie.releaseYear}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
