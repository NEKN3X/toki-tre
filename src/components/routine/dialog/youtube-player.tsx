export function YouTubePlayer({ youtubeUrl }: { youtubeUrl: string }) {
  const videoId = youtubeUrl.match(/v=([^&]+)/)?.[1];
  const playlist = youtubeUrl.match(/list=([^&]+)/)?.[1];
  const embedUrl = playlist
    ? `https://www.youtube.com/embed/videoseries?list=${playlist}`
    : videoId
      ? `https://www.youtube.com/embed/${videoId}`
      : null;

  if (!embedUrl) {
    return (
      <div className="bg-muted text-muted-foreground flex aspect-video w-full items-center justify-center rounded-lg">
        <p>Invalid YouTube URL</p>
      </div>
    );
  }

  return (
    <iframe
      src={embedUrl}
      className="aspect-video w-full"
      allowFullScreen
    ></iframe>
  );
}
