import type { Metadata, Viewport } from "next";
import "@fontsource/young-serif/400.css";
import "@fontsource/figtree/400.css";
import "@fontsource/figtree/600.css";
import "./globals.css";
import { HOTEL } from "@/site";

export const metadata: Metadata = {
  title: `${HOTEL.name}, ${HOTEL.town} | Beachfront rooms`,
  description: `${HOTEL.name} on ${HOTEL.street}, ${HOTEL.town}: beachfront rooms one minute from Clacton Beach, five with sea views. Check availability and request a booking.`,
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#f8faf9" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
