import { defineChain } from "viem";

export const flowTestnet = defineChain({
  id: 545, // Flow EVM testnet chain ID
  name: "Flow EVM Testnet",
  nativeCurrency: {
    name: "FLOW",
    symbol: "FLOW",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.evm.nodes.onflow.org"],
    },
  },
  blockExplorers: {
    default: { name: "FlowScan", url: "https://evm-testnet.flowscan.io" },
  },
  testnet: true,
});
