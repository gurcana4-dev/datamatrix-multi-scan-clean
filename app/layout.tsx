import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DataMatrix Multi Scanner",
  description: "Industrial multi DataMatrix scanner",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
