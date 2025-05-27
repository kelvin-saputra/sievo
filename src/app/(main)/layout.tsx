"use client"

import "@/app/globals.css";
import { Footer } from "@/components/common/footer";
import { SidebarApp } from "@/components/common/sidebar-app";
import { BreadcrumbApp } from "@/components/common/breadcrumb-nav";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useSafeContext } from "@/hooks/use-safe-context";
import AuthenticationContext from "@/models/context/auth-context";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { handleLogout } = useSafeContext(AuthenticationContext, "AuthenticationContext")
  const pathName = usePathname();
  return (
    <>
      <SidebarProvider>
        <SidebarApp onLogout={handleLogout}  />
        <SidebarInset className="flex flex-col">
          <BreadcrumbApp />
          <main className={`${pathName !== "/"?"mt-11":""}`}>{children}</main>
          <footer className="bg-background">
            <Footer />
          </footer>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
