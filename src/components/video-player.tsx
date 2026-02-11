'use client';

type VideoPlayerProps = {
  movieId: string;
};

export default function VideoPlayer({ movieId }: VideoPlayerProps) {
  if (movieId.startsWith('p-')) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Placeholder Movie</h2>
          <p className="text-muted-foreground mt-2">
            This movie is for demonstration purposes and cannot be played.
          </p>
        </div>
      </div>
    );
  }
  
  const videoUrl = `https://vidsrc.icu/embed/movie/${movieId}`;

  return (
    <div className="relative w-full h-full">
      <iframe
        src={videoUrl}
        title="Movie Player"
        width="100%"
        height="100%"
        allowFullScreen
        referrerPolicy="origin"
        className="border-0"
      ></iframe>
    </div>
  );
}
