import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date): string => {
  if (typeof date === "string") return date;
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDateTime = (input: string | Date): string => {
  const date = typeof input === "string" ? new Date(input) : input;

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  const seconds = `${date.getSeconds()}`.padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const convertHHMMtoHHMMSS = (time: string): string => {
  if (/^\d{2}:\d{2}$/.test(time)) {
    return `${time}:00`;
  }
  return time; // nếu không đúng định dạng thì giữ nguyên
};

export const formatDateVietnamese = (
  dateString: string | undefined
): string => {
  const date = new Date(dateString ? dateString : "");
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const formatTimeFe = (timeStr: string | undefined): string => {
  if (timeStr == undefined) return "";
  return timeStr.slice(0, 5);
};

export const formatMoney = (amount: number | undefined): string => {
  return amount?.toLocaleString("vi-VN") + " ₫";
};

export const equalIgnoreCase = (a: string, b: string): boolean => {
  return a.toLowerCase() === b.toLowerCase();
};

export const parseSeatCode = (raw: string | null | undefined): string => {
  if (typeof raw != "string") return "Vé đứng";
  const match = raw.match(/r(\d+)-c(\d+)/);
  if (!match) return "";

  const rowNumber = parseInt(match[1], 10); // số sau r
  const colNumber = parseInt(match[2], 10) + 1; // số sau c + 1

  const rowLetter = String.fromCharCode(65 + rowNumber); // 65 = 'A'

  return `${rowLetter}${colNumber}`;
};

export const stripTime = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};
