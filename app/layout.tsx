import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parking Reservation System",
  description: "Frontend Task — Gate, Checkpoint, Admin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
