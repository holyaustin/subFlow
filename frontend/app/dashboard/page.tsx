// app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useFetchUserSubscriptions } from "@/lib/hooks";
import { useAccount } from "wagmi";
import SubscriptionCard from "@/components/SubscriptionCard";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { fetchAll } = useFetchUserSubscriptions();
  const [items, setItems] = useState<Array<{ id: number; subscription: any }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) {
      setItems([]);
      return;
    }
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const list = await fetchAll();
        if (mounted) setItems(list);
      } catch (err) {
        console.error("fetchAll error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [isConnected, address]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">My Subscriptions</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your active subscriptions — execute, top up, or cancel.</p>
      </div>

      {!isConnected && (
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-gray-600">Connect your wallet to view subscriptions.</p>
        </div>
      )}

      {isConnected && loading && <div>Loading subscriptions…</div>}

      {isConnected && !loading && items.length === 0 && (
        <div className="bg-white p-6 rounded shadow text-center">No subscriptions found.</div>
      )}

      <div className="space-y-4">
        {items.map((it) => (
          <SubscriptionCard key={it.id} id={it.id} subscription={it.subscription} />
        ))}
      </div>
    </div>
  );
}
