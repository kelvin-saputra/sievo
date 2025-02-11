import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-Plus-Jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIEVO: Sistem Informasi Event Organizer",
  description: "SIEVO: Sistem Informasi Event Organizer PT Matahati Inspira",
  icons: [{ url: "/favicon.ico", rel: "icon" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakartaSans.className}`}>
        {children}
      </body>
    </html>
  );
}
