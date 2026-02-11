'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';

type VideoPlayerProps = {
  movieId: string;
};

export default function VideoPlayer({ movieId }: VideoPlayerProps) {
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [server, setServer] = useState<'primary' | 'alternative'>('primary');

  const urls = useMemo(() => ({
      primary: `https://vidsrc.me/embed/movie/${movieId}`,
      alternative: `https://vidsrc.to/embed/movie/${movieId}`,
  }), [movieId]);

  const videoUrl = server === 'primary' ? urls.primary : urls.alternative;

  const handleOverlayClick = () => {
    setIsOverlayVisible(false);
  };

  const handleSwitchServer = () => {
    setServer(current => current === 'primary' ? 'alternative' : 'primary');
  };

  return (
    <div className="relative w-full h-full">
      {isOverlayVisible && (
        <div
          className="absolute inset-0 z-20 cursor-pointer bg-transparent"
          onClick={handleOverlayClick}
          aria-label="Activate player"
          role="button"
        ></div>
      )}
      <iframe
        key={videoUrl} // Use key to force re-render on URL change
        src={videoUrl}
        title="Movie Player"
        width="100%"
        height="100%"
        allowFullScreen
        referrerPolicy="no-referrer"
        className="border-0"
      ></iframe>
       <div className="absolute bottom-4 right-4 z-10">
        <Button onClick={handleSwitchServer} variant="secondary" className="bg-black/50 text-white hover:bg-black/70">
          Try {server === 'primary' ? 'Alternative' : 'Primary'} Server
        </Button>
      </div>
    </div>
  );
}
