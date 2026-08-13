import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Client } from "pg";

export const AUTHENTICATE = false;

const DB_CONNECTION =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/medusa_perfume";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const variantIdsParam = req.query.variant_ids as string;

    if (!variantIdsParam) {
      return res
        .status(400)
        .json({ success: false, error: "variant_ids query parameter is required" });
    }

    const variantIds = variantIdsParam.split(",").map((id) => id.trim());

    if (variantIds.length === 0) {
      return res.json({ success: true, prices: {}, region_id: null });
    }

    const client = new Client({ connectionString: DB_CONNECTION });
    await client.connect();

    // Query base prices: these are the prices linked to the "Original Base Price" region
    // (price_list_id IS NULL, with a region_id rule pointing to "Original Base Price")
    const query = `
      SELECT
        pv.id AS variant_id,
        p.amount,
        p.currency_code
      FROM price p
      JOIN product_variant_price_set pvps ON p.price_set_id = pvps.price_set_id
      JOIN product_variant pv ON pvps.variant_id = pv.id
      JOIN price_rule prl ON prl.price_id = p.id
      WHERE p.price_list_id IS NULL
        AND prl.attribute = 'region_id'
        AND prl.value = 'reg_original_base_price_01'
        AND pv.id = ANY($1)
    `;

    const result = await client.query(query, [variantIds]);
    await client.end();

    const prices: Record<string, { amount: number; currency_code: string }> = {};

    for (const row of result.rows) {
      prices[row.variant_id] = {
        amount: parseFloat(row.amount),
        currency_code: row.currency_code,
      };
    }

    return res.json({
      success: true,
      prices,
      region_id: "reg_original_base_price_01",
    });
  } catch (error: any) {
    console.error("Error fetching variant base prices:", error);
    return res
      .status(500)
      .json({ success: false, error: error.message });
  }
}
