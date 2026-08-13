import { Client } from "pg";
import { PerfumeProduct, MOCK_PERFUMES } from "./medusa";

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_57852eb9533f1f5afc0289566c11cf051e41f20caa96b928164c530a261b60c0";
const DEFAULT_REGION_ID = "reg_original_base_price_01";
const DB_CONNECTION = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/medusa_perfume";

export async function fetchServerCategories(): Promise<string[]> {
  try {
    const client = new Client({ connectionString: DB_CONNECTION });
    await client.connect();
    const res = await client.query("SELECT name FROM product_category WHERE is_active = true AND name NOT IN ('Shirts', 'Sweatshirts', 'Pants', 'Merch') ORDER BY created_at ASC");
    await client.end();
    const names = res.rows.map((r) => String(r.name));
    return names.length > 0 ? names : ["Floral & Fresh", "Woody & Amber", "Oriental & Spiced", "Gourmand & Musk"];
  } catch (e) {
    console.warn("Could not fetch categories from DB:", e);
    return ["Floral & Fresh", "Woody & Amber", "Oriental & Spiced", "Gourmand & Musk"];
  }
}

export async function fetchServerCollections(): Promise<{ id: string; title: string }[]> {
  try {
    const client = new Client({ connectionString: DB_CONNECTION });
    await client.connect();
    const res = await client.query("SELECT id, title FROM product_collection");
    await client.end();
    return res.rows.map((r) => ({ id: String(r.id), title: String(r.title) }));
  } catch (e) {
    console.warn("Could not fetch server collections:", e);
    return [];
  }
}

async function getProductCategoriesMap(): Promise<Record<string, string[]>> {
  try {
    const client = new Client({ connectionString: DB_CONNECTION });
    await client.connect();

    const catsRes = await client.query("SELECT id, name FROM product_category");
    const pcpRes = await client.query("SELECT product_id, product_category_id FROM product_category_product");

    await client.end();

    const catNameById: Record<string, string> = {};
    catsRes.rows.forEach((r) => {
      catNameById[String(r.id)] = String(r.name);
    });

    const productCategoriesMap: Record<string, string[]> = {};
    pcpRes.rows.forEach((r) => {
      const catName = catNameById[String(r.product_category_id)];
      if (catName) {
        const prodId = String(r.product_id);
        if (!productCategoriesMap[prodId]) {
          productCategoriesMap[prodId] = [];
        }
        productCategoriesMap[prodId].push(catName);
      }
    });

    return productCategoriesMap;
  } catch (e) {
    console.warn("Could not query DB for product categories map:", e);
    return {};
  }
}

async function getProductCollectionsMap(): Promise<Record<string, string>> {
  try {
    const client = new Client({ connectionString: DB_CONNECTION });
    await client.connect();

    const colsRes = await client.query("SELECT id, title FROM product_collection");
    const prodsRes = await client.query("SELECT id, collection_id FROM product WHERE collection_id IS NOT NULL");

    await client.end();

    const colNameById: Record<string, string> = {};
    colsRes.rows.forEach((r) => {
      colNameById[String(r.id)] = String(r.title);
    });

    const collectionsMap: Record<string, string> = {};
    prodsRes.rows.forEach((r) => {
      const colId = String(r.collection_id);
      if (colNameById[colId]) {
        collectionsMap[String(r.id)] = colNameById[colId];
      }
    });

    return collectionsMap;
  } catch (e) {
    console.warn("Could not query DB for collections map:", e);
    return {};
  }
}

