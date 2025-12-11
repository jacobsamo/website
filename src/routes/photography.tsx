import { createFileRoute } from "@tanstack/react-router";
import { Image } from '@unpic/react'
import images from "@/lib/data"

export const Route = createFileRoute("/photography")({
  component: PhotographyPage,
});

function PhotographyPage() {
  return (
    <div className="masonry-container mt-16 columns-2 gap-2 sm:columns-3 lg:columns-5 mb-16">
      {images.map((image) => (
        <div className="mb-1 break-inside-avoid">
          <Image
            src={image.url}
            alt={image.alt}
            title={image.title}
            className="h-auto max-h-[400px] w-full max-w-[300px] rounded-lg object-cover object-center"
            decoding="async"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            width={300}
            height={400}
          />
        </div>
      ))}
    </div>
  );
}
