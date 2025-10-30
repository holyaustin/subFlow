"use client";

import React, { useEffect, useState } from "react";
import { useAccount, useWatchContractEvent } from "wagmi";
import { useFetchUserSubscriptions } from "@/lib/hooks";
import { SUBFLOW_CONTRACT } from "@/lib/contract";
import SubscriptionCard from "@/components/SubscriptionCard";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

/**
 * Normalized subscription object
 */
interface Subscription {
  id: number;
  subscriber: string;
  recipient: string;
  amountWei: bigint;
  amountFlow: number;
  frequency: number;
  nextPayment: number;
  balanceWei: bigint;
  balanceFlow: number;
  active: boolean;
}

function normalizeTuple(id: number, tuple: any): Subscription {
  const subscriber = String(tuple[0] ?? "");
  const recipient = String(tuple[1] ?? "");
  const amountWei = BigInt(tuple[2] ?? 0n);
  const frequency = Number(tuple[3] ?? 0);
  const nextPayment = Number(tuple[4] ?? 0);
  const balanceWei = BigInt(tuple[5] ?? 0n);
  const active = Boolean(tuple[6]);

  return {
    id,
    subscriber,
    recipient,
    amountWei,
    amountFlow: Number(amountWei) / 1e18,
    frequency,
    nextPayment,
    balanceWei,
    balanceFlow: Number(balanceWei) / 1e18,
    active,
  };
}

function buildActivityChart(subs: Subscription[]) {
  const grouped: Record<string, { count: number; sum: number }> = {};
  subs.forEach((s) => {
    const ts = s.nextPayment && s.nextPayment > 0 ? s.nextPayment : Math.floor(Date.now() / 1000);
    const dateStr = new Date(ts * 1000).toLocaleDateString();
    if (!grouped[dateStr]) grouped[dateStr] = { count: 0, sum: 0 };
    grouped[dateStr].count += 1;
    grouped[dateStr].sum += s.amountFlow;
  });
  const arr = Object.entries(grouped).map(([date, v]) => ({
    date,
    count: v.count,
    amount: Number(v.sum.toFixed(6)),
  }));
  arr.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return arr;
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { fetchAll } = useFetchUserSubscriptions();
  const [items, setItems] = useState<Subscription[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // shorten wallet display
  const shortAddr =
    address && address.length > 10
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : address || "";

  useEffect(() => {
    if (!isConnected) {
      toast.error("Please connect your wallet first.");
      router.push("/");
    }
  }, [isConnected, router]);

  useEffect(() => {
    if (!isConnected || !address) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const list = await fetchAll();
        if (!mounted) return;
        if (!list || list.length === 0) {
          setItems([]);
          setActivityData([]);
          return;
        }
        const norm = list.map((it: any) => normalizeTuple(it.id, it.subscription));
        setItems(norm);
        setActivityData(buildActivityChart(norm));
      } catch (err) {
        console.error("fetchAll error", err);
        toast.error("Failed to fetch subscriptions");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [isConnected, address]);

  // listen for live updates
  useWatchContractEvent({
    address: SUBFLOW_CONTRACT.address,
    abi: SUBFLOW_CONTRACT.abi,
    eventName: "SubscriptionCreated",
    onLogs(logs) {
      logs.forEach((log: any) => {
        try {
          const args = log?.args ?? log;
          const id = Number(args?.id ?? args?.[0] ?? 0);
          const subscriber = String(args?.subscriber ?? args?.[1] ?? "");
          const recipient = String(args?.recipient ?? args?.[2] ?? "");
          const amountWei = BigInt(args?.amount ?? args?.[3] ?? 0n);
          const frequency = Number(args?.frequency ?? args?.[4] ?? 0);
          const nextPayment = Number(args?.nextPayment ?? args?.[5] ?? 0);
          const balanceWei = BigInt(args?.balance ?? args?.[6] ?? 0n);

          const newSub: Subscription = {
            id,
            subscriber,
            recipient,
            amountWei,
            amountFlow: Number(amountWei) / 1e18,
            frequency,
            nextPayment,
            balanceWei,
            balanceFlow: Number(balanceWei) / 1e18,
            active: true,
          };

          if (subscriber.toLowerCase() === address?.toLowerCase()) {
            setItems((prev) => {
              const next = [newSub, ...prev];
              setActivityData(buildActivityChart(next));
              return next;
            });
            toast.success("📡 New subscription created (live)!");
          }
        } catch (e) {
          console.error("event parse error", e);
        }
      });
    },
  });

  if (!isConnected) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto p-6"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard for{" "}
          <span className="text-red-600 font-mono">{shortAddr}</span>
        </h1>
        <p className="text-gray-500 mt-1">
          Monitor your subscription activity and payments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Cards */}
        <div className="space-y-4">
          {loading && (
            <div className="flex justify-center py-8 text-gray-500">
              <motion.div
                className="w-6 h-6 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"
                transition={{ repeat: Infinity }}
              />
              <span className="ml-2">Loading subscriptions...</span>
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="bg-white p-6 rounded shadow text-center text-gray-600">
              No subscriptions found.
            </div>
          )}

          {!loading &&
            items.map((s) => <SubscriptionCard key={s.id} id={s.id} data={s} />)}
        </div>

        {/* Right: Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            📊 Subscription Activity
          </h3>
          {activityData.length === 0 ? (
            <p className="text-gray-500 text-center">No activity yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: "#555" }} />
                <YAxis tick={{ fill: "#555" }} />
                <Tooltip />
                <Bar
                  dataKey="amount"
                  fill="#ef4444"
                  barSize={35}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </motion.div>
  );
}
