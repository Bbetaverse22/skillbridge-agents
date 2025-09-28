import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function assertEnv(variable: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
  return value;
}
