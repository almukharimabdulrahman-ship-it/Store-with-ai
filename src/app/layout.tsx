import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Store with AI",
  description: "Modern e-commerce store powered by AI",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
