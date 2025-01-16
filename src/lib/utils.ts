import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const tools = [
  { name: "Calcul de jours", url: "/calcul-de-jours" },
  { name: "Calcul de TVA", url: "/calcul-de-tva" },
];

export function getToolByUrl(url: string) {
  return tools.find((tool) => tool.url === url);
}

export function currentPageTitle(path: string) {
  return tools.find((tool) => tool.url === path)?.name ?? "Home";
}
