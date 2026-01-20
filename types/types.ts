
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