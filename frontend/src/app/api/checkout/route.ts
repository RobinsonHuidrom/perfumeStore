import { NextResponse } from "next/server";
import { Client } from "pg";

const DB_CONNECTION = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/medusa_perfume";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, address, city, country, postalCode, totalAmount, cart } = body;

    const client = new Client({ connectionString: DB_CONNECTION });
    await client.connect();

    const cleanEmail = (email || "guest@maison.com").trim().toLowerCase();
    const cleanPhone = (phone || "+91 98765 43210").trim();
    const cleanAddress = (address || "75008 Place Vendôme").trim();
    const cleanCity = (city || "Paris").trim();
    const cleanCountry = (country || "in").toLowerCase().trim();
    const cleanPostal = (postalCode || "75008").trim();

    // 1. Get or create customer in Medusa customer table
    const existingCustomer = await client.query("SELECT id FROM customer WHERE email = $1", [cleanEmail]);

    let customerId: string;
    if (existingCustomer.rows.length > 0) {
      customerId = String(existingCustomer.rows[0].id);
      await client.query(`
        UPDATE customer
        SET first_name = $1, last_name = $2, phone = $3, updated_at = NOW()
        WHERE id = $4
      `, [firstName || "Atelier", lastName || "Client", cleanPhone, customerId]);
    } else {
      customerId = `cus_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      await client.query(`
        INSERT INTO customer (id, first_name, last_name, email, phone, has_account, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, false, NOW(), NOW())
      `, [customerId, firstName || "Atelier", lastName || "Client", cleanEmail, cleanPhone]);
    }

    // 2. Create order_address record
    const addressId = `ordaddr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    await client.query(`
      INSERT INTO order_address (id, customer_id, first_name, last_name, address_1, city, country_code, postal_code, phone, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
    `, [addressId, customerId, firstName || "Atelier", lastName || "Client", cleanAddress, cleanCity, cleanCountry, cleanPostal, cleanPhone]);

    // 3. Get highest display_id for order
    const maxDisplayIdRes = await client.query('SELECT COALESCE(MAX(display_id), 1000) + 1 as next_id FROM "order"');
    const nextDisplayId = parseInt(String(maxDisplayIdRes.rows[0].next_id), 10);

    const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const regionId = "reg_original_base_price_01";
    const salesChannelId = "sc_01KYH97MQCWFP7NYBE0VFPXKEY";

    // 4. Insert into order table
    await client.query(`
      INSERT INTO "order" (id, region_id, display_id, customer_id, version, sales_channel_id, status, email, currency_code, shipping_address_id, billing_address_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, 1, $5, 'pending', $6, 'inr', $7, $8, NOW(), NOW())
    `, [orderId, regionId, nextDisplayId, customerId, salesChannelId, cleanEmail, addressId, addressId]);

    // 5. Insert cart items into order_line_item and order_item
    let calculatedSubtotal = 0;
    const itemsList = Array.isArray(cart) && cart.length > 0 ? cart : [
      {
        product: { title: "Noir Élégance", handle: "noir-elegance", images: [{ url: "http://localhost:9000/static/perfume_1.png" }] },
        selectedSize: "50ml",
        unitPrice: totalAmount || 145,
        quantity: 1
      }
    ];

    for (let i = 0; i < itemsList.length; i++) {
      const cartItem = itemsList[i];
      const itemTitle = cartItem.product?.title || "Extrait de Parfum";
      const itemSubtitle = cartItem.selectedSize || "50ml";
      const itemPrice = typeof cartItem.unitPrice === "number" ? cartItem.unitPrice : 145;
      const itemQty = typeof cartItem.quantity === "number" ? cartItem.quantity : 1;
      const itemThumb = cartItem.product?.images?.[0]?.url || "http://localhost:9000/static/perfume_1.png";

      calculatedSubtotal += itemPrice * itemQty;

      const lineItemId = `ordli_${Date.now()}_${i}_${Math.floor(Math.random() * 1000)}`;
      const orderItemId = `orditm_${Date.now()}_${i}_${Math.floor(Math.random() * 1000)}`;

      const zeroRaw = JSON.stringify({ value: "0", precision: 2 });
      const qtyRaw = JSON.stringify({ value: String(itemQty), precision: 2 });
      const priceRaw = JSON.stringify({ value: String(itemPrice), precision: 2 });

      // Insert order_line_item
      await client.query(`
        INSERT INTO order_line_item (
          id, title, subtitle, thumbnail, unit_price, raw_unit_price,
          requires_shipping, is_discountable, is_tax_inclusive, is_custom_price, is_giftcard, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          true, true, false, false, false, NOW(), NOW()
        )
      `, [lineItemId, itemTitle, itemSubtitle, itemThumb, itemPrice, priceRaw]);

      // Insert order_item
      await client.query(`
        INSERT INTO order_item (
          id, order_id, version, item_id, quantity, raw_quantity,
          fulfilled_quantity, raw_fulfilled_quantity,
          shipped_quantity, raw_shipped_quantity,
          delivered_quantity, raw_delivered_quantity,
          return_requested_quantity, raw_return_requested_quantity,
          return_received_quantity, raw_return_received_quantity,
          return_dismissed_quantity, raw_return_dismissed_quantity,
          written_off_quantity, raw_written_off_quantity,
          unit_price, raw_unit_price,
          created_at, updated_at
        ) VALUES (
          $1, $2, 1, $3, $4, $5,
          0, $6,
          0, $6,
          0, $6,
          0, $6,
          0, $6,
          0, $6,
          0, $6,
          $7, $8,
          NOW(), NOW()
        )
      `, [
        orderItemId, orderId, lineItemId, itemQty, qtyRaw,
        zeroRaw, itemPrice, priceRaw
      ]);
    }

    // 6. Insert into order_summary table with correct totals
    const finalAmount = calculatedSubtotal > 0 ? calculatedSubtotal : (typeof totalAmount === "number" ? totalAmount : 145);
    const summaryId = `ordsum_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const totalsObj = {
      total: finalAmount,
      subtotal: finalAmount,
      tax_total: 0,
      discount_total: 0,
      shipping_total: 0,
      paid_total: finalAmount,
      refunded_total: 0,
      pending_difference: 0,
      raw_total: { value: String(finalAmount), precision: 2 },
      raw_subtotal: { value: String(finalAmount), precision: 2 },
      raw_tax_total: { value: "0", precision: 2 },
      raw_discount_total: { value: "0", precision: 2 },
      raw_shipping_total: { value: "0", precision: 2 },
      raw_paid_total: { value: String(finalAmount), precision: 2 },
      raw_refunded_total: { value: "0", precision: 2 },
      raw_pending_difference: { value: "0", precision: 2 }
    };

    await client.query(`
      INSERT INTO order_summary (id, order_id, version, totals, created_at, updated_at)
      VALUES ($1, $2, 1, $3, NOW(), NOW())
    `, [summaryId, orderId, JSON.stringify(totalsObj)]);

    await client.end();

    return NextResponse.json({
      success: true,
      orderId,
      displayId: nextDisplayId,
      customerId,
      addressId,
    });
  } catch (error: unknown) {
    console.error("Error creating Medusa order:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