async function getActivePriceListOverrides(): Promise<Record<string, { amount: number; original_amount?: number; title: string; currency_code: string }>> {
  try {
    const client = new Client({ connectionString: DB_CONNECTION });
    await client.connect();

    const query = `
      SELECT p.price_set_id, p.amount, p.currency_code, p.rules_count, pl.title as price_list_title
      FROM price p
      JOIN price_list pl ON p.price_list_id = pl.id
      WHERE pl.status = 'active'
        AND pl.deleted_at IS NULL
        AND p.deleted_at IS NULL
        AND (pl.starts_at IS NULL OR pl.starts_at <= NOW())
        AND (pl.ends_at IS NULL OR pl.ends_at >= NOW())
      ORDER BY pl.created_at DESC
    `;
    const res = await client.query(query);

    const priceSetToVariant = await client.query(`
      SELECT pvps.price_set_id, pv.id as variant_id
      FROM product_variant_price_set pvps
      JOIN product_variant pv ON pvps.variant_id = pv.id
    `);

    await client.end();

    const overrides: Record<string, { amount: number; original_amount?: number; title: string; currency_code: string }> = {};

    // First pass: find explicit discount prices (rules_count = 0)
    res.rows.forEach((row) => {
      const rulesCount = parseInt(String(row.rules_count || "0"), 10);
      if (rulesCount === 0) {
        const match = priceSetToVariant.rows.find((m) => String(m.price_set_id) === String(row.price_set_id));
        if (match) {
          const varId = String(match.variant_id);
          if (!overrides[varId]) {
            overrides[varId] = {
              amount: parseFloat(String(row.amount)),
              title: String(row.price_list_title),
              currency_code: String(row.currency_code),
            };
          }
        }
      }
    });

    // Second pass: attach original region base prices (rules_count > 0)
    res.rows.forEach((row) => {
      const rulesCount = parseInt(String(row.rules_count || "0"), 10);
      if (rulesCount > 0) {
        const match = priceSetToVariant.rows.find((m) => String(m.price_set_id) === String(row.price_set_id));
        if (match) {
          const varId = String(match.variant_id);
          if (overrides[varId] && !overrides[varId].original_amount) {
            overrides[varId].original_amount = parseFloat(String(row.amount));
          }
        }
      }
    });

    return overrides;
  } catch (e) {
    console.warn("Could not query DB for active price list overrides:", e);
    return {};
  }
}

