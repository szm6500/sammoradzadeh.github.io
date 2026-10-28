/** Resolve local assets beneath the deployment base (including project Pages). */
export function resourceUrl(value, { email = false, image = false } = {}) {
  if (!value || typeof value !== "string") return "";
  const input = value.trim();
  if (!input) return "";
  if (image && /^data:image\/(png|jpeg|webp|gif);base64,/i.test(input))
    return input;
  if (/^[a-z][a-z\d+.-]*:/i.test(input)) {
    try {
      const url = new URL(input);
      return ["https:", "http:", ...(email ? ["mailto:"] : [])].includes(
        url.protocol,
      )
        ? url.href
        : "";
    } catch {
      return "";
    }
  }
  if (input.startsWith("//")) return "";
  const base = new URL(import.meta.env.BASE_URL, window.location.origin);
  try {
    return new URL(input.replace(/^\.?\//, ""), base).href;
  } catch {
    return "";
  }
}
