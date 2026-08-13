import Image, { type StaticImageData } from "next/image";

export function IntroCard({
  src,
  className,
}: {
  src: StaticImageData;
  className?: string;
}) {
  return (
    <div
      className={`
        relative
        w-36
        h-36
        rounded-3xl
        overflow-hidden
        border-6
        border-white
        shadow-xl
        bg-white
        ${className}
      `}
    >
      <Image
        src={src}
        alt=""
        fill
        className="object-cover"
      />
    </div>
  );
}