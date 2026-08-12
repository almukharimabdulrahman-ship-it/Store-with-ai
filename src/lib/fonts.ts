import localFont from "next/font/local";

export const brandScript = localFont({
  src: "../../node_modules/@fontsource/great-vibes/files/great-vibes-latin-400-normal.woff2",
  display: "swap",
  weight: "400",
  style: "normal",
  fallback: ["Snell Roundhand", "Segoe Script", "cursive"],
});
