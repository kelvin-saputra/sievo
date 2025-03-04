import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar"; // Import the provider
import { AppSidebar } from "@/components/common/app-sidebar";
import { Toaster } from "@/components/ui/sonner";

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
    <html lang="en">
      <body className={`${jakartaSans.variable} flex h-screen w-screen`}>
        <SidebarProvider>
          <AppSidebar />
          {/* Main content area should take full width & height */}
          <main className="flex-1 h-full w-full overflow-auto bg-gray-100 p-6">
            {children}
          </main>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
