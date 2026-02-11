export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string;
  videoURL: string;
  thumbnailURL: string;
  isPremium?: boolean;
  backdropURL?: string;
  releaseYear?: string;
}

export interface MovieDetails extends Movie {
  voteAverage: number;
  genres: { id: number; name: string }[];
  cast: {
    id: number;
    name: string;
    character: string;
    profileURL: string;
  }[];
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
