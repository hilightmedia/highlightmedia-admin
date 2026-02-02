import Image from "next/image";
import React from "react";
import {
  Folder as FolderIcon,
  ListVideo,
  Image as ImageIcon,
  ListMusic,
  File as FileIcon,
  Video,
  Music,
  FileText,
} from "lucide-react";

type ThumbType = "folder" | "subPlaylist" | "file" | "playlist";

type Props = {
  thumbnail?: string | null;
  alt: string;
  type: ThumbType;
  fileType?: string | null;
  className?: string;
  width?: number;
  height?: number;
  iconClassName?: string;
  containerClassName?: string;
};

export function RenderThumbnail({
  thumbnail,
  alt,
  type,
  fileType,
  className = "rounded-lg h-[50px] w-[70px] object-cover",
  width = 500,
  height = 500,
  iconClassName = "w-5 h-5",
  containerClassName = "bg-gray-200 rounded-lg h-[50px] w-[70px] flex items-center justify-center text-gray-500",
}: Props) {
  if (thumbnail) {
    return (
      <Image
        src={thumbnail}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  const pickFileIcon = (ft?: string | null) => {
    const v = (ft || "").toLowerCase();
    if (v.startsWith("video/") || v === "video") return Video;
    if (v.startsWith("audio/") || v === "audio") return Music;
    if (v.startsWith("image/") || v === "image") return ImageIcon;
    if (v.startsWith("application/pdf") || v.includes("pdf")) return FileText;
    return FileIcon;
  };

  const Icon =
    type === "folder"
      ? FolderIcon
      : type === "subPlaylist"
      ? ListVideo
      : type === "playlist"
      ? ListMusic
      : pickFileIcon(fileType);

  return (
    <div className={containerClassName} aria-label={alt} title={alt}>
      <Icon className={iconClassName} />
    </div>
  );
}
