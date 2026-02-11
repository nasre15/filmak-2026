import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getMovieById } from '@/lib/data';
import VideoPlayer from '@/components/video-player';
import { Button } from '@/components/ui/button';

type WatchPageProps = {
  params: {
    id: string;
  };
};

export default async function WatchPage({ params }: WatchPageProps) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    notFound();
  }

  // We fetch movie details to ensure the movie exists before trying to play it.
  const movie = await getMovieById(numericId);

  if (!movie) {
    notFound();
  }

  const videoUrl = `https://vidsrc.to/embed/movie/${id}`;

  return (
    <div className="relative h-screen w-screen bg-black">
      <Link href="/">
        <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-10 text-white hover:text-white hover:bg-white/10">
          <ArrowLeft className="h-8 w-8" />
          <span className="sr-only">Back to browse</span>
        </Button>
      </Link>
      <VideoPlayer videoUrl={videoUrl} />
    </div>
  );
}
