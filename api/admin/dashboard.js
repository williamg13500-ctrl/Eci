import { db } from 'hatchable';

export const access = 'admin';
export const methods = ['GET'];

export default async function (req, res) {
  try {
    const [totals, availability, enquiries, recentProducts, recentActivity] = await Promise.all([
      db.query("SELECT COUNT(*)::int AS total_products, COUNT(*) FILTER (WHERE is_featured)::int AS featured_products FROM products WHERE is_archived = false"),
      db.query("SELECT availability_status, COUNT(*)::int AS count FROM products WHERE is_archived = false GROUP BY availability_status"),
      db.query("SELECT COUNT(*)::int AS total_enquiries, COUNT(*) FILTER (WHERE status = 'pending')::int AS pending_enquiries FROM enquiries"),
      db.query("SELECT product_ref, name, updated_at FROM products WHERE is_archived = false ORDER BY updated_at DESC LIMIT 8"),
      db.query("SELECT action, entity_type, entity_ref, actor_label, created_at FROM activity_history ORDER BY created_at DESC LIMIT 10")
    ]);
    const statusCounts = { available: 0, reserved: 0, sold: 0, unavailable: 0, unclassified: 0 };
    for (const row of availability.rows) {
      if (row.availability_status && Object.prototype.hasOwnProperty.call(statusCounts, row.availability_status)) statusCounts[row.availability_status] = row.count;
      else statusCounts.unclassified += row.count;
    }
    return res.json({
      totals: totals.rows[0],
      availability: statusCounts,
      enquiries: enquiries.rows[0],
      recently_updated_products: recentProducts.rows,
      recent_activity: recentActivity.rows
    });
  } catch (error) {
    console.error('admin_dashboard_failed', error?.message || 'unknown');
    return res.status(500).json({ error: 'Dashboard data could not be loaded.' });
  }
}