import Image from "next/image";
import { resolveImageUrl } from "@/lib/api";

interface AuthorCardProps {
  author: {
    name: string;
    credential?: string | null;
    avatar?: string | null;
  };
}

export function AuthorCard({ author }: AuthorCardProps) {
  const avatarUrl = resolveImageUrl(author.avatar);
  const initials = author.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-4 py-8 border-t border-[#E5E5E5] mt-12">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={author.name}
          width={48}
          height={48}
          className="rounded-full object-cover w-12 h-12"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white text-sm font-semibold">
          {initials}
        </div>
      )}
      <div>
        <p className="font-semibold text-[14px] text-[#1A1A1A]">
          {author.name}
        </p>
        {author.credential && (
          <p className="text-sm text-[#666]">{author.credential}</p>
        )}
      </div>
    </div>
  );
}
