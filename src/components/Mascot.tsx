import { mascotSvg, type MascotFace, type MascotPose } from "@/lib/mascot";

/** Zukko the cat. Size it with a width class, e.g. className="w-40". */
export function Mascot({
  pose = "lie",
  face = "proud",
  hat = false,
  animate = false,
  className = "",
}: {
  pose?: MascotPose;
  face?: MascotFace;
  hat?: boolean;
  animate?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 [&>svg]:block [&>svg]:h-auto [&>svg]:w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: mascotSvg({ pose, face, hat, animate }) }}
    />
  );
}
