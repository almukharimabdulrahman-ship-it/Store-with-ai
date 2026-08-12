const MAX_SLUG_SUFFIX = 10_000;

/**
 * Create a URL segment without discarding non-Latin names.
 *
 * Unicode letters and numbers are intentionally preserved so Arabic product,
 * category, and brand names produce readable, valid storefront URLs.
 */
export function slugify(value: string, fallback = "item") {
  const slug = value
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  return slug || fallback;
}

export async function createUniqueSlug(
  value: string,
  exists: (slug: string) => Promise<boolean>,
  fallback = "item",
) {
  const base = slugify(value, fallback);

  if (!(await exists(base))) return base;

  for (let suffix = 2; suffix <= MAX_SLUG_SUFFIX; suffix += 1) {
    const candidate = `${base}-${suffix}`;
    if (!(await exists(candidate))) return candidate;
  }

  throw new Error("Unable to generate a unique slug");
}
