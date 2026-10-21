import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // The ALOY field note was folded into Experience.
    return [{ source: "/projects/aloy-field-note", destination: "/#experience", permanent: true }];
  },
};

export default nextConfig;
