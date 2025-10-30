"use client";

import "./globals.css";
import { WagmiProvider, createConfig, http } from "wagmi";
import { flowTestnet } from "viem/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useIsMounted } from "@/lib/hooks";

const queryClient = new QueryClient();

const config = createConfig({
  chains: [flowTestnet],
  transports: {
    [flowTestnet.id]: http(),
  },
  connectors: [
    injected(),
    walletConnect({ projectId: "095f374bd378a0011202d8c1e82b92d1" }),
  ],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mounted = useIsMounted();

  if (!mounted) return null;

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <Header />
            <AnimatePresence mode="wait">
              <motion.main
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex-grow"
              >
                {children}
              </motion.main>
            </AnimatePresence>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  borderRadius: "8px",
                  background: "#333",
                  color: "#fff",
                },
              }}
            />
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
