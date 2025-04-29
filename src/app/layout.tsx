import { Plus_Jakarta_Sans } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakartaSans.className}>
      <body className="bg-super-white">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
