export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string;
  videoURL: string;
  thumbnailURL: string;
  isPremium?: boolean;
}

export interface Profile {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface MovieGenre {
  title: string;
  movies: Movie[];
}
