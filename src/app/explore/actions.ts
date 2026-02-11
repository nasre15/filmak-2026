'use server';

import type { Movie } from '@/lib/types';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const mapTmdbToMovie = (tmdbMovie: any): Movie => {
  return {
    id: String(tmdbMovie.id),
    title: tmdbMovie.title,
    description: tmdbMovie.overview,
    genre: 'N/A', // The discover endpoint doesn't return genre name directly
    videoURL: '',
    thumbnailURL: tmdbMovie.poster_path ? `${IMAGE_BASE_URL}/w500${tmdbMovie.poster_path}` : `https://picsum.photos/seed/${tmdbMovie.id}/500/281`,
    backdropURL: tmdbMovie.backdrop_path ? `${IMAGE_BASE_URL}/w1280${tmdbMovie.backdrop_path}` : `https://picsum.photos/seed/hero-${tmdbMovie.id}/1280/720`,
    isPremium: false,
    releaseYear: tmdbMovie.release_date ? tmdbMovie.release_date.substring(0, 4) : 'N/A',
  };
};

type DiscoverFilters = {
  page?: number;
  genre?: string;
  year?: string;
  rating?: number;
};

export async function discoverMovies(filters: DiscoverFilters): Promise<Movie[]> {
  if (!API_KEY) {
    console.error('TMDB API Key is missing');
    return [];
  }

  const params = new URLSearchParams({
    api_key: API_KEY,
    include_adult: 'false',
    include_video: 'false',
    language: 'en-US',
    page: String(filters.page || 1),
    sort_by: 'popularity.desc',
  });

  if (filters.genre) {
    params.append('with_genres', filters.genre);
  }
  if (filters.year) {
    params.append('primary_release_year', filters.year);
  }
  if (filters.rating && filters.rating > 0) {
    params.append('vote_average.gte', String(filters.rating));
  }

  try {
    const res = await fetch(`${API_BASE_URL}/discover/movie?${params.toString()}`);
    if (!res.ok) {
      console.error(`Error fetching from TMDB: ${res.status} ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    return data.results.map(mapTmdbToMovie);
  } catch (error) {
    console.error('Network error fetching from TMDB:', error);
    return [];
  }
}
