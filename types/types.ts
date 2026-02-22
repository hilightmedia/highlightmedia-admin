
export type Folders = {
    id: number;
    name: string;
    start_date?: string | null;
    end_date?: string | null;
  }
export type FileEdit = {
    id: number;
    name: string;
  }

export type MoveToType = {
    id: number;
    name: string;
    playOrder: number;
    length: number;
  }
export type SortBy = "lastModified" | "name" | "folderSize" | "validityPeriod" | "validityDate";
export type SortByFile = "name" | "size" | "createdAt" | "fileType";

export type SortOrder = "asc" | "desc";

export type StatusFilter = "running" | "expiring" | "completed";
export type SizeBucket = "0-10" | "10-100" | "100+";

export type FolderQueryParams = {
  lastModifiedFrom?: string | null;
  lastModifiedTo?: string | null;
  sizeBucket?: SizeBucket | null;
  status?: StatusFilter | null;
};

export type FolderParams = {
  sortBy: SortBy;
  sortOrder: SortOrder;
  search: string;
  lastModifiedFrom: string | null;
  lastModifiedTo: string | null;
  sizeBucket: SizeBucket | null;
  status: StatusFilter | null;
};

export type MediaStatus = "active" | "inactive";

export type FileParams = {
  sortBy: SortByFile;
  sortOrder: SortOrder;
  search: string;
  from: string | null;
  to: string | null;
  sizeBucket: SizeBucket | null;
  status: MediaStatus | null;
  fileType: string | null;
};
export type SortByPlaylist = "name" | "items" | "lastModified" | "duration";

export type SortByPlaylistFile = "name" | "type" | "lastModified" | "size" | "duration" | "playOrder";

export type DurationBucket = "0-3" | "5-10" | "10+";


export type FileQueryParams = {
  from?: string | null;
  to?: string | null;
  sizeBucket?: SizeBucket | null;
  status?: MediaStatus | null;
  fileType?: string | null; 
};

export type PlaylistQueryParams = {
  search?: string | null;

  sortBy?: SortByPlaylist;
  sortOrder?: SortOrder;

  lastModifiedFrom?: string | null;
  lastModifiedTo?: string | null;

  durationBucket?: DurationBucket | null;

  durationFrom?: number | null;
  durationTo?: number | null;
};

export type PlaylistParams =  {
  search?: string | null;

  sortBy?: SortByPlaylist;
  sortOrder?: SortOrder;

  lastModifiedFrom?: string | null;
  lastModifiedTo?: string | null;

  durationBucket?: DurationBucket | null;

  durationFrom?: number | null;
  durationTo?: number | null;
};
export type PlaylistFilesQueryParams = {
  sortBy?: SortByPlaylistFile;
  sortOrder?: SortOrder;
  search?: string;

  sizeBucket?: SizeBucket | null;
  type?: string | null; 
  lastModifiedFrom?: string | null;
  lastModifiedTo?: string | null;
  durationBucket?: DurationBucket | null;
};

export type Crumb = {
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
  current?: boolean;
};

export type BreadcrumbsProps = {
  items?: Crumb[];
  className?: string;
  separator?: React.ReactNode;
  showHome?: boolean;
  homeHref?: string;
  homeLabel?: React.ReactNode;
};

export type SelectOption = {
  label: string;
  value: any;
  disabled?: boolean;
};

export type PlaylistEntity = {
  id: number;
  name: string;
  defaultDuration?: number;
};

export type PlayerSortBy = "status" | "lastActive" | "duration" | "name";
export type PlayerStatus = "Online" | "Offline";

export type PlayerQueryParams = {
  search?: string | null;
  sortBy?: PlayerSortBy;
  sortOrder?: SortOrder;
  status?: PlayerStatus | null;
};

export type ActivityApiItem = {
  id: string;
  type: "ONLINE" | "OFFLINE";
  playerId: number;
  playerName: string;
  at: string;
  message: string;
};

export type FolderLogsSortBy = "lastPlayed" | "totalRunTime" | "devices" | "plays" | "name";

export type FolderLogsParams = {
  search?: string;
  sortBy?: FolderLogsSortBy;
  sortOrder?: SortOrder;
  startDate: string;
  endDate: string;
  offset?: number;
  limit?: number;
};

export type FolderLogItem = {
  folderId: number;
  folderName: string;
  thumbnail: string;
  lastPlayedAt: string | null;
  totalRunTimeSec: number;
  devices: number;
  plays: number;
};

export type FolderLogsResponse = {
  message: string;
  items: FolderLogItem[];
  pagination?: {
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
  };
};

export type FileLogsSortBy = "lastPlayed" | "totalRunTime" | "devices" | "plays" | "name";

export type FileLogsParams = {
  date?: string;
  search?: string;
  sortBy?: FileLogsSortBy;
  sortOrder?: SortOrder;
  offset?: number;
  limit?: number;
};

export type FileLogItem = {
  fileId: number;
  fileName: string;
  fileType: string;
  folderId: number;
  folderName: string;
  signedUrl: string;
  lastPlayedAt: string | null;
  totalRunTimeSec: number;
  devices: number;
  plays: number;
};

export type FileLogsResponse = {
  message: string;
  items: FileLogItem[];
  pagination: { total: number; offset: number; limit: number; hasMore: boolean };
  meta: {
    sortBy: FileLogsSortBy;
    sortOrder: SortOrder;
    search: string | null;
    date: { start: string; end: string } | null;
  };
};

export type PlaylistFilesLogsSortBy = "lastPlayed" | "totalRunTime" | "devices" | "plays" | "name";

export type PlaylistFilesLogsItem = {
  playlistFileId: number;
  playlistId: number;
  playlistName: string;
  playOrder: number;
  isSubPlaylist: boolean;
  fileId: number | null;
  fileName: string | null;
  fileType: string | null;
  signedUrl: string;
  subPlaylistId: number | null;
  subPlaylistName: string | null;
  lastPlayedAt: string | null;
  totalRunTimeSec: number;
  devices: number;
  plays: number;
};

export type PlaylistFilesLogsResponse = {
  items: PlaylistFilesLogsItem[];
  pagination: { total: number; offset: number; limit: number; hasMore: boolean };
};

export type PlaylistLogSortBy = "lastPlayed" | "totalRunTime" | "devices" | "plays" | "name";

export type PlaylistLogsParams = {
  search?: string;
  sortBy?: PlaylistLogSortBy;
  sortOrder?: SortOrder;
  date?: string;
};

export type PlaylistLogItem = {
  playlistId: number;
  playlistName: string;
  lastPlayedAt: string | null;
  totalRunTimeSec: number;
  devices: number;
  plays: number;
};

export type PlaylistLogsResponse = {
  message: string;
  items: PlaylistLogItem[];
  pagination: { total: number; offset: number; limit: number; hasMore: boolean };
};

export type PlayerLogItem = {
  id: number;
  name: string;
  sessionStart: string | null;
  sessionEnd: string | null;
  status: "Online" | "Offline";
  lastActive: string | null;
  totalRunTimeSec: number;
};

export type PlayerLogsParams = {
  search?: string;
  sortBy?: "name" | "lastActive" | "duration" | "status";
  sortOrder?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
};