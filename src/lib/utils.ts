import clsx from "clsx";
import { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const parseDateFromString = (
  string: string,
  char: string
): Date | null => {
  const [day, month, year] = string.split(char).map(Number);

  if (day && month && year) {
    const date = new Date(year, month - 1, day);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
};

export const generateRandomColor = (): string => {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);

  const color = `rgb(${red},${green},${blue})`;

  return color;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
