"use client";
import React from "react";
import { useAccount, useConnect, useDisconnect, useBalance, useChainId, useSwitchChain } from "wagmi";
import { flowTestnet } from "@/lib/chains";

export default function ConnectWallet() {
  const { connect, connectors, status } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { data: balance } = useBalance({ address });

  const connector = connectors[0]; // MetaMask by default

  const handleConnect = async () => {
    try {
      await connect({ connector });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSwitch = () => {
    switchChain?.({ chainId: flowTestnet.id });
  };

  if (!isConnected) {
    return (
      <button
        onClick={handleConnect}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm bg-gray-100 px-3 py-1 rounded">
        {balance ? `${parseFloat(balance.formatted).toFixed(3)} ${balance.symbol}` : "…"}
      </div>
      <div className="text-sm bg-gray-100 px-3 py-1 rounded">{`${address?.slice(0, 6)}...${address?.slice(-4)}`}</div>
      {chainId !== flowTestnet.id && (
        <button onClick={handleSwitch} className="px-3 py-1 bg-yellow-500 text-white rounded">
          Switch Network
        </button>
      )}
      <button
        onClick={() => disconnect()}
        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Disconnect
      </button>
    </div>
  );
}
