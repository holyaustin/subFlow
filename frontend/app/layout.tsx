// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WagmiConfigProvider } from "@/lib/wagmi";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "subFlow",
  description: "Subscription management dApp on Flow EVM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isHome = typeof window !== "undefined" && window.location.pathname === "/";

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 flex flex-col min-h-screen`}>
        <WagmiConfigProvider>
          <Header />
          <main className={`flex-grow ${isHome ? "overflow-hidden" : ""}`}>{children}</main>
          <Footer />
        </WagmiConfigProvider>
      </body>
    </html>
  );
}
