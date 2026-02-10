'use client';

import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player/lazy';
import { Loader2 } from 'lucide-react';

type VideoPlayerProps = {
  videoUrl: string;
};

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  const [hasWindow, setHasWindow] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasWindow(true);
    }
  }, []);

  return (
    <div className="relative aspect-video w-full">
      {hasWindow ? (
        <ReactPlayer
          url={videoUrl}
          controls
          playing
          width="100%"
          height="100%"
          className="absolute top-0 left-0"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="sr-only">Loading player...</p>
        </div>
      )}
    </div>
  );
}
