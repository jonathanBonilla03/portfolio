import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name}: data analytics and business intelligence`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview card, generated at build time. */
export default function OpengraphImage() {
  const gridLine = "#ecece6";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#fafaf7",
          backgroundImage: `linear-gradient(to right, ${gridLine} 1px, transparent 1px), linear-gradient(to bottom, ${gridLine} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          color: "#1c1f23",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 34, fontWeight: 600 }}>{site.name}</div>
          <div style={{ marginTop: 14, fontSize: 22, color: "#5b6168", letterSpacing: 2, textTransform: "uppercase" }}>
            {site.tagline.join(" · ")}
          </div>
        </div>
        <div style={{ fontSize: 60, fontWeight: 600, lineHeight: 1.12, letterSpacing: -1.5, maxWidth: 1000 }}>
          {site.headline}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, color: "#5b6168" }}>
          <div style={{ width: 48, height: 4, background: "#0f6e6e" }} />
          Phoenix, AZ · English / Spanish
        </div>
      </div>
    ),
    size,
  );
}
