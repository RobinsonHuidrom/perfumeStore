import { NextResponse } from "next/server";
import { Client } from "pg";

const DB_CONNECTION = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/medusa_perfume";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address } = body;

    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const parts = (name || "").trim().split(" ");
    const firstName = parts[0] || "Atelier";
    const lastName = parts.slice(1).join(" ") || "Client";
    const cleanPhone = (phone || "").trim();
    const cleanAddress = (address || "").trim();

    const client = new Client({ connectionString: DB_CONNECTION });
    await client.connect();

    const existing = await client.query("SELECT id FROM customer WHERE email = $1", [cleanEmail]);

    let customerId: string;
    if (existing.rows.length > 0) {
      customerId = String(existing.rows[0].id);
      await client.query(`
        UPDATE customer
        SET first_name = $1, last_name = $2, phone = $3, has_account = true, metadata = $4, updated_at = NOW()
        WHERE id = $5
      `, [firstName, lastName, cleanPhone, JSON.stringify({ address: cleanAddress }), customerId]);
    } else {
      customerId = `cus_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      await client.query(`
        INSERT INTO customer (id, first_name, last_name, email, phone, has_account, metadata, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, true, $6, NOW(), NOW())
      `, [customerId, firstName, lastName, cleanEmail, cleanPhone, JSON.stringify({ address: cleanAddress })]);
    }

    // Ensure auth_identity & provider_identity exist so Medusa Admin identifies as "Registered" and deletes cleanly
    const existingAuth = await client.query(`
      SELECT * FROM auth_identity 
      WHERE app_metadata->>'customer_id' = $1
    `, [customerId]);

    if (existingAuth.rows.length === 0) {
      const authId = `authid_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const provId = `provid_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      await client.query(`
        INSERT INTO auth_identity (id, app_metadata, created_at, updated_at)
        VALUES ($1, $2, NOW(), NOW())
      `, [authId, JSON.stringify({ customer_id: customerId })]);

      await client.query(`
        INSERT INTO provider_identity (id, entity_id, provider, auth_identity_id, created_at, updated_at)
        VALUES ($1, $2, 'emailpass', $3, NOW(), NOW())
      `, [provId, cleanEmail, authId]);
    }

    await client.end();

    return NextResponse.json({
      success: true,
      customerId,
      message: "Customer registered with Auth Identity in Medusa database",
    });
  } catch (error: unknown) {
    console.error("Error registering customer in Medusa:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
