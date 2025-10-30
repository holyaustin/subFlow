"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { SUBFLOW_CONTRACT } from "@/lib/contract";
import { useTopUp, useExecutePayment, useCancelSubscription } from "@/lib/hooks";
import { parseEther } from "viem";

/**
 * Props: id (number) and data = normalized Subscription
 */
export default function SubscriptionCard({ id, data }: { id: number; data: any }) {
  const topUpHook = useTopUp();
  const execHook = useExecutePayment();
  const cancelHook = useCancelSubscription();
  const [loading, setLoading] = useState(false);

  const handleTx = async (executor: () => Promise<any>, successMsg: string) => {
    try {
      setLoading(true);
      toast.loading("Transaction pending...", { id: "tx" });
      const res = await executor();
      // wagmi v2 write hook returns writeContractAsync result (WriteContractResult)
      // some wallets/providers return a tx hash object — show success when returned
      if (res) {
        toast.success(successMsg, { id: "tx" });
      } else {
        toast.error("Transaction did not return a result", { id: "tx" });
      }
    } catch (err: any) {
      console.error("tx error", err);
      toast.error(err?.shortMessage || err?.message || "Transaction failed", { id: "tx" });
    } finally {
      setLoading(false);
    }
  };

  // TopUp: ask user for amount in FLOW and send as value
  const onTopUp = async () => {
    const input = prompt("Top up amount (in FLOW)", String(data?.amountFlow ?? "0.01"));
    if (!input) return;
    const n = Number(input);
    if (isNaN(n) || n <= 0) return toast.error("Invalid amount");
    const value = BigInt(Math.floor(n * 1e18));
    await handleTx(
      () =>
        topUpHook.writeContractAsync({
          address: SUBFLOW_CONTRACT.address,
          abi: SUBFLOW_CONTRACT.abi,
          functionName: "topUp",
          args: [BigInt(id)],
          value,
        }),
      "Top up successful"
    );
  };

  const onExecute = async () => {
    await handleTx(
      () =>
        execHook.writeContractAsync({
          address: SUBFLOW_CONTRACT.address,
          abi: SUBFLOW_CONTRACT.abi,
          functionName: "executePayment",
          args: [BigInt(id)],
        }),
      "Payment executed"
    );
  };

  const onCancel = async () => {
    if (!confirm("Cancel subscription and refund remaining balance?")) return;
    await handleTx(
      () =>
        cancelHook.writeContractAsync({
          address: SUBFLOW_CONTRACT.address,
          abi: SUBFLOW_CONTRACT.abi,
          functionName: "cancelSubscription",
          args: [BigInt(id)],
        }),
      "Subscription cancelled"
    );
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-md">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-red-600">Subscription #{id}</h3>
        <span className={`text-sm font-medium ${data.active ? "text-green-600" : "text-gray-400"}`}>
          {data.active ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="mt-2 text-sm text-gray-700">
        <div><span className="font-medium">Amount:</span> {typeof data.amountFlow === "number" ? data.amountFlow : "—"} FLOW</div>
        <div><span className="font-medium">Receiver:</span> {data.recipient ?? "—"}</div>
        <div><span className="font-medium">Next Payment:</span> {data.nextPayment && data.nextPayment > 0 ? new Date(data.nextPayment * 1000).toLocaleString() : "—"}</div>
        <div><span className="font-medium">Balance:</span> {typeof data.balanceFlow === "number" ? data.balanceFlow : "—"} FLOW</div>
      </div>

      <div className="mt-4 flex gap-3">
        <button onClick={onTopUp} disabled={loading} className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-50">Top Up</button>
        <button onClick={onExecute} disabled={loading} className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50">Execute Repayment</button>
        <button onClick={onCancel} disabled={loading} className="px-3 py-1 rounded bg-red-600 text-white disabled:opacity-50">Cancel</button>
      </div>
    </div>
  );
}
