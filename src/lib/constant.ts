import { SelectOption } from "@/types/types";
import {
  PlayCircle,
  Bell,
  Settings,
  Trash2,
} from "lucide-react";
import { MediaOutlined, PlaylistOutlined, PlayLogsOutlined,DashBoardOutlined } from "../components/common/icon";


export const BACKEND_URI: string | undefined =
  process.env.NEXT_PUBLIC_BACKEND_URI;

export const menu = [
  { name: "Dashboard", path: "/dashboard", icon: DashBoardOutlined },
  { name: "Media", path: "/media", icon: MediaOutlined },
  { name: "Playlist", path: "/playlist", icon: PlaylistOutlined },

  {
    name: "Play Logs",
    path: "/play-logs/media",
    icon: PlayLogsOutlined,
    children: [
      { name: "Media Logs", path: "/play-logs/media" },
      { name: "Playlist Logs", path: "/play-logs/playlist" },
      { name: "Player Logs", path: "/play-logs/player" },
      { name: "Client Logs", path: "/play-logs/client" },
    ],
  },

  { name: "Players", path: "/players", icon: PlayCircle },
  { name: "Notifications", path: "/notifications", icon: Bell },
  { name: "Settings", path: "/settings", icon: Settings },
  { name: "Trash", path: "/trash", icon: Trash2 },
];

export const topMenu = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Media", path: "/media" },
  { name: "Playlist", path: "/playlist" },

  {
    name: "Play Logs",
    path: "/play-logs/media",
  },

  { name: "Players", path: "/players" },
];

export const FoldersSortOptions: SelectOption[] = [
  { label: "Last Modified (newest)", value: "lastModified:desc" },
  { label: "Last Modified (oldest)", value: "lastModified:asc" },

  { label: "Name (A-Z)", value: "name:asc" },
  { label: "Name (Z-A)", value: "name:desc" },

  { label: "Folder Size (biggest)", value: "folderSize:desc" },
  { label: "Folder Size (smallest)", value: "folderSize:asc" },

  { label: "Validity Period (longest)", value: "validityPeriod:desc" },
  { label: "Validity Period (shortest)", value: "validityPeriod:asc" },

  { label: "Validity Date (earliest end)", value: "validityDate:asc" },
  { label: "Validity Date (latest end)", value: "validityDate:desc" },
];

export const FolderBulkActions = [
  { label: "Bulk Actions", value: "" },
  { label: "Delete", value: "delete" },
  { label: "Edit Validiy", value: "edit" },
];

export const FileBulkActions = [
  { label: "Bulk Actions", value: "" },
  { label: "Delete", value: "delete" },
  { label: "Add to Playlist", value: "add" },
];

export const FilesSortOptions: SelectOption[] = [
  { label: "Created (newest)", value: "createdAt:desc" },
  { label: "Created (oldest)", value: "createdAt:asc" },

  { label: "Name (A-Z)", value: "name:asc" },
  { label: "Name (Z-A)", value: "name:desc" },

  { label: "Size (biggest)", value: "size:desc" },
  { label: "Size (smallest)", value: "size:asc" },

  { label: "File Type (A-Z)", value: "fileType:asc" },
  { label: "File Type (Z-A)", value: "fileType:desc" },
];

export const PlaylistFilesSortOptions: SelectOption[] = [
  { label: "Play Order (Desc)", value: "playOrder:desc" },
  { label: "Play Order (Asc)", value: "playOrder:asc" },
  { label: "Last Modified (newest)", value: "lastModified:desc" },
  { label: "Last Modified (oldest)", value: "lastModified:asc" },

  { label: "Name (A-Z)", value: "name:asc" },
  { label: "Name (Z-A)", value: "name:desc" },

  { label: "Size (biggest)", value: "size:desc" },
  { label: "Size (smallest)", value: "size:asc" },

  { label: "Type (A-Z)", value: "type:asc" },
  { label: "Type (Z-A)", value: "type:desc" },

  { label: "Duration (longest)", value: "duration:desc" },
  { label: "Duration (shortest)", value: "duration:asc" },
];

export const PlaylistSortOptions: SelectOption[] = [
  { label: "Last Modified (Newest)", value: "lastModified:desc" },
  { label: "Last Modified (Oldest)", value: "lastModified:asc" },
  { label: "Name (A-Z)", value: "name:asc" },
  { label: "Name (Z-A)", value: "name:desc" },
  { label: "Items (High-Low)", value: "items:desc" },
  { label: "Items (Low-High)", value: "items:asc" },
  { label: "Duration (High-Low)", value: "duration:desc" },
  { label: "Duration (Low-High)", value: "duration:asc" },
];