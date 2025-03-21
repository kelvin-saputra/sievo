import { Plus_Jakarta_Sans } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "sonner";
const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-Plus-Jakarta",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jakartaSans.className} bg-super-white`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
