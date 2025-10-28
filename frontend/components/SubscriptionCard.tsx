// components/SubscriptionCard.tsx
"use client";

import React from "react";

interface Props {
  sub: {
    id: number;
    recipient: string;
    amount: string;
    frequency: string;
    nextPayment: string;
    balance: string;
    active: boolean;
  };
}

export default function SubscriptionCard({ sub }: Props) {
  const handleTopUp = () => alert(`Top up ${sub.id}`);
  const handleExecute = () => alert(`Execute ${sub.id}`);
  const handleCancel = () => alert(`Cancel ${sub.id}`);

  return (
    <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-all flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-red-600 mb-2">
          Subscription #{sub.id}
        </h3>
        <p className="text-gray-600 text-sm break-all">
          Recipient: <span className="font-mono">{sub.recipient}</span>
        </p>
        <p className="text-gray-600 text-sm">Amount: {sub.amount} ETH</p>
        <p className="text-gray-600 text-sm">Next: {sub.nextPayment}</p>
        <p className="text-gray-600 text-sm">Balance: {sub.balance} ETH</p>
        <p className="text-gray-600 text-sm">
          Status:{" "}
          <span
            className={`font-semibold ${
              sub.active ? "text-green-600" : "text-gray-400"
            }`}
          >
            {sub.active ? "Active" : "Cancelled"}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap justify-between gap-2 mt-4">
        <button
          onClick={handleTopUp}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm"
        >
          Top Up
        </button>
        <button
          onClick={handleExecute}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm"
        >
          Execute
        </button>
        <button
          onClick={handleCancel}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
