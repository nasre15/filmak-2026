'use server';

import { supabase } from '@/lib/supabase-client';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

const FormSchema = z.object({
  title: z.string(),
  description: z.string(),
  videoUrl: z.string().url(),
});

type AddMovieResult = {
  success: boolean;
  error?: string;
};

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export async function addMovie(values: z.infer<typeof FormSchema>): Promise<AddMovieResult> {
  const validation = FormSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, error: 'Invalid input.' };
  }

  const { title, description, videoUrl } = validation.data;
  
  if (!API_KEY) {
    return { success: false, error: 'TMDB API key is not configured.' };
  }

  // Search TMDB for the movie by title
  const searchRes = await fetch(`${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`);
  if (!searchRes.ok) {
    return { success: false, error: 'Could not search for movie on TMDB.' };
  }
  const searchData = await searchRes.json();
  const tmdbMovie = searchData.results?.[0];

  if (!tmdbMovie) {
    return { success: false, error: `Could not find a movie matching "${title}" on TMDB.` };
  }

  const tmdbId = tmdbMovie.id;

  // Get full movie details for genre
  const detailsRes = await fetch(`${API_BASE_URL}/movie/${tmdbId}?api_key=${API_KEY}`);
  if (!detailsRes.ok) {
    return { success: false, error: 'Could not fetch movie details from TMDB.' };
  }
  const movieDetails = await detailsRes.json();

  const movieToInsert = {
    tmdb_id: tmdbId,
    title: movieDetails.title || title,
    description: movieDetails.overview || description,
    genre: movieDetails.genres?.[0]?.name || 'Uncategorized',
    release_year: movieDetails.release_date ? movieDetails.release_date.substring(0, 4) : null,
    thumbnail_url: movieDetails.poster_path ? `${IMAGE_BASE_URL}/w500${movieDetails.poster_path}` : `https://picsum.photos/seed/${tmdbId}/500/281`,
    backdrop_url: movieDetails.backdrop_path ? `${IMAGE_BASE_URL}/w1280${movieDetails.backdrop_path}` : `https://picsum.photos/seed/hero-${tmdbId}/1280/720`,
    video_url: videoUrl,
    is_premium: false,
  };

  const { error } = await supabase.from('movies').insert([movieToInsert]);

  if (error) {
    console.error('Supabase insert error:', error);
    return { success: false, error: `Failed to save movie to database: ${error.message}. Make sure your 'movies' table has the following columns: tmdb_id, title, description, genre, release_year, thumbnail_url, backdrop_url, video_url, is_premium.` };
  }

  revalidatePath('/'); 

  return { success: true };
}
