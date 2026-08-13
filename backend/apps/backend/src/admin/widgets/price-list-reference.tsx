import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Badge } from "@medusajs/ui";
import { useEffect, useState } from "react";

const PriceListReferenceWidget = ({ data }: { data: any }) => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!data?.id) return;
    
    fetch(`/admin/price-list-summary?price_list_id=${data.id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.items) {
          setItems(resData.items);
        }
      })
      .catch(() => {});
  }, [data?.id]);

  if (!data?.id || items.length === 0) return null;

  return (
    <Container className="p-4 my-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <Heading level="h3" className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <span>🏷️ Price Comparison</span>
          </Heading>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Original Base vs. Sale Override ({items.length} items)
          </p>
        </div>
        <Badge color="amber" size="small">
          Live Sale
        </Badge>
      </div>

      <div className="max-h-[320px] overflow-y-auto pr-1 space-y-2.5 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
        {items.map((item) => (
          <div
            key={`${item.product_id}-${item.variant_id}`}
            className="p-2.5 rounded-lg bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 flex flex-col gap-1 hover:border-amber-500/30 transition-colors"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              <span className="truncate max-w-[150px]">{item.product_title}</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold">
                {item.variant_title}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 mt-0.5 border-t border-zinc-200/40 dark:border-zinc-800/40 text-xs">
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-zinc-400 line-through text-[11px]">
                  ₹{item.original_price.toLocaleString("en-IN")}
                </span>
                <span className="font-bold text-emerald-600">
                  ₹{item.sale_price.toLocaleString("en-IN")}
                </span>
              </div>

              {item.discount_percent > 0 && (
                <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/60 px-1.5 py-0.5 rounded text-right">
                  {item.discount_percent}% OFF
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "price_list.details.side.after",
});

export default PriceListReferenceWidget;
