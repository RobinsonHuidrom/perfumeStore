/**
 * postinstall-patch.js
 * 
 * Applies the dashboard patch for auto-populating base prices in the
 * Price List "Add Products" wizard. This script directly modifies the
 * target file in node_modules without relying on git (avoiding Windows
 * long path issues with patch-package).
 * 
 * Run via: node scripts/postinstall-patch.js
 */

const fs = require("fs");
const path = require("path");

const TARGET_SRC_FILE = path.join(
  __dirname,
  "..",
  "node_modules",
  "@medusajs",
  "dashboard",
  "src",
  "routes",
  "price-lists",
  "price-list-prices-add",
  "components",
  "price-list-prices-add-form",
  "price-list-prices-add-prices-form.tsx"
);

const DIST_DIR = path.join(
  __dirname,
  "..",
  "node_modules",
  "@medusajs",
  "dashboard",
  "dist"
);

// The marker that tells us the patch is already applied
const PATCH_MARKER = "/admin/variant-base-prices";

// --- SRC FILE PATCH ---
const ORIGINAL_IMPORT = 'import { useEffect } from "react"';
const PATCHED_IMPORT = 'import { useEffect, useRef, useState } from "react"';

const ORIGINAL_BLOCK = `  useEffect(() => {
    if (!isLoading && products) {
      products.forEach((product) => {
        /**
         * If the product already exists in the form, we don't want to overwrite it.
         */
        if (existingProducts?.[product.id] || !product.variants) {
          return
        }

        setValue(\`products.\${product.id}.variants\`, {
          ...product.variants.reduce((variants, variant) => {
            variants[variant.id] = {
              currency_prices: {},
              region_prices: {},
            }
            return variants
          }, {} as PriceListCreateProductVariantsSchema),
        })
      })
    }
  }, [products, existingProducts, isLoading, setValue])`;

const PATCHED_BLOCK = `  /**
   * Track which products have already had their base prices pre-filled
   * to avoid overwriting user edits on re-renders.
   */
  const priceFilledRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!isLoading && products) {
      const newProducts: HttpTypes.AdminProduct[] = []

      products.forEach((product) => {
        /**
         * If the product already exists in the form, we don't want to overwrite it.
         */
        if (existingProducts?.[product.id] || !product.variants) {
          return
        }

        setValue(\`products.\${product.id}.variants\`, {
          ...product.variants.reduce((variants, variant) => {
            variants[variant.id] = {
              currency_prices: {},
              region_prices: {},
            }
            return variants
          }, {} as PriceListCreateProductVariantsSchema),
        })

        newProducts.push(product)
      })

      /**
       * PATCH: Fetch base prices from catalog and pre-fill the
       * "Original Base Price" region column for newly added products.
       */
      if (newProducts.length > 0) {
        const allVariantIds = newProducts.flatMap(
          (p) => p.variants?.map((v) => v.id) || []
        )

        // Filter out variants that have already been price-filled
        const unfilled = allVariantIds.filter(
          (vid) => !priceFilledRef.current.has(vid)
        )

        if (unfilled.length > 0) {
          fetch(
            \`/admin/variant-base-prices?variant_ids=\${unfilled.join(",")}\`,
            { credentials: "include" }
          )
            .then((res) => res.json())
            .then((data) => {
              if (data.success && data.prices && data.region_id) {
                const regionId = data.region_id as string

                newProducts.forEach((product) => {
                  product.variants?.forEach((variant) => {
                    const basePrice = data.prices[variant.id]
                    if (basePrice && !priceFilledRef.current.has(variant.id)) {
                      setValue(
                        \`products.\${product.id}.variants.\${variant.id}.region_prices.\${regionId}\`,
                        [{ amount: basePrice.amount.toString() }]
                      )
                      priceFilledRef.current.add(variant.id)
                    }
                  })
                })
              }
            })
            .catch((err) => {
              console.warn("Failed to fetch base prices:", err)
            })
        }
      }
    }
  }, [products, existingProducts, isLoading, setValue])`;

// --- DIST FILE PATCH ---
const DIST_ORIGINAL_IMPORT = 'import { useEffect } from "react";';
const DIST_PATCHED_IMPORT = 'import { useEffect, useRef } from "react";';

const DIST_ORIGINAL_BLOCK = `  const { setValue } = form;
  const { setCloseOnEscape } = useRouteModal();
  useEffect(() => {
    if (!isLoading && products) {
      products.forEach((product) => {
        if (existingProducts?.[product.id] || !product.variants) {
          return;
        }
        setValue(\`products.\${product.id}.variants\`, {
          ...product.variants.reduce((variants, variant) => {
            variants[variant.id] = {
              currency_prices: {},
              region_prices: {}
            };
            return variants;
          }, {})
        });
      });
    }
  }, [products, existingProducts, isLoading, setValue]);`;

