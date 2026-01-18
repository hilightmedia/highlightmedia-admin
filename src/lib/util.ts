import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  clearStorageLocal,
  getAccessTokenLocal,
  getRefreshTokenLocal,
} from "../helpers/localStorage";
import {
  clearStorageSession,
  getAccessTokenSession,
  getRefreshTokenSession,
} from "../helpers/sessionStorage";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAccessToken() {
  return getAccessTokenLocal() || getAccessTokenSession();
}

export function getRefreshToken() {
  return getRefreshTokenLocal() || getRefreshTokenSession();
}

export const clearStorage = () => {
  clearStorageLocal();
  clearStorageSession();
};

export function formatSeconds(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [hrs, mins, secs].map((v) => String(v).padStart(2, "0")).join(":");
}

export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
};

export const formatTime = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", options);
};

const DAY_MS = 24 * 60 * 60 * 1000;

export const parseMaybeDate = (v?: string | null) => {
  if (!v) return null;
  // supports YYYY-MM-DD and ISO
  const d = v.includes("T") ? new Date(v) : new Date(`${v}T00:00:00.000Z`);
  return isNaN(d.getTime()) ? null : d;
};

export function toYMD(v?: string | null) {
  if (!v) return "";
  // if ISO => YYYY-MM-DD
  if (v.includes("T")) return v.split("T")[0];
  return v; // already YYYY-MM-DD
}


export const isRangeSelected = (
  days?: number,
  months?: number,
  draft: any = {}
) => {
  const from = parseMaybeDate(draft.lastModifiedFrom);
  const to = parseMaybeDate(draft.lastModifiedTo);
  if (!from || !to) return false;

  const now = new Date();

  // to should be "around now" (within 1 day tolerance)
  const toDiff = Math.abs(to.getTime() - now.getTime());
  if (toDiff > DAY_MS) return false;

  const expectedFrom = new Date(now);
  if (typeof days === "number")
    expectedFrom.setDate(expectedFrom.getDate() - days);
  if (typeof months === "number")
    expectedFrom.setMonth(expectedFrom.getMonth() - months);

  // allow 1 day tolerance due to timezones / midnight rounding
  const fromDiff = Math.abs(from.getTime() - expectedFrom.getTime());
  return fromDiff <= DAY_MS;
};
