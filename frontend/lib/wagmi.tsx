"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { flowTestnet } from "./chains";
import { metaMask } from "wagmi/connectors";

const queryClient = new QueryClient();

const config = createConfig({
  chains: [flowTestnet],
  connectors: [metaMask()],
  transports: {
    [flowTestnet.id]: http(flowTestnet.rpcUrls.default.http[0]),
  },
});

export function WagmiConfigProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
