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
        sandbox="allow-forms allow-scripts allow-same-origin allow-presentation allow-top-navigation-by-user-activation"
      ></iframe>
    </div>
  );
}
