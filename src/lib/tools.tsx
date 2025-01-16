export const tools = [
  {
    title: "Calcul de jours",
    url: "/calcul-de-jours",
  },
  {
    title: "Calcul de TVA",
    url: "/calcul-de-tva",
  },
];

export function useGetToolByUrl(url: string) {
  return tools.find((tool) => tool.url === url);
}

export function useCorrentPageTitle(path: string) {
  return tools.find((tool) => tool.url === path)?.title ?? "Home";
}
