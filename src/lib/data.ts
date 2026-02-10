import type { Movie, MovieGenre } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getVideoUrl = () => 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

const movies: Movie[] = [
  { id: '1', title: 'Cosmic Odyssey', description: 'A journey through space and time.', genre: 'Sci-Fi', videoURL: getVideoUrl(), thumbnailURL: PlaceHolderImages.find(p => p.id === 'scifi-1')?.imageUrl || '' },
  { id: '2', title: 'The Last Stand', description: 'One man against an army.', genre: 'Action', videoURL: getVideoUrl(), thumbnailURL: PlaceHolderImages.find(p => p.id === 'action-1')?.imageUrl || '' },
  { id: '3', title: 'Laugh Riot', description: 'A hilarious series of mishaps.', genre: 'Comedy', videoURL: getVideoUrl(), thumbnailURL: PlaceHolderImages.find(p => p.id === 'comedy-1')?.imageUrl || '' },
  { id: '4', title: 'Echoes of the Past', description: 'A haunting tale of love and loss.', genre: 'Drama', videoURL: getVideoUrl(), thumbnailURL: PlaceHolderImages.find(p => p.id === 'drama-1')?.imageUrl || '' },
  { id: '5', title: 'Cybernetic Genesis', description: 'The dawn of a new machine age.', genre: 'Sci-Fi', videoURL: getVideoUrl(), thumbnailURL: PlaceHolderImages.find(p => p.id === 'scifi-2')?.imageUrl || '' },
  { id: '6', title: 'Rogue Agent', description: 'A spy betrayed by his own.', genre: 'Action', videoURL: getVideoUrl(), thumbnailURL: PlaceHolderImages.find(p => p.id === 'action-2')?.imageUrl || '' },
  { id: '7', title: 'Weekend Getaway', description: 'What could possibly go wrong?', genre: 'Comedy', videoURL: getVideoUrl(), thumbnailURL: PlaceHolderImages.find(p => p.id === 'comedy-2')?.imageUrl || '' },
  { id: '8', title: 'Future Shock', description: 'A glimpse into a dystopian future.', genre: 'Sci-Fi', videoURL: getVideoUrl(), thumbnailURL: PlaceHolderImages.find(p => p.id === 'scifi-3')?.imageUrl || '', isPremium: true },
  { id: '9', title: 'City of Shadows', description: 'A detective story in a neon-lit city.', genre: 'Drama', videoURL: getVideoUrl(), thumbnailURL: PlaceHolderImages.find(p => p.id === 'drama-2')?.imageUrl || '' },
  { id: '10', title: 'Zero Hour', description: 'A race against time to save the world.', genre: 'Action', videoURL: getVideoUrl(), thumbnailURL: PlaceHolderImages.find(p => p.id === 'action-3')?.imageUrl || '' },
  { id: '11', title: 'The Prankster', description: 'He takes his jokes too far.', genre: 'Comedy', videoURL: getVideoUrl(), thumbnailURL: PlaceHolderImages.find(p => p.id === 'comedy-3')?.imageUrl || ''},
  { id: '12', title: 'Galaxy Runners', description: 'Smugglers on the edge of the galaxy.', genre: 'Sci-Fi', videoURL: getVideoUrl(), thumbnailURL: PlaceHolderImages.find(p => p.id === 'scifi-4')?.imageUrl || '' },
  { id: '13', title: 'Final Shot', description: 'A sniper\'s last mission.', genre: 'Action', videoURL: getVideoUrl(), thumbnailURL: PlaceHolderImages.find(p => p.id === 'action-4')?.imageUrl || '', isPremium: true },
  { id: '14', title: 'The Inheritance', description: 'A family secret is revealed.', genre: 'Drama', videoURL: getVideoUrl(), thumbnailURL: PlaceHolderImages.find(p => p.id === 'drama-3')?.imageUrl || '' },
];

export const getMovies = (): Movie[] => movies;

export const getMovieById = (id: string): Movie | undefined => movies.find(movie => movie.id === id);

export const getMoviesByGenre = (): MovieGenre[] => {
  const genres: { [key: string]: Movie[] } = {};
  movies.forEach(movie => {
    if (!genres[movie.genre]) {
      genres[movie.genre] = [];
    }
    genres[movie.genre].push(movie);
  });
  return Object.keys(genres).map(title => ({
    title,
    movies: genres[title],
  }));
};

export const getFeaturedMovie = (): Movie => movies[0];

export const getHeroImage = () => PlaceHolderImages.find(p => p.id === 'hero-1');
