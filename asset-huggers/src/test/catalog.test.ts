import { describe, expect, it } from "vitest";
import { CANVASES, PIECES } from "@/data/catalog";

describe("catalog matches the original archive", () => {
  it("has 94 pieces ECI-001..ECI-094", () => {
    expect(PIECES.map((p) => p.id)).toEqual(
      Array.from({ length: 94 }, (_, i) => `ECI-${String(i + 1).padStart(3, "0")}`),
    );
  });
  it("has the original category counts", () => {
    const c = (k: string) => PIECES.filter((p) => p.category === k).length;
    expect([c("Tees"), c("Denim"), c("Outerwear"), c("Footwear"), c("Bags")]).toEqual([20, 26, 18, 13, 17]);
  });
  it("uses only original source image URLs", () => {
    for (const p of [...PIECES, ...CANVASES])
      expect(p.src.startsWith("https://asset-huggers.lovable.app/__l5e/assets-v1/")).toBe(true);
  });
});