import { supabase } from '@/lib/supabase-client';
import type { Movie, MovieGenre } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const mapSupabaseMovieToMovie = (supabaseMovie: any): Movie => ({
  id: String(supabaseMovie.id),
  title: supabaseMovie.title,
  description: supabaseMovie.description,
  genre: supabaseMovie.genre,
  videoURL: supabaseMovie.video_url,
  thumbnailURL: supabaseMovie.thumbnail_url,
  isPremium: supabaseMovie.is_premium,
});

export const getMovies = async (): Promise<Movie[]> => {
  const { data, error } = await supabase.from('movies').select('*');
  if (error) {
    console.error('Error fetching movies:', error.message);
    return [];
  }
  return data.map(mapSupabaseMovieToMovie);
};

export const getMovieById = async (id: string): Promise<Movie | undefined> => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    console.error(`Invalid movie ID: ${id}`);
    return undefined;
  }

  const { data, error } = await supabase.from('movies').select('*').eq('id', numericId).single();

  if (error || !data) {
    if (error && error.code !== 'PGRST116') { // PGRST116: No rows found
      console.error(`Error fetching movie with id ${id}:`, error.message);
    }
    return undefined;
  }
  
  return mapSupabaseMovieToMovie(data);
};

export const getMoviesByGenre = async (): Promise<MovieGenre[]> => {
  const movies = await getMovies();
  const genres: { [key: string]: Movie[] } = {};
  
  movies.forEach(movie => {
    const genre = movie.genre || 'Uncategorized';
    if (!genres[genre]) {
      genres[genre] = [];
    }
    genres[genre].push(movie);
  });

  return Object.keys(genres).map(title => ({
    title,
    movies: genres[title],
  }));
};

export const getFeaturedMovie = async (): Promise<Movie | null> => {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('id', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    if (error && error.code !== 'PGRST116') { // PGRST116: No rows found
        console.error('Error fetching featured movie:', error.message);
    }
    return null;
  }

  return mapSupabaseMovieToMovie(data);
};

export const getHeroImage = () => PlaceHolderImages.find(p => p.id === 'hero-1');
