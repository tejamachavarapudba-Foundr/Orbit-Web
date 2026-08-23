const gradients = [
  "from-sky-400 to-indigo-500",
  "from-amber-400 to-red-500",
  "from-emerald-400 to-sky-500",
  "from-fuchsia-400 to-pink-500",
  "from-violet-400 to-purple-500"
];

export const gradientFor = (seed: string) => gradients[(seed || "?").charCodeAt(0) % gradients.length];

type AvatarProps = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  size?: string;
  textSize?: string;
  className?: string;
};

export const Avatar = ({ id, name, avatarUrl, size = "h-10 w-10", textSize = "text-sm", className = "" }: AvatarProps) => {
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={avatarUrl} alt={name || ""} className={`${size} flex-shrink-0 rounded-full object-cover ${className}`} />
    );
  }

  return (
    <div
      className={`flex ${size} flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-display ${textSize} font-bold text-white ${gradientFor(id)} ${className}`}
    >
      {(name || "?").charAt(0).toUpperCase()}
    </div>
  );
};