export async function fetchServerProducts(): Promise<PerfumeProduct[]> {
  try {
    const activePriceOverrides = await getActivePriceListOverrides();
    const collectionsMap = await getProductCollectionsMap();
    const categoriesMap = await getProductCategoriesMap();

    const res = await fetch(
      `${MEDUSA_BACKEND_URL}/store/products?region_id=${DEFAULT_REGION_ID}&fields=*variants.calculated_price,*variants.prices,*categories`,
      {
        headers: {
          "x-publishable-api-key": PUBLISHABLE_API_KEY,
        },
        cache: "no-store",
      }
    );
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
    const data = await res.json();
    if (data.products && data.products.length > 0) {
      return data.products.map((p: { id: string; handle: string; collection?: { title: string }; categories?: Array<{ name: string }>; variants?: Array<{ id: string; title: string; sku: string; prices?: Array<{ amount: number; currency_code: string }>; options?: Array<{ value: string; option?: { title?: string } }> }>; images?: Array<{ url: string }> }) => {
        const mockMatch = MOCK_PERFUMES.find((m) => m.handle === p.handle);

        let productOriginalPrice50: number | undefined = undefined;
        let productOriginalPrice100: number | undefined = undefined;
        let productDiscountBadge: string | undefined = undefined;

        const collectionTitle = collectionsMap[p.id] || (p.collection ? p.collection.title : undefined);
        const categoriesList = categoriesMap[p.id] || (p.categories ? p.categories.map((c) => c.name) : []);

        const parsedVariants = (p.variants || []).map((v) => {
          const regularInrPrice = v.prices?.find((price) => price.currency_code === "inr")?.amount || v.prices?.[0]?.amount || 140;

          const activeOverride = activePriceOverrides[v.id];
          let finalPrice = regularInrPrice;

          if (activeOverride) {
            finalPrice = activeOverride.amount;
            const origAmount = activeOverride.original_amount || regularInrPrice;
            productDiscountBadge = activeOverride.title.toUpperCase();

            const is50 = v.title.includes("50ml") || v.options?.some((o) => String(o.value).includes("50ml"));
            if (is50) {
              productOriginalPrice50 = origAmount;
            } else {
              productOriginalPrice100 = origAmount;
            }
          }

          return {
            id: v.id,
            title: v.title,
            sku: v.sku,
            options: v.options?.reduce((acc: Record<string, string>, opt) => {
              acc[opt.option?.title || "Bottle Size"] = opt.value;
              return acc;
            }, {}) || { "Bottle Size": v.title },
            prices: [{ amount: finalPrice, currency_code: "inr" }],
          };
        });

        return {
          ...p,
          variants: parsedVariants.length > 0 ? parsedVariants : (mockMatch?.variants || []),
          topNotes: mockMatch?.topNotes || ["Bergamot", "Pink Pepper"],
          heartNotes: mockMatch?.heartNotes || ["Rose Absolute", "Jasmine"],
          baseNotes: mockMatch?.baseNotes || ["Amber Wood", "Musk"],
          concentration: mockMatch?.concentration || "Extrait de Parfum (30% Oil Concentration)",
          sillage: mockMatch?.sillage || "Enveloping & Long-Lasting (12h+)",
          story: mockMatch?.story || "Handcrafted in Paris with rare botanical extractions.",
          category: categoriesList[0] || mockMatch?.category || "Floral & Fresh",
          categoriesList,
          collectionTitle,
          originalPrice50: productOriginalPrice50,
          originalPrice100: productOriginalPrice100,
          discountBadge: productDiscountBadge,
          images: p.images && p.images.length > 0 ? p.images : (mockMatch?.images || [{ url: `${MEDUSA_BACKEND_URL}/static/perfume_1.png` }]),
        };
      });
    }
  } catch (error) {
    console.warn("Using fallback local perfume dataset:", error);
  }

  // Fallback to MOCK_PERFUMES with active overrides, collections, & categories applied using EXACT DB IDs
  const activePriceOverrides = await getActivePriceListOverrides();
  const collectionsMap = await getProductCollectionsMap();
  const categoriesMap = await getProductCategoriesMap();

  return MOCK_PERFUMES.map((p) => {
    let originalPrice50: number | undefined = undefined;
    let originalPrice100: number | undefined = undefined;
    let discountBadge: string | undefined = undefined;

    const dbMatchId50 = p.handle === "noir-elegance" ? "prod_01KYH9MCBY0A7WVDNKEEQK86GN"
      : p.handle === "velvet-rose-oud" ? "prod_01KYH9MCBYCC5A0ZKVRCN7XJKF"
      : p.handle === "celestial-bergamot" ? "prod_01KYH9MCC0EF04YX5N3NCR1N0V"
      : p.handle === "amber-nocturne" ? "prod_01KYH9MCC1K6NMGWB10RY4JVTA"
      : p.handle === "santal-imperial" ? "prod_01KYH9MCC1JW8JWK5QY48RQV77"
      : p.handle === "iris-royale" ? "prod_01KYH9MCC130PX7VTZVGTA64RA"
      : p.handle === "smoked-vanilla-tabac" ? "prod_01KYH9MCC1JN05J9NSDDABRSM3"
      : p.handle === "neroli-solaire" ? "prod_01KYH9MCC2JD9WBYMXZNT11CZX"
      : p.handle === "musc-absolu" ? "prod_01KYH9MCC2X9H5EE2JX2RKVW95"
      : p.handle === "figue-sauvage" ? "prod_01KYH9MCC2DHDDBDWXQJ5ZREAC"
      : p.handle === "cedar-drift" ? "prod_01KYH9MCC2YTS1A70NPFS6SG3H"
      : p.handle === "jasmine-nuit" ? "prod_01KYH9MCC20T4Q4DGBYJQY1F16"
      : p.handle === "vetiver-sublime" ? "prod_01KYH9MCC2SFYHQCWM8F0QQK8V"
      : p.handle === "cypress-shadow" ? "prod_01KYH9MCC2JQ2CXXCX4HWE6KRW"
      : p.handle === "ambre-imperial" ? "prod_01KYH9MCC3F56A20WX021BV6B2"
      : null;

    const collectionTitle = dbMatchId50 ? collectionsMap[dbMatchId50] : undefined;
    const fallbackCat = p.category || "Haute Parfumerie";
    const categoriesList: string[] = dbMatchId50 ? categoriesMap[dbMatchId50] || [fallbackCat] : [fallbackCat];

    const variants = p.variants.map((v) => {
      const dbMatchId = v.sku.includes("NOIR-50ML") ? "variant_01KYH9MCSKDSJM11WWV9EKM5BE"
        : v.sku.includes("NOIR-100ML") ? "variant_01KYH9MCSMR4P8X1FDBD341KWS"
        : v.sku.includes("ROSE-50ML") ? "variant_01KYH9MCSNDCTB502W4Y72EWK5"
        : v.sku.includes("ROSE-100ML") ? "variant_01KYH9MCSPQTA1YR977JEQ4QAR"
        : null;

      const override = dbMatchId ? activePriceOverrides[dbMatchId] : null;
      if (override) {
        discountBadge = override.title.toUpperCase();
        if (v.title.includes("50ml")) {
          originalPrice50 = override.original_amount || v.prices[0].amount;
        } else {
          originalPrice100 = override.original_amount || v.prices[0].amount;
        }
        return {
          ...v,
          prices: [{ amount: override.amount, currency_code: "usd" }],
        };
      }
      return v;
    });

    return {
      ...p,
      variants,
      originalPrice50,
      originalPrice100,
      discountBadge,
      collectionTitle,
      categoriesList,
    };
  });
}

export async function fetchServerProductByHandle(handle: string): Promise<PerfumeProduct | null> {
  const products = await fetchServerProducts();
  return products.find((p) => p.handle === handle) || null;
}
