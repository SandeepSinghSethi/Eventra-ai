import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eventra | Expert Celebration & Event Planner",
  description:
    "Plan weddings, birthdays, and community events with AI budget optimization, backward timelines, vendor checklists, and personalized themes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased selection:bg-[#7A3E9D]/20">
        {children}
      </body>
    </html>
  );
}
