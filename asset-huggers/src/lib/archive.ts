import type { Category, Piece } from "@/data/catalog";

export type Filter = "All" | Category;

/** Search across ECI code, title, note and category; then apply the category filter. */
export function filterPieces(pieces: Piece[], filter: Filter, query: string): Piece[] {
  const q = query.trim().toLowerCase();
  return pieces.filter(
    (p) =>
      (filter === "All" || p.category === filter) &&
      (!q || [p.id, p.title, p.note, p.category].some((v) => v.toLowerCase().includes(q))),
  );
}