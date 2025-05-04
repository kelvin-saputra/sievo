"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "sonner";
import Head from "next/head";
import AuthenticationContext from "@/models/context/auth-context";
import useAuthentication from "@/hooks/use-auth";
import Link from "next/link";
const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-Plus-Jakarta",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    user,
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
    handleAck,
    handleCheckToken,
  } = useAuthentication();

  return (
    <html lang="en">
      <Head>
        <title title="SIEVO: Sistem Informasi Event Organizer" />
        <meta
          name="description"
          content="SIEVO: Sistem Informasi Event Organizer PT Matahati Inspira"
        />
        <Link rel="icon" href={"/favicon.ico"} />
      </Head>
      <body className={`${jakartaSans.className} bg-super-white`}>
        <AuthenticationContext.Provider
          value={{
            user,
            loading: loading,
            handleLogin,
            handleRegister,
            handleLogout,
            handleAck,
            handleCheckToken,
          }}
        >
          {children}
        </AuthenticationContext.Provider>
        <Toaster />
      </body>
    </html>
  );
}
