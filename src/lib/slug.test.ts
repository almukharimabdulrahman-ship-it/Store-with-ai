import assert from "node:assert/strict";
import test from "node:test";
import { createUniqueSlug, slugify } from "./slug";

test("slugify preserves Arabic letters", () => {
  assert.equal(slugify("  فساتين نسائية  "), "فساتين-نسائية");
});

test("slugify normalizes punctuation and Latin case", () => {
  assert.equal(slugify("Chérie Boutique — Sale"), "chérie-boutique-sale");
});

test("slugify uses a safe fallback when no letters or numbers exist", () => {
  assert.equal(slugify("— ❤️ —", "product"), "product");
});

test("createUniqueSlug adds the first available numeric suffix", async () => {
  const existing = new Set(["فساتين-نسائية", "فساتين-نسائية-2"]);
  const slug = await createUniqueSlug(
    "فساتين نسائية",
    async (candidate) => existing.has(candidate),
  );

  assert.equal(slug, "فساتين-نسائية-3");
});
