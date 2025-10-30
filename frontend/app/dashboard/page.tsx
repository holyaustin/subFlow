"use client";

import React, { useEffect, useState } from "react";
import { useFetchUserSubscriptions } from "@/lib/hooks";
import { useAccount } from "wagmi";
import SubscriptionCard from "@/components/SubscriptionCard";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { fetchAll } = useFetchUserSubscriptions();
  const [items, setItems] = useState<Array<{ id: number; subscription: any }>>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Redirect if not connected
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
        if (mounted) setItems(list);
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

  if (!isConnected) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto p-4"
    >
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">My Subscriptions</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your active subscriptions — execute, top up, or cancel.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-8 text-gray-500">
          <motion.div
            className="w-6 h-6 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"
            transition={{ repeat: Infinity, ease: "linear" }}
          />
          <span className="ml-2">Loading subscriptions...</span>
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="bg-white p-6 rounded shadow text-center text-gray-600">
          No subscriptions found.
        </div>
      )}

      <div className="space-y-4">
        {items.map((it) => (
         <SubscriptionCard key={it.id} id={it.id} data={it.subscription} />

        ))}
      </div>
    </motion.div>
  );
}
