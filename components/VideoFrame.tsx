import { Play } from "lucide-react";

// Full-width 16:9 video frame: dashed placeholder when there is no URL, a native
// <video> for .mp4 paths, or a responsive iframe for YouTube / Vimeo / Loom links.
// Same logic and look as the Dolby "See it in action" video.

function toEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vi = url.match(/vimeo\.com\/(\d+)/);
  if (vi) return `https://player.vimeo.com/video/${vi[1]}`;
  const lo = url.match(/loom\.com\/share\/([a-f0-9]+)/);
  if (lo) return `https://www.loom.com/embed/${lo[1]}`;
  return null;
}

export default function VideoFrame({
  videoUrl,
  poster,
  placeholderLabel,
  title,
}: {
  videoUrl?: string;
  poster?: string;
  placeholderLabel: string;
  title: string; // accessible label / iframe title
}) {
  const isMp4 = !!videoUrl && videoUrl.endsWith(".mp4");
  const embed = videoUrl && !isMp4 ? toEmbedUrl(videoUrl) : null;
  const showPlaceholder = !videoUrl || (!isMp4 && !embed);

  return (
    <div
      className="aspect-video w-full"
      role={showPlaceholder ? "img" : undefined}
      aria-label={showPlaceholder ? title : undefined}
      style={{
        border: showPlaceholder ? "1px dashed #bbb" : "none",
        background: showPlaceholder ? "#f9f9f7" : "#000",
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      {showPlaceholder ? (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Play aria-hidden="true" size={40} strokeWidth={1.5} color="#374151" />
          <span className="font-mono text-xs text-gray-400">{placeholderLabel}</span>
        </div>
      ) : isMp4 ? (
        <video
          controls
          playsInline
          preload="metadata"
          aria-label={title}
          src={videoUrl}
          poster={poster || undefined}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      ) : (
        <iframe
          src={embed!}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        />
      )}
    </div>
  );
}
