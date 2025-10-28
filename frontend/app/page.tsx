"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useConnect } from "wagmi";

export default function HomePage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  useEffect(() => {
    if (isConnected) router.push("/dashboard");
  }, [isConnected, router]);

  const connectWallet = async () => {
    try {
      await connect({ connector: connectors[0] });
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] overflow-hidden text-center bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-lg px-4">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4">Welcome to SubFlow</h1>
        <p className="text-gray-600 mb-6 text-lg">
          Automate your on-chain payments and subscriptions seamlessly on Flow EVM using
          Forte Workflows.
        </p>
        <button
          onClick={connectWallet}
          className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700 transition"
        >
          {isConnected ? "Enter App" : "Connect Wallet"}
        </button>
      </div>
    </main>
  );
}
