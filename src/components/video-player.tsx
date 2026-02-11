'use client';

import { useState } from 'react';

type VideoPlayerProps = {
  videoUrl: string;
};

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);

  const handleOverlayClick = () => {
    setIsOverlayVisible(false);
  };

  return (
    <div className="relative w-full h-full">
      {isOverlayVisible && (
        <div
          className="absolute inset-0 z-10 cursor-pointer bg-transparent"
          onClick={handleOverlayClick}
          aria-label="Activate player"
          role="button"
        ></div>
      )}
      <iframe
        src={videoUrl}
        title="Movie Player"
        width="100%"
        height="100%"
        allowFullScreen
        className="border-0"
      ></iframe>
    </div>
  );
}