const DIST_PATCHED_BLOCK = `  const { setValue } = form;
  const { setCloseOnEscape } = useRouteModal();
  const priceFilledRef = useRef(/* @__PURE__ */ new Set());
  useEffect(() => {
    if (!isLoading && products) {
      const newProducts = [];
      products.forEach((product) => {
        if (existingProducts?.[product.id] || !product.variants) {
          return;
        }
        setValue(\`products.\${product.id}.variants\`, {
          ...product.variants.reduce((variants, variant) => {
            variants[variant.id] = {
              currency_prices: {},
              region_prices: {}
            };
            return variants;
          }, {})
        });
        newProducts.push(product);
      });
      if (newProducts.length > 0) {
        const allVariantIds = newProducts.flatMap(
          (p) => p.variants?.map((v) => v.id) || []
        );
        const unfilled = allVariantIds.filter(
          (vid) => !priceFilledRef.current.has(vid)
        );
        if (unfilled.length > 0) {
          fetch(
            \`/admin/variant-base-prices?variant_ids=\${unfilled.join(",")}\`,
            { credentials: "include" }
          )
            .then((res) => res.json())
            .then((data) => {
              if (data.success && data.prices && data.region_id) {
                const regionId = data.region_id;
                newProducts.forEach((product) => {
                  product.variants?.forEach((variant) => {
                    const basePrice = data.prices[variant.id];
                    if (basePrice && !priceFilledRef.current.has(variant.id)) {
                      setValue(
                        \`products.\${product.id}.variants.\${variant.id}.region_prices.\${regionId}\`,
                        [{ amount: basePrice.amount.toString() }]
                      );
                      priceFilledRef.current.add(variant.id);
                    }
                  });
                });
              }
            })
            .catch((err) => {
              console.warn("Failed to fetch base prices:", err);
            });
        }
      }
    }
  }, [products, existingProducts, isLoading, setValue]);`;

function applyPatch() {
  // 1. Patch src file if present
  if (fs.existsSync(TARGET_SRC_FILE)) {
    let content = fs.readFileSync(TARGET_SRC_FILE, "utf-8");
    if (!content.includes(PATCH_MARKER)) {
      if (content.includes(ORIGINAL_IMPORT) && content.includes(ORIGINAL_BLOCK)) {
        content = content.replace(ORIGINAL_IMPORT, PATCHED_IMPORT);
        content = content.replace(ORIGINAL_BLOCK, PATCHED_BLOCK);
        fs.writeFileSync(TARGET_SRC_FILE, content, "utf-8");
        console.log("[postinstall-patch] ✅ Patched dashboard src file.");
      }
    } else {
      console.log("[postinstall-patch] Dashboard src file already patched.");
    }
  }

  // 2. Patch dist bundle files
  if (fs.existsSync(DIST_DIR)) {
    const files = fs.readdirSync(DIST_DIR);
    for (const file of files) {
      if ((file.startsWith("price-list-prices-add") || file.startsWith("price-list-create")) && file.endsWith(".mjs")) {
        const distFilePath = path.join(DIST_DIR, file);
        let content = fs.readFileSync(distFilePath, "utf-8");
        if (!content.includes(PATCH_MARKER)) {
          if (content.includes(DIST_ORIGINAL_IMPORT) && content.includes(DIST_ORIGINAL_BLOCK)) {
            content = content.replace(DIST_ORIGINAL_IMPORT, DIST_PATCHED_IMPORT);
            content = content.replace(DIST_ORIGINAL_BLOCK, DIST_PATCHED_BLOCK);
            fs.writeFileSync(distFilePath, content, "utf-8");
            console.log(`[postinstall-patch] ✅ Patched dashboard dist file: ${file}`);
          }
        } else {
          console.log(`[postinstall-patch] Dashboard dist file ${file} already patched.`);
        }
      }
    }
  }

  // 3. Clear Vite cache if present
  const viteCache = path.join(__dirname, "..", "apps", "backend", "node_modules", ".vite");
  if (fs.existsSync(viteCache)) {
    try {
      fs.rmSync(viteCache, { recursive: true, force: true });
      console.log("[postinstall-patch] 🧹 Cleared Vite cache.");
    } catch (e) {}
  }
}

applyPatch();
