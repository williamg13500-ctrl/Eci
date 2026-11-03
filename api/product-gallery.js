import { db } from 'hatchable';

export const access = 'public';
export const methods = ['GET'];

export default async function (req, res) {
  const ref = String(req.query?.product_ref || '').trim().toUpperCase();
  if (!/^ECI-\d{3}$/.test(ref)) return res.status(400).json({ error: 'A valid product_ref is required.' });
  const result = await db.query(
    `SELECT g.id, p.product_ref, g.image_url, g.alt_text, g.detail_type, g.sort_order
       FROM product_gallery_images g
       JOIN products p ON p.id = g.product_id
      WHERE p.product_ref = $1 AND g.is_published = true AND p.is_archived = false
      ORDER BY g.sort_order ASC, g.id ASC`,
    [ref]
  );
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  res.json({ images: result.rows });
}