/** Reads the simple `key = {value}` fields used in publications.json. */
export function bibtexFields(bibtex = "") {
  const fields = {};
  for (const [, key, value] of bibtex.matchAll(
    /^\s*(\w+)\s*=\s*\{(.*)\},?\s*$/gm,
  ))
    fields[key.toLowerCase()] = value.replace(/[{}]/g, "").trim();
  return fields;
}

/** "Moradzadeh, Sam and Kou, Yubo" → ["Moradzadeh, Sam", "Kou, Yubo"] */
export function bibtexAuthors(bibtex) {
  const { author } = bibtexFields(bibtex);
  return author ? author.split(/\s+and\s+/) : [];
}
