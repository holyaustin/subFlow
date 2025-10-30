"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useAddExecutor, useRemoveExecutor, useRescueNative, usePause, useUnpause, useTransferOwnership } from "@/lib/hooks";
import { SUBFLOW_CONTRACT } from "@/lib/contract";
import { motion } from "framer-motion";

export default function AdminPage() {
  const [executorAddr, setExecutorAddr] = useState("");
  const [rescueAmount, setRescueAmount] = useState("");
  const [newOwner, setNewOwner] = useState("");

  const addExecutor = useAddExecutor();
  const removeExecutor = useRemoveExecutor();
  const rescue = useRescueNative();
  const pause = usePause();
  const unpause = useUnpause();
  const transferOwnership = useTransferOwnership();

  const handleTx = async (fn: () => Promise<any>, msg: string) => {
    try {
      toast.loading("Processing...", { id: "tx" });
      const tx = await fn();
      const receipt = await tx?.wait?.();
      if (receipt?.status === "success" || receipt?.status === 1) {
        toast.success(msg, { id: "tx" });
      } else {
        toast.error("Transaction failed!", { id: "tx" });
      }
    } catch (err: any) {
      console.error("TX failed", err);
      toast.error("Error: " + (err?.shortMessage || err?.message), { id: "tx" });
    }
  };

  // ✅ Fixed calls below:
  const onAddExecutor = async () => {
    if (!executorAddr) return toast.error("Enter executor address");
    await handleTx(
      () =>
        addExecutor.writeContractAsync({
          address: SUBFLOW_CONTRACT.address,
          abi: SUBFLOW_CONTRACT.abi,
          functionName: "addExecutor",
          args: [executorAddr],
        }),
      "Executor added!"
    );
  };

  const onRemoveExecutor = async () => {
    if (!executorAddr) return toast.error("Enter executor address");
    await handleTx(
      () =>
        removeExecutor.writeContractAsync({
          address: SUBFLOW_CONTRACT.address,
          abi: SUBFLOW_CONTRACT.abi,
          functionName: "removeExecutor",
          args: [executorAddr],
        }),
      "Executor removed!"
    );
  };

  const onRescue = async () => {
    await handleTx(
      () =>
        rescue.writeContractAsync({
          address: SUBFLOW_CONTRACT.address,
          abi: SUBFLOW_CONTRACT.abi,
          functionName: "rescueNative",
          args: [BigInt(rescueAmount || "0")],
        }),
      "Native token rescued!"
    );
  };

  const onPause = async () => {
    await handleTx(
      () =>
        pause.writeContractAsync({
          address: SUBFLOW_CONTRACT.address,
          abi: SUBFLOW_CONTRACT.abi,
          functionName: "pause",
        }),
      "Contract paused!"
    );
  };

  const onUnpause = async () => {
    await handleTx(
      () =>
        unpause.writeContractAsync({
          address: SUBFLOW_CONTRACT.address,
          abi: SUBFLOW_CONTRACT.abi,
          functionName: "unpause",
        }),
      "Contract unpaused!"
    );
  };

  const onTransferOwnership = async () => {
    if (!newOwner) return toast.error("Enter new owner address");
    await handleTx(
      () =>
        transferOwnership.writeContractAsync({
          address: SUBFLOW_CONTRACT.address,
          abi: SUBFLOW_CONTRACT.abi,
          functionName: "transferOwnership",
          args: [newOwner],
        }),
      "Ownership transferred!"
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-6 mt-10"
    >
      <h2 className="text-2xl font-semibold mb-4">Admin Controls</h2>

      {/* Executor Management */}
      <div className="space-y-3">
        <input
          value={executorAddr}
          onChange={(e) => setExecutorAddr(e.target.value)}
          placeholder="Executor address"
          className="w-full border px-3 py-2 rounded"
        />
        <div className="flex gap-2">
          <button onClick={onAddExecutor} className="bg-green-600 text-white px-3 py-1 rounded">
            Add Executor
          </button>
          <button onClick={onRemoveExecutor} className="bg-red-600 text-white px-3 py-1 rounded">
            Remove Executor
          </button>
        </div>
      </div>

      {/* Pause / Unpause */}
      <div className="flex gap-2">
        <button onClick={onPause} className="bg-yellow-600 text-white px-3 py-1 rounded">
          Pause
        </button>
        <button onClick={onUnpause} className="bg-blue-600 text-white px-3 py-1 rounded">
          Unpause
        </button>
      </div>

      {/* Rescue Native */}
      <div className="space-y-3">
        <input
          value={rescueAmount}
          onChange={(e) => setRescueAmount(e.target.value)}
          placeholder="Rescue amount (wei)"
          className="w-full border px-3 py-2 rounded"
        />
        <button onClick={onRescue} className="bg-purple-600 text-white px-3 py-1 rounded">
          Rescue Native
        </button>
      </div>

      {/* Transfer Ownership */}
      <div className="space-y-3">
        <input
          value={newOwner}
          onChange={(e) => setNewOwner(e.target.value)}
          placeholder="New owner address"
          className="w-full border px-3 py-2 rounded"
        />
        <button onClick={onTransferOwnership} className="bg-gray-800 text-white px-3 py-1 rounded">
          Transfer Ownership
        </button>
      </div>
    </motion.div>
  );
}
