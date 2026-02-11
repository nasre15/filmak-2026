import type { Movie, MovieGenre, MovieDetails } from '@/lib/types';
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

const mapTmdbToMovie = (tmdbMovie: any, genreName: string = 'Uncategorized'): Movie => {
  return {
    id: String(tmdbMovie.id),
    title: tmdbMovie.title,
    description: tmdbMovie.overview,
    genre: genreName,
    videoURL: '',
    thumbnailURL: tmdbMovie.poster_path ? `${IMAGE_BASE_URL}/w500${tmdbMovie.poster_path}` : `https://picsum.photos/seed/${tmdbMovie.id}/500/281`,
    backdropURL: tmdbMovie.backdrop_path ? `${IMAGE_BASE_URL}/w1280${tmdbMovie.backdrop_path}` : `https://picsum.photos/seed/hero-${tmdbMovie.id}/1280/720`,
    isPremium: false,
    releaseYear: tmdbMovie.release_date ? tmdbMovie.release_date.substring(0, 4) : 'N/A',
  };
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
  if (!supabase) {
    console.log('Supabase not configured, returning empty movie list.');
    return [];
  }
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

  if (supabase) {
    const { data: movie, error } = await supabase
      .from('movies')
      .select('*')
      .eq('tmdb_id', numericId)
      .single();
    
    if (movie) {
      return mapSupabaseMovieToMovie(movie);
    }

    if (error && error.code !== 'PGRST116') { // PGRST116 = "exact one row not found"
      console.log('Movie not in Supabase, falling back to TMDB. Error:', error.message);
    }
  }

  // Fallback for when supabase is not configured or movie is not in our DB
  const tmdbMovie = await tmdbFetch(`/movie/${numericId}`);
  if (!tmdbMovie) return undefined;

  const genre = tmdbMovie.genres?.[0]?.name || 'Uncategorized';
  return mapTmdbToMovie(tmdbMovie, genre);
};

export const getMovieDetails = async (id: string): Promise<MovieDetails | null> => {
    if (id.startsWith('p-')) {
        const placeholder = placeholderMovies.find(p => p.id === id);
        if (!placeholder) return null;
        return {
            ...placeholder,
            voteAverage: 7.5,
            genres: [{id: 0, name: placeholder.genre}],
            cast: [
                { id: 1, name: 'Actor One', character: 'Main Character', profileURL: 'https://picsum.photos/seed/c1/185/278' },
                { id: 2, name: 'Actor Two', character: 'Sidekick', profileURL: 'https://picsum.photos/seed/c2/185/278' },
                { id: 3, name: 'Actor Three', character: 'Antagonist', profileURL: 'https://picsum.photos/seed/c3/185/278' },
            ]
        }
    }


  const data = await tmdbFetch(`/movie/${id}`, { append_to_response: 'credits' });

  if (!data) return null;

  return {
    id: String(data.id),
    title: data.title,
    description: data.overview,
    genre: data.genres?.[0]?.name || 'Uncategorized',
    videoURL: '',
    thumbnailURL: data.poster_path ? `${IMAGE_BASE_URL}/w500${data.poster_path}` : `https://picsum.photos/seed/p${data.id}/500/750`,
    backdropURL: data.backdrop_path ? `${IMAGE_BASE_URL}/w1280${data.backdrop_path}` : `https://picsum.photos/seed/b${data.id}/1280/720`,
    isPremium: false, 
    releaseYear: data.release_date ? data.release_date.substring(0, 4) : 'N/A',
    voteAverage: data.vote_average,
    genres: data.genres,
    cast: data.credits?.cast
      .filter((c: any) => c.profile_path)
      .slice(0, 10)
      .map((c: any) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profileURL: `${IMAGE_BASE_URL}/w185${c.profile_path}`,
      })) ?? [],
  };
};

export const GENRES_TO_DISPLAY = [
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 878, name: 'Science Fiction' },
    { id: 18, name: 'Drama' },
    { id: 27, name: 'Horror' },
];

export const getMoviesByGenre = async (): Promise<MovieGenre[]> => {
    const movieGenres: MovieGenre[] = [];
    
    for (const genre of GENRES_TO_DISPLAY) {
        const data = await tmdbFetch('/discover/movie', { with_genres: String(genre.id) });
        if (data?.results) {
            const movies = data.results.map((movie: any) => mapTmdbToMovie(movie, genre.name));
            movieGenres.push({
                title: genre.name,
                movies: movies,
            });
        }
    }

    if (movieGenres.length === 0) {
        console.log('TMDB fetch failed for all genres, using placeholder movie data.');
        const allMovies = placeholderMovies;
        const placeholderGenres: { [key: string]: Movie[] } = {};
        allMovies.forEach(movie => {
            if (!placeholderGenres[movie.genre]) {
                placeholderGenres[movie.genre] = [];
            }
            placeholderGenres[movie.genre].push(movie);
        });

        for (const genreName in placeholderGenres) {
             if (GENRES_TO_DISPLAY.some(g => g.name === genreName)) {
                movieGenres.push({
                    title: genreName,
                    movies: placeholderGenres[genreName],
                });
             }
        }
    }
    
    return movieGenres;
};

export const getFeaturedMovie = async (): Promise<Movie | null> => {
    const data = await tmdbFetch('/movie/popular');
    if (data?.results?.length > 0) {
        const featured = data.results[Math.floor(Math.random() * Math.min(data.results.length, 10))];
        
        const movieDetails = await tmdbFetch(`/movie/${featured.id}`);
        if (!movieDetails) return mapTmdbToMovie(featured);

        const genre = movieDetails.genres?.[0]?.name || 'Uncategorized';
        return mapTmdbToMovie(movieDetails, genre);
    }
    
    console.log('Using placeholder for featured movie.');
    const featured = placeholderMovies[Math.floor(Math.random() * placeholderMovies.length)];
    const details = await getMovieDetails(featured.id);
    return details ? details : featured;
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
