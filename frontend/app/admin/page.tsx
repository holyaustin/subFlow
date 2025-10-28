// app/admin/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";

const ADMIN_ADDRESS = "0x2c3b2B2325610a6814f2f822D0bF4DAB8CF16e16".toLowerCase();

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (address && isConnected) {
      setIsAdmin(address.toLowerCase() === ADMIN_ADDRESS);
    }
  }, [address, isConnected]);

  if (!isConnected) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
        <p className="text-lg text-gray-700">🔐 Please connect your wallet to continue.</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-lg bg-white rounded-xl shadow-lg p-6 text-center"
        >
          <h2 className="text-2xl font-semibold text-red-600 mb-3">Access Denied</h2>
          <p className="text-gray-700">
            You are not authorized to view this page. Only the admin wallet can access this section.
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-6">
          Admin Dashboard
        </h1>
        <p className="text-gray-700 text-lg text-center mb-8">
          Welcome, Admin! You can manage SubFlow settings, oversee payments, and monitor system logs here.
        </p>

        {/* Example Admin Controls */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-gray-100 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-red-600 mb-2">Subscription Overview</h3>
            <p className="text-gray-600">Monitor active subscriptions, users, and top-ups.</p>
          </div>

          <div className="bg-gray-100 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">System Settings</h3>
            <p className="text-gray-600">Adjust payment intervals or contract parameters securely.</p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
