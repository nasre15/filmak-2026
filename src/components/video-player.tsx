'use client';

type VideoPlayerProps = {
  movieId: string;
};

export default function VideoPlayer({ movieId }: VideoPlayerProps) {
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
