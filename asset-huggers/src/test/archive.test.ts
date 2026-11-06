import { describe, expect, it } from "vitest";
import { PIECES } from "@/data/catalog";
import { filterPieces } from "@/lib/archive";

describe("archive search", () => {
  it("finds a piece by exact ECI code", () => {
    expect(filterPieces(PIECES, "All", "ECI-042").map((p) => p.id)).toEqual(["ECI-042"]);
  });
  it("matches category name as a search term", () => {
    expect(filterPieces(PIECES, "All", "footwear").length).toBe(13);
  });
  it("combines search with category filter", () => {
    const r = filterPieces(PIECES, "Denim", "portrait");
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => p.category === "Denim")).toBe(true);
  });
  it("empty query returns full category", () => {
    expect(filterPieces(PIECES, "Bags", "  ").length).toBe(17);
  });
});