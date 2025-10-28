// lib/hooks.ts
"use client";

import { useAccount, useContractRead, useContractWrite, usePublicClient } from "wagmi";
import { SUBFLOW_CONTRACT } from "./contract";
import { parseEther } from "viem";

export function useNextId() {
  return useContractRead({
    address: SUBFLOW_CONTRACT.address,
    abi: SUBFLOW_CONTRACT.abi,
    functionName: "nextId",
    watch: false,
  });
}

export function useGetSubscription(id?: number | bigint) {
  return useContractRead({
    address: SUBFLOW_CONTRACT.address,
    abi: SUBFLOW_CONTRACT.abi,
    functionName: "getSubscription",
    args: id !== undefined ? [BigInt(id as number)] : undefined,
    enabled: id !== undefined,
  });
}

/**
 * fetchUserSubscriptions - usePublicClient-based helper to read all subscriptions for the connected account
 * NOTE: Client-side only. This loops from 1..nextId-1 and is OK for test/demo. For production use an indexer.
 */
export function useFetchUserSubscriptions() {
  const publicClient = usePublicClient();
  const { address } = useAccount();

  async function fetchAll() {
    if (!address) return [];
    // read nextId
    const nextIdRes = await publicClient.readContract({
      address: SUBFLOW_CONTRACT.address,
      abi: SUBFLOW_CONTRACT.abi,
      functionName: "nextId",
    });
    const nextId = Number(nextIdRes as bigint);
    const result: Array<{ id: number; subscription: any }> = [];

    for (let i = 1; i < nextId; i++) {
      try {
        const sub = await publicClient.readContract({
          address: SUBFLOW_CONTRACT.address,
          abi: SUBFLOW_CONTRACT.abi,
          functionName: "getSubscription",
          args: [BigInt(i)],
        });
        const subscriber = (sub as any)[0] as string;
        if (subscriber.toLowerCase() === address?.toLowerCase()) {
          result.push({ id: i, subscription: sub });
        }
      } catch (err) {
        // ignore missing / reverted id
      }
    }
    return result;
  }

  return { fetchAll };
}

/* ========== Write hooks ========== */
export function useCreateSubscription() {
  return useContractWrite({
    address: SUBFLOW_CONTRACT.address,
    abi: SUBFLOW_CONTRACT.abi,
    functionName: "createSubscription",
  });
}

export function useTopUp() {
  return useContractWrite({
    address: SUBFLOW_CONTRACT.address,
    abi: SUBFLOW_CONTRACT.abi,
    functionName: "topUp",
  });
}

export function useExecutePayment() {
  return useContractWrite({
    address: SUBFLOW_CONTRACT.address,
    abi: SUBFLOW_CONTRACT.abi,
    functionName: "executePayment",
  });
}

export function useCancelSubscription() {
  return useContractWrite({
    address: SUBFLOW_CONTRACT.address,
    abi: SUBFLOW_CONTRACT.abi,
    functionName: "cancelSubscription",
  });
}

/* admin */
export function useAddExecutor() {
  return useContractWrite({ address: SUBFLOW_CONTRACT.address, abi: SUBFLOW_CONTRACT.abi, functionName: "addExecutor" });
}
export function useRemoveExecutor() {
  return useContractWrite({ address: SUBFLOW_CONTRACT.address, abi: SUBFLOW_CONTRACT.abi, functionName: "removeExecutor" });
}
export function usePause() {
  return useContractWrite({ address: SUBFLOW_CONTRACT.address, abi: SUBFLOW_CONTRACT.abi, functionName: "pause" });
}
export function useUnpause() {
  return useContractWrite({ address: SUBFLOW_CONTRACT.address, abi: SUBFLOW_CONTRACT.abi, functionName: "unpause" });
}
export function useRescueNative() {
  return useContractWrite({ address: SUBFLOW_CONTRACT.address, abi: SUBFLOW_CONTRACT.abi, functionName: "rescueNative" });
}
export function useTransferOwnership() {
  return useContractWrite({ address: SUBFLOW_CONTRACT.address, abi: SUBFLOW_CONTRACT.abi, functionName: "transferOwnership" });
}
