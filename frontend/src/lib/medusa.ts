const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_57852eb9533f1f5afc0289566c11cf051e41f20caa96b928164c530a261b60c0";
const DEFAULT_REGION_ID = "reg_original_base_price_01";

export interface PerfumeVariant {
  id: string;
  title: string;
  sku: string;
  options: Record<string, string>;
  prices: Array<{ amount: number; currency_code: string; original_amount?: number }>;
}

export interface PerfumeProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  thumbnail?: string;
  images: Array<{ url: string }>;
  options: Array<{ id: string; title: string; values: Array<{ value: string }> }>;
  variants: PerfumeVariant[];
  category?: string;
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  concentration?: string;
  sillage?: string;
  story?: string;
  originalPrice50?: number;
  originalPrice100?: number;
  saleBadge?: string;
  discountBadge?: string;
  collectionTitle?: string;
  categoriesList?: string[];
}

const GALLERY_IMAGES = [
  `${MEDUSA_BACKEND_URL}/static/perfume_1.png`,
  `${MEDUSA_BACKEND_URL}/static/perfume_2.png`,
  `${MEDUSA_BACKEND_URL}/static/perfume_3.png`,
  `${MEDUSA_BACKEND_URL}/static/perfume_4.png`,
];

export const MOCK_PERFUMES: PerfumeProduct[] = [
  {
    id: "prod_1",
    title: "Noir Élégance",
    handle: "noir-elegance",
    category: "Woody & Amber",
    description: "An intoxicating composition of black pepper, damask rose, and rare smoked agarwood. Formulated in high perfume concentration for eternal sillage.",
    images: [{ url: GALLERY_IMAGES[0] }, { url: GALLERY_IMAGES[1] }, { url: GALLERY_IMAGES[2] }],
    options: [{ id: "opt_1", title: "Bottle Size", values: [{ value: "50ml" }, { value: "100ml" }] }],
    variants: [
      { id: "var_1_50", title: "50ml", sku: "NOIR-50ML", options: { "Bottle Size": "50ml" }, prices: [{ amount: 145, currency_code: "usd" }] },
      { id: "var_1_100", title: "100ml", sku: "NOIR-100ML", options: { "Bottle Size": "100ml" }, prices: [{ amount: 220, currency_code: "usd" }] },
    ],
    topNotes: ["Crushed Black Pepper", "Italian Bergamot", "Cardamom Seed"],
    heartNotes: ["Damask Rose Absolute", "Smoked Incense", "Nutmeg"],
    baseNotes: ["Smoked Oud Wood", "Golden Amber", "Indonesian Patchouli"],
    concentration: "Extrait de Parfum (32% Oil Concentration)",
    sillage: "Enveloping & Heavy (14h+)",
    story: "Created in the historic scent atelier of Grasse, Noir Élégance captures the mystery of Paris at midnight.",
  },
  {
    id: "prod_2",
    title: "Velvet Rose & Oud",
    handle: "velvet-rose-oud",
    category: "Floral & Fresh",
    description: "Opulent crimson rose blended with spicy clove, praline, and deep dark oud wood for an unforgettable evening signature.",
    images: [{ url: GALLERY_IMAGES[1] }, { url: GALLERY_IMAGES[0] }, { url: GALLERY_IMAGES[3] }],
    options: [{ id: "opt_2", title: "Bottle Size", values: [{ value: "50ml" }, { value: "100ml" }] }],
    variants: [
      { id: "var_2_50", title: "50ml", sku: "ROSE-50ML", options: { "Bottle Size": "50ml" }, prices: [{ amount: 155, currency_code: "usd" }] },
      { id: "var_2_100", title: "100ml", sku: "ROSE-100ML", options: { "Bottle Size": "100ml" }, prices: [{ amount: 240, currency_code: "usd" }] },
    ],
    topNotes: ["Crimson Clove", "Pink Peppercorn", "Bergamot"],
    heartNotes: ["Bulgarian Rose", "Taif Rose Absolute", "Praline"],
    baseNotes: ["Agarwood Oud", "Velvet Musk", "Clear Amber"],
    concentration: "Extrait de Parfum (30% Oil Concentration)",
    sillage: "Radiant & Intimate (12h+)",
    story: "Inspired by the royal rose gardens of Versailles under twilight.",
  },
  {
    id: "prod_3",
    title: "Celestial Bergamot",
    handle: "celestial-bergamot",
    category: "Floral & Fresh",
    description: "Sparkling Calabrian bergamot infused with neroli petals, crisp citrus blossom, and a sensual white amber foundation.",
    images: [{ url: GALLERY_IMAGES[2] }, { url: GALLERY_IMAGES[3] }, { url: GALLERY_IMAGES[0] }],
    options: [{ id: "opt_3", title: "Bottle Size", values: [{ value: "50ml" }, { value: "100ml" }] }],
    variants: [
      { id: "var_3_50", title: "50ml", sku: "CELESTIAL-50ML", options: { "Bottle Size": "50ml" }, prices: [{ amount: 120, currency_code: "usd" }] },
      { id: "var_3_100", title: "100ml", sku: "CELESTIAL-100ML", options: { "Bottle Size": "100ml" }, prices: [{ amount: 190, currency_code: "usd" }] },
    ],
    topNotes: ["Calabrian Bergamot", "Sicilian Lemon", "Green Mandarin"],
    heartNotes: ["Neroli Petals", "Orange Blossom", "White Lily"],
    baseNotes: ["White Amber", "Clean Cedar", "Musk Mineral"],
    concentration: "Eau de Parfum Supreme (25% Oil Concentration)",
    sillage: "Crisp & Luminous (10h+)",
    story: "A celebration of sun-bathed Mediterranean coastlines.",
  },
  {
    id: "prod_4",
    title: "Amber Nocturne",
    handle: "amber-nocturne",
    category: "Woody & Amber",
    description: "Warm golden resin, Madagascar vanilla bourbon, and smoldering frankincense created for nocturnal sophistication.",
    images: [{ url: GALLERY_IMAGES[3] }, { url: GALLERY_IMAGES[1] }, { url: GALLERY_IMAGES[2] }],
    options: [{ id: "opt_4", title: "Bottle Size", values: [{ value: "50ml" }, { value: "100ml" }] }],
    variants: [
      { id: "var_4_50", title: "50ml", sku: "AMBER-50ML", options: { "Bottle Size": "50ml" }, prices: [{ amount: 135, currency_code: "usd" }] },
      { id: "var_4_100", title: "100ml", sku: "AMBER-100ML", options: { "Bottle Size": "100ml" }, prices: [{ amount: 210, currency_code: "usd" }] },
    ],
    topNotes: ["Labdanum Resin", "Smoked Cinnamon", "Nutmeg"],
    heartNotes: ["Golden Amber", "Benzoin Tears", "Myrrh"],
    baseNotes: ["Madagascar Vanilla Bourbon", "Tonka Bean", "Sandalwood"],
    concentration: "Extrait de Parfum (33% Oil Concentration)",
    sillage: "Warm & Enveloping (15h+)",
    story: "Capturing the golden glowing lights of Parisian salons.",
  },
  {
    id: "prod_5",
    title: "Santal Impérial",
    handle: "santal-imperial",
    category: "Woody & Amber",
    description: "Velvety Australian sandalwood enhanced by green cardamom, Florentine iris, and refined Tuscan leather.",
    images: [{ url: GALLERY_IMAGES[0] }, { url: GALLERY_IMAGES[2] }, { url: GALLERY_IMAGES[1] }],
    options: [{ id: "opt_5", title: "Bottle Size", values: [{ value: "50ml" }, { value: "100ml" }] }],
    variants: [
      { id: "var_5_50", title: "50ml", sku: "SANTAL-50ML", options: { "Bottle Size": "50ml" }, prices: [{ amount: 150, currency_code: "usd" }] },
      { id: "var_5_100", title: "100ml", sku: "SANTAL-100ML", options: { "Bottle Size": "100ml" }, prices: [{ amount: 235, currency_code: "usd" }] },
    ],
    topNotes: ["Green Cardamom", "Papyrus Leaf", "Violet Blossom"],
    heartNotes: ["Florentine Iris", "Atlas Cedar", "Ambrette"],
    baseNotes: ["Australian Sandalwood", "Tuscan Leather", "Cashmere"],
    concentration: "Extrait de Parfum (30% Oil Concentration)",
    sillage: "Smooth & Sophisticated (12h+)",
    story: "A masterclass in woody elegance.",
  },
  {
    id: "prod_6",
    title: "Iris Royale",
    handle: "iris-royale",
    category: "Floral & Fresh",
    description: "Precious Florentine iris butter paired with violet leaf absolute, white musk, and soft creamy cedarwood.",
    images: [{ url: GALLERY_IMAGES[1] }, { url: GALLERY_IMAGES[3] }],
    options: [{ id: "opt_6", title: "Bottle Size", values: [{ value: "50ml" }, { value: "100ml" }] }],
    variants: [
      { id: "var_6_50", title: "50ml", sku: "IRIS-50ML", options: { "Bottle Size": "50ml" }, prices: [{ amount: 145, currency_code: "usd" }] },
      { id: "var_6_100", title: "100ml", sku: "IRIS-100ML", options: { "Bottle Size": "100ml" }, prices: [{ amount: 225, currency_code: "usd" }] },
    ],
    topNotes: ["Violet Leaf", "Pear Blossom", "Pink Pepper"],
    heartNotes: ["Florentine Iris Root", "Mimosa", "Rose Water"],
    baseNotes: ["White Musk", "Cedarwood", "Sandalwood"],
    concentration: "Extrait de Parfum (28% Oil Concentration)",
    sillage: "Powdery & Regal (11h+)",
    story: "Extracted from iris rhizomes aged for three full years.",
  },
  {
    id: "prod_7",
    title: "Smoked Vanilla & Tabac",
    handle: "smoked-vanilla-tabac",
    category: "Gourmand & Musk",
    description: "Decadent smoked vanilla bean, cured Cuban tobacco leaf, tonka bean, and warm acacia honey.",
    images: [{ url: GALLERY_IMAGES[2] }, { url: GALLERY_IMAGES[0] }],
    options: [{ id: "opt_7", title: "Bottle Size", values: [{ value: "50ml" }, { value: "100ml" }] }],
    variants: [
      { id: "var_7_50", title: "50ml", sku: "VANILLA-50ML", options: { "Bottle Size": "50ml" }, prices: [{ amount: 130, currency_code: "usd" }] },
      { id: "var_7_100", title: "100ml", sku: "VANILLA-100ML", options: { "Bottle Size": "100ml" }, prices: [{ amount: 205, currency_code: "usd" }] },
    ],
    topNotes: ["Tobacco Leaf", "Spiced Clove", "Anise"],
    heartNotes: ["Smoked Vanilla Pod", "Tonka Bean", "Cacao"],
    baseNotes: ["Acacia Honey", "Wood Sap", "Benzoin"],
    concentration: "Extrait de Parfum (30% Oil Concentration)",
    sillage: "Rich & Addictive (14h+)",
    story: "Evoking private gentleman's clubs and leather armchairs.",
  },
  {
    id: "prod_8",
    title: "Néroli Solaire",
    handle: "neroli-solaire",
    category: "Floral & Fresh",
    description: "Sun-drenched Tunisian neroli blossom, Italian mandarin, Sambac jasmine, and radiant solar musk.",
    images: [{ url: GALLERY_IMAGES[3] }, { url: GALLERY_IMAGES[2] }],
    options: [{ id: "opt_8", title: "Bottle Size", values: [{ value: "50ml" }, { value: "100ml" }] }],
    variants: [
      { id: "var_8_50", title: "50ml", sku: "NEROLI-50ML", options: { "Bottle Size": "50ml" }, prices: [{ amount: 125, currency_code: "usd" }] },
      { id: "var_8_100", title: "100ml", sku: "NEROLI-100ML", options: { "Bottle Size": "100ml" }, prices: [{ amount: 195, currency_code: "usd" }] },
    ],
    topNotes: ["Tunisian Neroli", "Italian Mandarin", "Bergamot"],
    heartNotes: ["Orange Flower", "Sambac Jasmine", "Petitgrain"],
    baseNotes: ["Solar Musk", "White Amber", "Driftwood"],
    concentration: "Eau de Parfum Supreme (26% Oil Concentration)",
    sillage: "Radiant & Fresh (9h+)",
    story: "Bottled sunshine from the French Riviera.",
  },
  {
    id: "prod_9",
    title: "Musc Absolu",
    handle: "musc-absolu",
    category: "Gourmand & Musk",
    description: "Sensual crystalline musk, white lily, pink pepper, and comforting cashmere wood wrapped in pure elegance.",
    images: [{ url: GALLERY_IMAGES[0] }, { url: GALLERY_IMAGES[1] }],
    options: [{ id: "opt_9", title: "Bottle Size", values: [{ value: "50ml" }, { value: "100ml" }] }],
    variants: [
      { id: "var_9_50", title: "50ml", sku: "MUSC-50ML", options: { "Bottle Size": "50ml" }, prices: [{ amount: 135, currency_code: "usd" }] },
      { id: "var_9_100", title: "100ml", sku: "MUSC-100ML", options: { "Bottle Size": "100ml" }, prices: [{ amount: 215, currency_code: "usd" }] },
    ],
    topNotes: ["Pink Pepper", "Aldehydes", "White Lily"],
    heartNotes: ["Crystal Musk", "Helvetolide", "Rose Water"],
    baseNotes: ["Cashmere Wood", "White Amber", "Vanilla Suede"],
    concentration: "Extrait de Parfum (31% Oil Concentration)",
    sillage: "Skin Scent & Intimate (12h+)",
    story: "The ultimate clean luxury skin fragrance.",
  },
  {
    id: "prod_10",
    title: "Figue Sauvage",
    handle: "figue-sauvage",
    category: "Floral & Fresh",
    description: "Wild Mediterranean fig trees, sun-warmed fig leaves, cool coconut water, and earthy cedar wood.",
    images: [{ url: GALLERY_IMAGES[1] }, { url: GALLERY_IMAGES[2] }],
    options: [{ id: "opt_10", title: "Bottle Size", values: [{ value: "50ml" }, { value: "100ml" }] }],
    variants: [
      { id: "var_10_50", title: "50ml", sku: "FIGUE-50ML", options: { "Bottle Size": "50ml" }, prices: [{ amount: 115, currency_code: "usd" }] },
      { id: "var_10_100", title: "100ml", sku: "FIGUE-100ML", options: { "Bottle Size": "100ml" }, prices: [{ amount: 185, currency_code: "usd" }] },
    ],
    topNotes: ["Wild Fig Leaf", "Green Sap", "Bergamot"],
    heartNotes: ["Ripe Fig Fruit", "Coconut Water", "Iris"],
    baseNotes: ["Cedar Wood", "Bark Accord", "Dry Amber"],
    concentration: "Eau de Parfum (24% Oil Concentration)",
    sillage: "Green & Natural (10h+)",
    story: "Walking under shade trees on a Mediterranean afternoon.",
  },
  {
    id: "prod_11",
    title: "Cedar Drift",
    handle: "cedar-drift",
    category: "Woody & Amber",
    description: "Crisp mountain cedarwood, aromatic Haitian vetiver, crushed juniper berries, and clean mountain air.",
    images: [{ url: GALLERY_IMAGES[2] }, { url: GALLERY_IMAGES[3] }],
    options: [{ id: "opt_11", title: "Bottle Size", values: [{ value: "50ml" }, { value: "100ml" }] }],
    variants: [
      { id: "var_11_50", title: "50ml", sku: "CEDAR-50ML", options: { "Bottle Size": "50ml" }, prices: [{ amount: 120, currency_code: "usd" }] },
      { id: "var_11_100", title: "100ml", sku: "CEDAR-100ML", options: { "Bottle Size": "100ml" }, prices: [{ amount: 190, currency_code: "usd" }] },
    ],
    topNotes: ["Juniper Berries", "Grapefruit", "Pink Pepper"],
    heartNotes: ["Atlas Cedarwood", "Pine Needles", "Clary Sage"],
    baseNotes: ["Haitian Vetiver", "Oakmoss", "Ambroxan"],
    concentration: "Extrait de Parfum (29% Oil Concentration)",
    sillage: "Crisp & Woody (12h+)",
    story: "Inspired by high Alpine forests at dawn.",
  },
  {
    id: "prod_12",
    title: "Jasmine Nuit",
    handle: "jasmine-nuit",
    category: "Floral & Fresh",
    description: "Intense night-blooming jasmine, Madagascar ylang-ylang, Indian sandalwood, and golden benzoin resin.",
    images: [{ url: GALLERY_IMAGES[3] }, { url: GALLERY_IMAGES[0] }],
    options: [{ id: "opt_12", title: "Bottle Size", values: [{ value: "50ml" }, { value: "100ml" }] }],
    variants: [
      { id: "var_12_50", title: "50ml", sku: "JASMINE-50ML", options: { "Bottle Size": "50ml" }, prices: [{ amount: 140, currency_code: "usd" }] },
      { id: "var_12_100", title: "100ml", sku: "JASMINE-100ML", options: { "Bottle Size": "100ml" }, prices: [{ amount: 220, currency_code: "usd" }] },
    ],
    topNotes: ["Night Jasmine", "Mandarin", "Cardamom"],
    heartNotes: ["Sambac Jasmine", "Madagascar Ylang-Ylang", "Gardenia"],
    baseNotes: ["Indian Sandalwood", "Benzoin", "Vanilla Suede"],
    concentration: "Extrait de Parfum (31% Oil Concentration)",
    sillage: "Norturnal & Seductive (13h+)",
    story: "Harvested at midnight when jasmine flowers release their most potent fragrance.",
  },
  {
    id: "prod_13",
    title: "Vétiver Sublime",
    handle: "vetiver-sublime",
    category: "Oriental & Spiced",
    description: "Smoky Haitian vetiver root, bright ruby grapefruit, grated nutmeg, and rich oakmoss base.",
    images: [{ url: GALLERY_IMAGES[0] }, { url: GALLERY_IMAGES[2] }],
    options: [{ id: "opt_13", title: "Bottle Size", values: [{ value: "50ml" }, { value: "100ml" }] }],
    variants: [
      { id: "var_13_50", title: "50ml", sku: "VETIVER-50ML", options: { "Bottle Size": "50ml" }, prices: [{ amount: 130, currency_code: "usd" }] },
      { id: "var_13_100", title: "100ml", sku: "VETIVER-100ML", options: { "Bottle Size": "100ml" }, prices: [{ amount: 200, currency_code: "usd" }] },
    ],
    topNotes: ["Ruby Grapefruit", "Bergamot", "Nutmeg"],
    heartNotes: ["Haitian Vetiver", "Geranium", "Pink Pepper"],
    baseNotes: ["Velvet Oakmoss", "Cedar", "Tonka"],
    concentration: "Extrait de Parfum (30% Oil Concentration)",
    sillage: "Earthy & Refined (12h+)",
    story: "Sublime earthiness refined by sparkling citrus.",
  },
  {
    id: "prod_14",
    title: "Cypress Shadow",
    handle: "cypress-shadow",
    category: "Oriental & Spiced",
    description: "Majestic Italian cypress needles, sacred frankincense smoke, guaiacwood, and aged Indonesian patchouli.",
    images: [{ url: GALLERY_IMAGES[1] }, { url: GALLERY_IMAGES[3] }],
    options: [{ id: "opt_15", title: "Bottle Size", values: [{ value: "50ml" }, { value: "100ml" }] }],
    variants: [
      { id: "var_14_50", title: "50ml", sku: "CYPRESS-50ML", options: { "Bottle Size": "50ml" }, prices: [{ amount: 125, currency_code: "usd" }] },
      { id: "var_14_100", title: "100ml", sku: "CYPRESS-100ML", options: { "Bottle Size": "100ml" }, prices: [{ amount: 195, currency_code: "usd" }] },
    ],
    topNotes: ["Italian Cypress", "Incense", "Lemon Leaf"],
    heartNotes: ["Guaiacwood", "Cedar Needles", "Clove"],
    baseNotes: ["Indonesian Patchouli", "Dry Amber", "Vetiver"],
    concentration: "Extrait de Parfum (28% Oil Concentration)",
    sillage: "Resinous & Mysterious (11h+)",
    story: "Inspired by ancient cypress groves along Tuscan hillsides under moonlight.",
  },
  {
    id: "prod_15",
    title: "Ambre Impérial",
    handle: "ambre-imperial",
    category: "Oriental & Spiced",
    description: "Royal oriental amber accord, rock rose labdanum, Ceylon cinnamon, and balsamic benzoin.",
    images: [{ url: GALLERY_IMAGES[2] }, { url: GALLERY_IMAGES[0] }],
    options: [{ id: "opt_15", title: "Bottle Size", values: [{ value: "50ml" }, { value: "100ml" }] }],
    variants: [
      { id: "var_15_50", title: "50ml", sku: "AMBRE-50ML", options: { "Bottle Size": "50ml" }, prices: [{ amount: 160, currency_code: "usd" }] },
      { id: "var_15_100", title: "100ml", sku: "AMBRE-100ML", options: { "Bottle Size": "100ml" }, prices: [{ amount: 250, currency_code: "usd" }] },
    ],
    topNotes: ["Ceylon Cinnamon", "Nutmeg", "Bergamot"],
    heartNotes: ["Royal Amber Accord", "Rock Rose Labdanum", "Myrrh"],
    baseNotes: ["Balsamic Benzoin", "Vanilla Bean", "Sandalwood"],
    concentration: "Extrait de Parfum (33% Oil Concentration)",
    sillage: "Rich & Imperial (16h+)",
    story: "The crown jewel of our amber extractions. Majestic, opulent, and unashamedly luxurious.",
  },
];

