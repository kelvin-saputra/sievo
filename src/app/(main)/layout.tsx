import "@/app/globals.css";
import { Footer } from "@/components/common/footer";
import { SidebarApp } from "@/components/common/sidebar-app";
import { BreadcrumbApp } from "@/components/common/breadcrumb-nav";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarProvider>
        <SidebarApp />
        <SidebarInset className="flex flex-col">
          <header className="flex h-11 items-center gap-2 border-b px-4 fixed w-screen bg-super-white">
            <SidebarTrigger className="-ml-1" />
            <BreadcrumbApp />
          </header>
          <main className="mt-16">
            {children}
          </main>
          <footer className="bg-background">
            <Footer />
          </footer>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
