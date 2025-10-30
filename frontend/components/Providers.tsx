"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { flowTestnet } from "viem/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
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

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mounted = useIsMounted();

  if (!mounted) return null;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-grow"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
