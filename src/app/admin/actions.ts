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

export async function addMovie(values: z.infer<typeof FormSchema>): Promise<AddMovieResult> {
  const validation = FormSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, error: 'Invalid input.' };
  }

  const { title, description, videoUrl } = validation.data;
  
  const placeholderId = title.replace(/\s+/g, '-').toLowerCase();
  const thumbnailUrl = `https://picsum.photos/seed/${placeholderId}/500/281`;
  
  const { error } = await supabase.from('movies').insert([
    {
      title,
      description,
      genre: 'Uncategorized',
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      is_premium: false,
    },
  ]);

  if (error) {
    console.error('Supabase insert error:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/'); 

  return { success: true };
}