export async function fetchProducts(): Promise<PerfumeProduct[]> {
  try {
    const res = await fetch(
      `${MEDUSA_BACKEND_URL}/store/products?region_id=${DEFAULT_REGION_ID}&fields=*variants.calculated_price,*variants.prices,*variants.prices.price_list`,
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
      return data.products.map((p: { handle: string; variants?: Array<{ id: string; title: string; sku: string; prices?: Array<{ amount: number; currency_code: string; price_list_id?: string; price_list?: { title?: string }; rules_count?: number }>; options?: Array<{ value: string; option?: { title?: string } }> }>; images?: Array<{ url: string }> }) => {
        const mockMatch = MOCK_PERFUMES.find((m) => m.handle === p.handle);

        let productOriginalPrice50: number | undefined = undefined;
        let productOriginalPrice100: number | undefined = undefined;
        let productDiscountBadge: string | undefined = undefined;

        const parsedVariants = (p.variants || []).map((v) => {
          const inrPrices = (v.prices || []).filter((price) => price.currency_code === "inr");
          
          // Check if there is an active Price List override entry
          const overridePrice = inrPrices.find((price) => (price.price_list_id || price.price_list) && (price.rules_count === 0 || !price.rules_count));
          const originalRegionPrice = inrPrices.find((price) => (price.price_list_id || price.price_list) && typeof price.rules_count === "number" && price.rules_count > 0) || inrPrices.find((price) => !price.price_list_id && !price.price_list) || inrPrices[0];

          const regularAmount = originalRegionPrice ? originalRegionPrice.amount : 140;
          const finalAmount = overridePrice ? overridePrice.amount : regularAmount;

          if (overridePrice) {
            productDiscountBadge = overridePrice.price_list?.title?.toUpperCase() || "SALE";

            const is50 = v.title.includes("50ml") || v.options?.some((o) => String(o.value).includes("50ml"));
            if (is50) {
              productOriginalPrice50 = regularAmount;
            } else {
              productOriginalPrice100 = regularAmount;
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
            prices: [{ amount: finalAmount, currency_code: "inr" }],
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
          category: mockMatch?.category || "Haute Parfumerie",
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
  return MOCK_PERFUMES;
}

export async function fetchProductByHandle(handle: string): Promise<PerfumeProduct | null> {
  const products = await fetchProducts();
  return products.find((p) => p.handle === handle) || null;
}
