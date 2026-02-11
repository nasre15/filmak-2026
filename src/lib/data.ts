import type { Movie, MovieGenre } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { supabase } from './supabase-client';
import { placeholderMovies } from './placeholder-movies';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const tmdbFetch = async (path: string, params: Record<string, string> = {}) => {
  if (!API_KEY) {
    console.error('TMDB API Key is missing');
    return null;
  }
  const url = new URL(`${API_BASE_URL}${path}`);
  url.searchParams.append('api_key', API_KEY);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }
  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      console.error(`Error fetching from TMDB: ${res.status} ${res.statusText}`);
      const errorBody = await res.text();
      console.error('Error body:', errorBody);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error('Network error fetching from TMDB:', error);
    return null;
  }
};

const mapSupabaseMovieToMovie = (supabaseMovie: any): Movie => {
    return {
        id: String(supabaseMovie.tmdb_id),
        title: supabaseMovie.title,
        description: supabaseMovie.description,
        genre: supabaseMovie.genre,
        videoURL: supabaseMovie.video_url,
        thumbnailURL: supabaseMovie.thumbnail_url,
        backdropURL: supabaseMovie.backdrop_url,
        isPremium: supabaseMovie.is_premium,
        releaseYear: supabaseMovie.release_year,
    };
};

export const getMovies = async (): Promise<Movie[]> => {
  const { data: movies, error } = await supabase.from('movies').select('*');
  if (error) {
    console.error('Supabase getMovies error:', error);
    return [];
  }
  return movies ? movies.map(mapSupabaseMovieToMovie) : [];
};

export const getMovieById = async (id: string): Promise<Movie | undefined> => {
  if (id.startsWith('p-')) {
    return placeholderMovies.find(p => p.id === id);
  }

  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    return undefined;
  }

  const { data: movie, error } = await supabase
    .from('movies')
    .select('*')
    .eq('tmdb_id', numericId)
    .single();

  if (error || !movie) {
    if (error) console.error('Supabase getMovieById error:', error.message);
    // Fallback to TMDB if not in our DB
    const tmdbMovie = await tmdbFetch(`/movie/${numericId}`);
    if (!tmdbMovie) return undefined;

    const movieDetails = await tmdbFetch(`/movie/${tmdbMovie.id}`);
    if (!movieDetails) return undefined;
    const genre = movieDetails.genres?.[0]?.name || 'Uncategorized';

    return {
        id: String(tmdbMovie.id),
        title: tmdbMovie.title,
        description: tmdbMovie.overview,
        genre: genre,
        videoURL: '',
        thumbnailURL: tmdbMovie.poster_path ? `${IMAGE_BASE_URL}/w500${tmdbMovie.poster_path}` : `https://picsum.photos/seed/${tmdbMovie.id}/500/281`,
        backdropURL: tmdbMovie.backdrop_path ? `${IMAGE_BASE_URL}/w1280${tmdbMovie.backdrop_path}` : `https://picsum.photos/seed/hero-${tmdbMovie.id}/1280/720`,
        isPremium: false,
        releaseYear: tmdbMovie.release_date ? tmdbMovie.release_date.substring(0, 4) : undefined,
    }
  }

  return mapSupabaseMovieToMovie(movie);
};

const GENRES_TO_DISPLAY = [
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 878, name: 'Science Fiction' },
    { id: 18, name: 'Drama' },
    { id: 27, name: 'Horror' },
];

export const getMoviesByGenre = async (): Promise<MovieGenre[]> => {
    const { data: supabaseMovies, error } = await supabase.from('movies').select('*');
    
    let allMovies: Movie[] = [];

    // Use placeholders if there are fewer than 10 movies in the database.
    if (error || !supabaseMovies || supabaseMovies.length < 10) {
        if(error) console.error('Supabase getMoviesByGenre error:', error);
        console.log('Supabase movie count is low, using placeholder movie data.');
        allMovies = placeholderMovies;
    } else {
        console.log('Using Supabase movie data.');
        allMovies = supabaseMovies.map(mapSupabaseMovieToMovie);
    }
    
    const movieGenres: MovieGenre[] = [];
    
    for (const genre of GENRES_TO_DISPLAY) {
        const genreMovies = allMovies.filter(m => m.genre === genre.name);
        
        if (genreMovies.length > 0) {
            movieGenres.push({
                title: genre.name,
                movies: genreMovies,
            });
        }
    }

    if (movieGenres.length === 0 && allMovies.length > 0) {
        return [{ title: 'All Movies', movies: allMovies }];
    }
    
    return movieGenres;
};

export const getFeaturedMovie = async (): Promise<Movie | null> => {
    const { data: movies, error } = await supabase.from('movies').select('*');
    if (error || !movies || movies.length === 0) {
      if (error) console.error('Supabase getFeaturedMovie error:', error);
      console.log('Using placeholder for featured movie.');
      return placeholderMovies[Math.floor(Math.random() * placeholderMovies.length)];
    }
    
    const featured = movies[Math.floor(Math.random() * movies.length)];
    return mapSupabaseMovieToMovie(featured);
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query) return [];
  const data = await tmdbFetch('/search/movie', { query });
  if (!data?.results) return [];
  
  const mapTmdbSearchToMovie = (tmdbMovie: any): Movie => {
    return {
        id: String(tmdbMovie.id),
        title: tmdbMovie.title,
        description: tmdbMovie.overview,
        genre: 'N/A',
        videoURL: '',
        thumbnailURL: tmdbMovie.poster_path ? `${IMAGE_BASE_URL}/w92${tmdbMovie.poster_path}` : `https://picsum.photos/seed/p${tmdbMovie.id}/92/138`,
        backdropURL: tmdbMovie.backdrop_path ? `${IMAGE_BASE_URL}/w1280${tmdbMovie.backdrop_path}` : `https://picsum.photos/seed/b${tmdbMovie.id}/1280/720`,
        releaseYear: tmdbMovie.release_date ? tmdbMovie.release_date.substring(0, 4) : 'N/A',
        isPremium: false,
    }
  };

  return data.results.slice(0, 7).map(mapTmdbSearchToMovie);
};

export const getHeroImage = () => PlaceHolderImages.find(p => p.id === 'hero-1');
