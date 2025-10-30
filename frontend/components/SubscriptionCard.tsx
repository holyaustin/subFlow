"use client";

import React, { useState } from "react";
import { parseEther } from "viem";
import { toast } from "react-hot-toast";
import { useTopUp, useExecutePayment, useCancelSubscription } from "@/lib/hooks";
import { SUBFLOW_CONTRACT } from "@/lib/contract";

export default function SubscriptionCard({ id, data }: { id: number; data: any }) {
  const topUpWrite = useTopUp();
  const execWrite = useExecutePayment();
  const cancelWrite = useCancelSubscription();
  const [loading, setLoading] = useState(false);

  const handleTx = async (fn: () => Promise<any>, msg: string) => {
    try {
      setLoading(true);
      toast.loading("Processing...", { id: "tx" });
      const tx = await fn();
      const receipt = await tx?.wait?.();
      if (receipt?.status === "success" || receipt?.status === 1) {
        toast.success(msg, { id: "tx" });
      } else {
        toast.error("Transaction reverted!", { id: "tx" });
      }
    } catch (err: any) {
      console.error("TX failed", err);
      toast.error(err?.shortMessage || err?.message || "Transaction failed!", { id: "tx" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fixed Top Up handler
  const onTopUp = async () => {
    try {
      const value = parseEther(data.amount) as bigint;
      await handleTx(
        () =>
          topUpWrite.writeContractAsync({
            address: SUBFLOW_CONTRACT.address,
            abi: SUBFLOW_CONTRACT.abi,
            functionName: "topUp",
            args: [BigInt(id)],
            value,
          }),
        "Top up successful!"
      );
    } catch (err: any) {
      toast.error("TopUp failed!");
    }
  };

  // ✅ Execute payment handler
  const onExecute = async () => {
    await handleTx(
      () =>
        execWrite.writeContractAsync({
          address: SUBFLOW_CONTRACT.address,
          abi: SUBFLOW_CONTRACT.abi,
          functionName: "executePayment",
          args: [BigInt(id)],
        }),
      "Payment executed!"
    );
  };

  // ✅ Cancel handler
  const onCancel = async () => {
    await handleTx(
      () =>
        cancelWrite.writeContractAsync({
          address: SUBFLOW_CONTRACT.address,
          abi: SUBFLOW_CONTRACT.abi,
          functionName: "cancelSubscription",
          args: [BigInt(id)],
        }),
      "Subscription cancelled!"
    );
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h3 className="text-lg font-semibold mb-2">Subscription #{id}</h3>
      <p className="text-gray-600">Amount: {data.amount}</p>
      <p className="text-gray-600">Receiver: {data.receiver}</p>
      <div className="mt-4 flex gap-3">
        <button
          onClick={onTopUp}
          disabled={loading}
          className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Top Up
        </button>
        <button
          onClick={onExecute}
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Execute
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
