"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { metaMask } from "wagmi/connectors";
import { flowTestnet } from "@/lib/chains";
import toast from "react-hot-toast";
import { useIsMounted } from "@/lib/hooks";

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  // ✅ useBalance now uses `query` for refetch interval or enabled flags
  const { data: balance } = useBalance({
    address: address as `0x${string}`,
    query: {
      enabled: !!address,
      refetchInterval: 5000, // refetch every 5 seconds
    },
  });

  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const router = useRouter();
  const mounted = useIsMounted();

  // 🧩 Prevent hydration mismatch
  if (!mounted) {
    return <div className="w-[120px] h-[36px] bg-gray-200 rounded-md animate-pulse" />;
  }

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.success("Wallet disconnected 👋");
      router.push("/");
    } catch (err) {
      console.error("Error disconnecting:", err);
      toast.error("Error disconnecting");
    }
  };

  const handleConnect = async () => {
    try {
      await connect({ connector: metaMask() });
    } catch (e) {
      console.error("connect error", e);
      toast.error("Failed to connect");
    }
  };

  const handleSwitch = async () => {
    try {
      await switchChain?.({ chainId: flowTestnet.id });
    } catch (e) {
      console.error("switch error", e);
      toast.error("Failed to switch network");
    }
  };

  if (!isConnected) {
    return (
      <button
        onClick={handleConnect}
        className="px-4 py-2 bg-white text-red-600 rounded-md font-semibold"
      >
        Connect Wallet
      </button>
    );
  }

  const short = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  return (
    <div className="flex items-center gap-3">
      {/* Balance */}
      <div className="bg-white px-3 py-1 rounded-md" title="Balance">
        <span className="text-xs font-medium text-black">
          {balance ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}` : "—"}
        </span>
      </div>

      {/* Address */}
      <div className="bg-white px-3 py-1 rounded-md" title="Connected address">
        <span className="text-xs font-medium text-black">{short}</span>
      </div>

      {/* Chain check */}
      {chainId !== flowTestnet.id && (
        <button
          onClick={handleSwitch}
          className="px-2 py-1 bg-yellow-300 text-black rounded-md text-xs"
        >
          Switch Network
        </button>
      )}

      {/* Disconnect */}
      <button
        onClick={handleDisconnect}
        className="px-3 py-1 bg-black text-white rounded-md text-xs"
      >
        Disconnect
      </button>
    </div>
  );
}
