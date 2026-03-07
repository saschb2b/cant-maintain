import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Can't Maintain — React Component API Game",
    short_name: "Can't Maintain",
    description:
      "Train your eye for clean React component APIs in 10 side-by-side challenges.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F0EB",
    theme_color: "#2B4C7E",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
