type VideoPlayerProps = {
  videoUrl: string;
};

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  return (
    <div className="w-full h-full">
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
