import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CEBC Admin",
  description: "Content admin panel for the CEBC Annual Summit site",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
