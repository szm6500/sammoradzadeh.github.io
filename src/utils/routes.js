import copy from "../data/copy.json";

export const tabIds = copy.tabs.map((tab) => tab.id);

export function tabPath(id) {
  const base = import.meta.env.BASE_URL;
  return id === "home" ? base : `${base}${id}/`;
}

export function paperPath(id) {
  return `${import.meta.env.BASE_URL}publications/${id}/`;
}

/** The tab a pathname belongs to, or null when it is some other page. */
export function tabFromPath(pathname) {
  const base = import.meta.env.BASE_URL;
  if (`${pathname}/` === base) return "home";
  if (!pathname.startsWith(base)) return null;
  const id = pathname
    .slice(base.length)
    .replace(/(^|\/)index\.html$/, "")
    .replace(/\/$/, "");
  if (id === "") return "home";
  return tabIds.includes(id) ? id : null;
}

/** The publication id for a /publications/<id>/ path, or null. */
export function paperFromPath(pathname) {
  const prefix = `${import.meta.env.BASE_URL}publications/`;
  if (!pathname.startsWith(prefix)) return null;
  return pathname.slice(prefix.length).replace(/\/(index\.html)?$/, "") || null;
}
