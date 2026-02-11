import type { Movie, MovieGenre } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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

const mapTmdbMovieToMovie = (tmdbMovie: any, genres: {id: number, name: string}[] = []): Movie => {
    const getGenreName = (genreIds: number[]) => {
        if (!genres.length || !genreIds || genreIds.length === 0) return 'Uncategorized';
        const genre = genres.find(g => g.id === genreIds[0]);
        return genre ? genre.name : 'Uncategorized';
    };

    return {
        id: String(tmdbMovie.id),
        title: tmdbMovie.title,
        description: tmdbMovie.overview,
        genre: tmdbMovie.genres ? tmdbMovie.genres[0]?.name || 'Uncategorized' : getGenreName(tmdbMovie.genre_ids),
        videoURL: '', // This is constructed on the watch page using the movie ID
        thumbnailURL: tmdbMovie.poster_path ? `${IMAGE_BASE_URL}/w500${tmdbMovie.poster_path}` : `https://picsum.photos/seed/${tmdbMovie.id}/500/281`,
        backdropURL: tmdbMovie.backdrop_path ? `${IMAGE_BASE_URL}/w1280${tmdbMovie.backdrop_path}` : `https://picsum.photos/seed/hero-${tmdbMovie.id}/1280/720`,
        isPremium: false, // TMDB doesn't have this concept
    }
};

const getTmdbGenres = async (): Promise<{id: number, name: string}[]> => {
    const data = await tmdbFetch('/genre/movie/list');
    return data?.genres || [];
}

export const getMovies = async (): Promise<Movie[]> => {
  const data = await tmdbFetch('/trending/movie/week');
  if (!data?.results) return [];
  const genres = await getTmdbGenres();
  return data.results.map((movie: any) => mapTmdbMovieToMovie(movie, genres));
};

export const getMovieById = async (id: number): Promise<Movie | undefined> => {
  const movieData = await tmdbFetch(`/movie/${id}`);
  if (!movieData) return undefined;

  const movie = mapTmdbMovieToMovie(movieData);

  return movie;
};

const GENRES_TO_DISPLAY = [
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 878, name: 'Science Fiction' },
    { id: 18, name: 'Drama' },
    { id: 27, name: 'Horror' },
];

export const getMoviesByGenre = async (): Promise<MovieGenre[]> => {
    const allGenres = await getTmdbGenres();
    
    const movieGenres: MovieGenre[] = [];
    
    const genresToShow = GENRES_TO_DISPLAY.filter(gtd => allGenres.some(ag => ag.id === gtd.id));

    if (genresToShow.length === 0 && allGenres.length > 0) {
        genresToShow.push(...allGenres.slice(0, 5));
    }

    for (const genre of genresToShow) {
        const data = await tmdbFetch('/discover/movie', { with_genres: String(genre.id), sort_by: 'popularity.desc' });
        if (data?.results) {
            const movies = data.results.map((movie: any) => mapTmdbMovieToMovie(movie, allGenres));
            movieGenres.push({
                title: genre.name,
                movies: movies,
            });
        }
    }

    if (movieGenres.length === 0) {
        const trending = await getMovies();
        if (trending.length > 0) {
            return [{ title: 'Trending Now', movies: trending }];
        }
    }
    
    return movieGenres;
};

export const getFeaturedMovie = async (): Promise<Movie | null> => {
    const data = await tmdbFetch('/movie/popular');
    if (!data?.results?.[0]) {
        return null;
    }
    // Pick a random movie from the top 10 popular
    const top10 = data.results.slice(0, 10);
    const featuredTmdb = top10[Math.floor(Math.random() * top10.length)];
    
    // Fetch full details to get genres and a better backdrop
    const movieDetails = await tmdbFetch(`/movie/${featuredTmdb.id}`);
    if (!movieDetails) {
        return mapTmdbMovieToMovie(featuredTmdb);
    }
    
    return mapTmdbMovieToMovie(movieDetails);
};


export const getHeroImage = () => PlaceHolderImages.find(p => p.id === 'hero-1');
