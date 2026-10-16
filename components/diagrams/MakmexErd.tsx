type Table = { name: string; x: number; y: number; fields: string[]; highlight?: boolean };

const W = 160;
const HEADER = 28;
const ROW = 20;

const tables: Table[] = [
  { name: "brands", x: 260, y: 12, fields: ["id", "name"] },
  { name: "conditions", x: 440, y: 12, fields: ["id", "multiplier"] },
  { name: "product_types", x: 620, y: 12, fields: ["id", "name"] },
  { name: "kits", x: 20, y: 150, fields: ["id", "sku", "specs"] },
  { name: "kit_items", x: 220, y: 150, fields: ["kit_id", "product_id", "role", "quantity", "kit_discount"] },
  {
    name: "products",
    x: 440,
    y: 150,
    fields: ["id", "sku", "condition_id", "brand_id", "product_type_id"],
    highlight: true,
  },
  { name: "inventory", x: 660, y: 150, fields: ["product_id", "warehouse_location", "quantity"] },
  { name: "warehouse", x: 880, y: 150, fields: ["id", "name"] },
  { name: "combos", x: 20, y: 300, fields: ["id", "sku", "name"] },
  { name: "combo_items", x: 220, y: 300, fields: ["combo_id", "product_id", "quantity", "combo_discount"] },
  { name: "prices", x: 660, y: 300, fields: ["product_id", "created_at", "price_aa"] },
  { name: "product_images", x: 880, y: 300, fields: ["product_id", "path", "is_primary"] },
];

/** Relationship lines, drawn as orthogonal paths; the dot marks the "many" side. */
const edges: { d: string; end: [number, number] }[] = [
  { d: "M340 88 V120 H480 V150", end: [480, 150] },
  { d: "M520 88 V150", end: [520, 150] },
  { d: "M700 88 V120 H560 V150", end: [560, 150] },
  { d: "M180 164 H220", end: [220, 164] },
  { d: "M380 208 H440", end: [380, 208] },
  { d: "M180 314 H220", end: [220, 314] },
  { d: "M380 358 H410 V250 H440", end: [380, 358] },
  { d: "M600 208 H660", end: [660, 208] },
  { d: "M820 228 H850 V190 H880", end: [820, 228] },
  { d: "M600 258 H630 V314 H660", end: [660, 314] },
  { d: "M520 286 V410 H960 V396", end: [960, 396] },
];

export function MakmexErd() {
  return (
    <div className="overflow-x-auto">
      <svg
        viewBox="0 0 1060 420"
        className="h-auto w-full min-w-[720px]"
        role="img"
        aria-label="Entity relationship diagram. Products reference brands, conditions, and product types. Inventory links products to warehouses. Prices and product images belong to products. Kits and combos are built from products through the kit_items and combo_items junction tables."
      >
        {edges.map((edge) => (
          <g key={edge.d}>
            <path d={edge.d} fill="none" stroke="var(--border-strong)" strokeWidth={1.25} />
            <circle cx={edge.end[0]} cy={edge.end[1]} r={3} fill="var(--border-strong)" />
          </g>
        ))}
        {tables.map((t) => {
          const height = HEADER + t.fields.length * ROW + 8;
          return (
            <g key={t.name}>
              <rect
                x={t.x}
                y={t.y}
                width={W}
                height={height}
                rx={8}
                fill="var(--surface)"
                stroke={t.highlight ? "var(--accent)" : "var(--border-strong)"}
                strokeWidth={t.highlight ? 1.5 : 1}
              />
              <path
                d={`M${t.x} ${t.y + HEADER} H${t.x + W}`}
                stroke={t.highlight ? "var(--accent)" : "var(--border)"}
                strokeWidth={1}
              />
              <text
                x={t.x + 12}
                y={t.y + 18}
                className="font-mono text-[12px] font-semibold"
                fill={t.highlight ? "var(--accent)" : "var(--text)"}
              >
                {t.name}
              </text>
              {t.fields.map((field, i) => (
                <text key={field} x={t.x + 12} y={t.y + HEADER + 16 + i * ROW} className="fill-muted font-mono text-[11px]">
                  {field}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
