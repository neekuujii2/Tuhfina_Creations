import sanitizeHtml from "sanitize-html";

const SAFE_OPTIONS: Record<string, any> = {
  allowedTags: [],
  allowedAttributes: {},
  disallowedTagsMode: "discard",
};

/**
 * Strip all HTML from a free-text field to prevent stored XSS.
 */
export function sanitizeText(input: string | undefined | null): string {
  if (!input) return "";
  return sanitizeHtml(input, SAFE_OPTIONS).trim();
}

/**
 * Sanitize an object's specified text fields in-place (returns the mutated object).
 */
export function sanitizeFields<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[]
): T {
  for (const field of fields) {
    if (typeof obj[field] === "string") {
      (obj as any)[field] = sanitizeText(obj[field]);
    }
  }
  return obj;
}
