import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Client } from "pg";

const DB_CONNECTION = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/medusa_perfume";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const price_list_id = req.query.price_list_id as string;

    if (!price_list_id) {
      return res.status(400).json({ success: false, error: "price_list_id query parameter is required" });
    }

    const client = new Client({ connectionString: DB_CONNECTION });
    await client.connect();

    const query = `
      SELECT DISTINCT ON (pv.id)
        pr.id as product_id,
        pr.title as product_title,
        pv.id as variant_id,
        pv.title as variant_title,
        pv.sku,
        p_sale.amount as sale_price,
        p_base.amount as original_price,
        p_sale.currency_code
      FROM price p_sale
      JOIN product_variant_price_set pvps ON p_sale.price_set_id = pvps.price_set_id
      JOIN product_variant pv ON pvps.variant_id = pv.id
      JOIN product pr ON pv.product_id = pr.id
      LEFT JOIN price p_base ON p_base.price_set_id = pvps.price_set_id AND p_base.price_list_id IS NULL AND p_base.currency_code = p_sale.currency_code
      WHERE p_sale.price_list_id = $1 AND p_sale.rules_count = 0
      ORDER BY pv.id, pr.title ASC, pv.title ASC
    `;

    const result = await client.query(query, [price_list_id]);
    await client.end();

    const items = result.rows.map((row: any) => {
      const orig = parseFloat(row.original_price || "0");
      const sale = parseFloat(row.sale_price || "0");
      const savings = orig > sale ? orig - sale : 0;
      const percent = orig > 0 && orig > sale ? Math.round(((orig - sale) / orig) * 100) : 0;

      return {
        product_id: row.product_id,
        product_title: row.product_title,
        variant_id: row.variant_id,
        variant_title: row.variant_title,
        sku: row.sku,
        original_price: orig,
        sale_price: sale,
        savings,
        discount_percent: percent,
        currency: (row.currency_code || "inr").toUpperCase(),
      };
    });

    return res.json({ success: true, items });
  } catch (error: any) {
    console.error("Error fetching price list summary:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
