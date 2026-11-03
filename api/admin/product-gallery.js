import { db, storage } from 'hatchable';
import crypto from 'node:crypto';

export const access = 'admin';
export const methods = ['GET', 'POST'];
const MAX_BYTES = 8 * 1024 * 1024;
const TYPES = {
  'image/jpeg': { ext: 'jpg', detail: 'jpeg' },
  'image/png': { ext: 'png', detail: 'png' },
  'image/webp': { ext: 'webp', detail: 'webp' },
};
function sniff(bytes) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'image/png';
  if (bytes.length >= 12 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  return null;
}
export default async function (req, res) {
  if (req.method === 'GET') {
    const [products, images] = await Promise.all([
      db.query('SELECT product_ref, name FROM products WHERE is_archived = false ORDER BY product_ref'),
      db.query(`SELECT g.id, p.product_ref, p.name AS product_name, g.image_url, g.alt_text, g.detail_type, g.sort_order, g.is_published, g.created_at
                  FROM product_gallery_images g JOIN products p ON p.id = g.product_id
                 ORDER BY p.product_ref, g.sort_order, g.id`)
    ]);
    return res.json({ products: products.rows, images: images.rows });
  }
  const body = req.body || {};
  if (body.action === 'publish' || body.action === 'unpublish') {
    const imageId = Number(body.image_id);
    if (!Number.isSafeInteger(imageId) || imageId < 1) return res.status(400).json({ error: 'Invalid image id.' });
    const result = await db.query('UPDATE product_gallery_images SET is_published = $1 WHERE id = $2 RETURNING id, is_published', [body.action === 'publish', imageId]);
    if (!result.rows.length) return res.status(404).json({ error: 'Gallery image not found.' });
    return res.json({ image: result.rows[0] });
  }
  const file = (req.files || []).find(f => f.field === 'file');
  if (!file) return res.status(400).json({ error: 'Choose a detail photograph to upload.' });
  if (!file.buffer || file.buffer.length > MAX_BYTES) return res.status(413).json({ error: 'Image must be 8 MB or smaller.' });
  const contentType = sniff(file.buffer);
  if (!contentType || !TYPES[contentType]) return res.status(415).json({ error: 'Use a genuine JPEG, PNG or WebP image.' });
  const productRef = String(body.product_ref || '').trim().toUpperCase();
  const altText = String(body.alt_text || '').trim();
  const detailType = String(body.detail_type || 'other').trim();
  const allowedDetails = new Set(['artwork', 'texture', 'label', 'construction', 'reverse', 'other']);
  if (!/^ECI-\d{3}$/.test(productRef)) return res.status(400).json({ error: 'Select a valid ECI product.' });
  if (altText.length < 12 || altText.length > 220) return res.status(400).json({ error: 'Describe what this actual photograph shows (12–220 characters).' });
  if (!allowedDetails.has(detailType)) return res.status(400).json({ error: 'Choose a valid detail type.' });
  const product = (await db.query('SELECT id FROM products WHERE product_ref = $1 AND is_archived = false', [productRef])).rows[0];
  if (!product) return res.status(404).json({ error: 'Product not found.' });
  const key = `product-details/${productRef.toLowerCase()}/${crypto.randomUUID()}.${TYPES[contentType].ext}`;
  await storage.put(key, file.buffer, contentType);
  const stableUrl = await storage.urlPermanent(key);
  const order = (await db.query('SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM product_gallery_images WHERE product_id = $1', [product.id])).rows[0].next_order;
  const inserted = await db.query(
    `INSERT INTO product_gallery_images (product_id, image_url, alt_text, sort_order, storage_key, detail_type, is_published, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, false, $7)
     RETURNING id, image_url, alt_text, detail_type, sort_order, is_published`,
    [product.id, stableUrl, altText, order, key, detailType, req.member?.id ? String(req.member.id) : null]
  );
  res.status(201).json({ image: inserted.rows[0], message: 'Photograph uploaded as a draft. Review it before publishing.' });
}