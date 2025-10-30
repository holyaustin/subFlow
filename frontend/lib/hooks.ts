"use client";

import {
  useAccount,
  useReadContract,
  useWriteContract,
  usePublicClient,
} from "wagmi";
import { SUBFLOW_CONTRACT } from "./contract";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import type { Address } from "viem";

/* -------------------------------------------------------------
 * 🧩 useIsMounted — prevent hydration mismatch
 * ------------------------------------------------------------- */
export function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/* -------------------------------------------------------------
 * 🔥 Shared Transaction Hook
 * ------------------------------------------------------------- */
export function useTransaction() {
  const [loading, setLoading] = useState(false);

  const runTx = async (fn: () => Promise<any>, successMsg: string) => {
    try {
      setLoading(true);
      toast.loading("Transaction pending...", { id: "tx" });
      const tx = await fn();
      const receipt = await tx?.wait?.();
      if (receipt?.status === "success" || receipt?.status === 1) {
        toast.success(successMsg, { id: "tx" });
      } else {
        toast.error("Transaction reverted!", { id: "tx" });
      }
    } catch (err: any) {
      console.error("Transaction failed:", err);
      toast.error("Transaction failed to send!", { id: "tx" });
    } finally {
      setLoading(false);
    }
  };

  return { runTx, loading };
}

/* -------------------------------------------------------------
 * 🔍 Read Hooks (Wagmi v2 syntax)
 * ------------------------------------------------------------- */

export function useNextId() {
  return useReadContract({
    address: SUBFLOW_CONTRACT.address as Address,
    abi: SUBFLOW_CONTRACT.abi,
    functionName: "nextId",
  });
}

export function useGetSubscription(id?: number | bigint) {
  const enabled = id !== undefined;
  return useReadContract({
    address: SUBFLOW_CONTRACT.address as Address,
    abi: SUBFLOW_CONTRACT.abi,
    functionName: "getSubscription",
    args: enabled ? [BigInt(id!)] : undefined,
    // Wagmi v2 doesn’t have “enabled”; you handle logic outside
  });
}

/* -------------------------------------------------------------
 * 🧭 Fetch all user subscriptions via publicClient
 * ------------------------------------------------------------- */
export function useFetchUserSubscriptions() {
  const publicClient = usePublicClient();
  const { address } = useAccount();

  async function fetchAll() {
    if (!address || !publicClient) return [];
    const nextIdRes = await publicClient.readContract({
      address: SUBFLOW_CONTRACT.address as Address,
      abi: SUBFLOW_CONTRACT.abi,
      functionName: "nextId",
    });
    const nextId = Number(nextIdRes as bigint);
    const result: any[] = [];

    for (let i = 1; i < nextId; i++) {
      try {
        const sub = await publicClient.readContract({
          address: SUBFLOW_CONTRACT.address as Address,
          abi: SUBFLOW_CONTRACT.abi,
          functionName: "getSubscription",
          args: [BigInt(i)],
        });
        const subscriber = (sub as any)[0] as string;
        if (subscriber.toLowerCase() === address.toLowerCase()) {
          result.push({ id: i, subscription: sub });
        }
      } catch {
        // ignore failed reads
      }
    }
    return result;
  }

  return { fetchAll };
}

/* -------------------------------------------------------------
 * ✍️ Write Hooks (with Transaction Feedback)
 * ------------------------------------------------------------- */
function useWriteWithTx(functionName: string) {
  const { writeContractAsync, ...rest } = useWriteContract();
  const tx = useTransaction();

  async function safeWrite(config: any) {
    return await writeContractAsync({
      address: SUBFLOW_CONTRACT.address as Address,
      abi: SUBFLOW_CONTRACT.abi,
      functionName,
      ...config,
    });
  }

  return { writeContractAsync: safeWrite, ...rest, ...tx };
}

/* ---------- User-facing functions ---------- */
export function useCreateSubscription() {
  return useWriteWithTx("createSubscription");
}
export function useTopUp() {
  return useWriteWithTx("topUp");
}
export function useExecutePayment() {
  return useWriteWithTx("executePayment");
}
export function useCancelSubscription() {
  return useWriteWithTx("cancelSubscription");
}

/* ---------- Admin functions ---------- */
export function useAddExecutor() {
  return useWriteWithTx("addExecutor");
}
export function useRemoveExecutor() {
  return useWriteWithTx("removeExecutor");
}
export function usePause() {
  return useWriteWithTx("pause");
}
export function useUnpause() {
  return useWriteWithTx("unpause");
}
export function useRescueNative() {
  return useWriteWithTx("rescueNative");
}
export function useTransferOwnership() {
  return useWriteWithTx("transferOwnership");
}
