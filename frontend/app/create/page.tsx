"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseEther } from "viem";
import { useCreateSubscription } from "@/lib/hooks";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

const schema = z.object({
  recipient: z.string().min(42, "Enter a valid address"),
  amount: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Amount must be > 0"),
  deposit: z.string().refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Deposit must be ≥ 0"),
  interval: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Interval must be > 0"),
  unit: z.enum(["seconds", "minutes", "hours", "days", "weeks", "months", "years"]),
});

type FormData = z.infer<typeof schema>;

export default function CreatePage() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const create = useCreateSubscription();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { unit: "days" },
  });

  useEffect(() => {
    if (!isConnected) {
      toast.error("Please connect your wallet first.");
      router.push("/");
    }
  }, [isConnected, router]);

  const unitToSeconds = {
    seconds: 1,
    minutes: 60,
    hours: 3600,
    days: 86400,
    weeks: 604800,
    months: 2592000,
    years: 31536000,
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const amountWei = parseEther(data.amount);
      const depositWei = parseEther(data.deposit);
      const frequencySeconds = BigInt(Number(data.interval) * unitToSeconds[data.unit]);

      toast.loading("Creating subscription...", { id: "tx" });

      // ✅ Build config dynamically to avoid TS error
      const config: any = {
        args: [data.recipient, amountWei, frequencySeconds],
      };

      if (depositWei > 0n) config.value = depositWei;

      // ✅ Wagmi v2 call
      const txHash = await create.writeContractAsync?.(config);

      if (txHash) {
        toast.success("Subscription created successfully!", { id: "tx" });
        console.log("TX Hash:", txHash);
        reset();
      } else {
        toast.error("Transaction failed to send!", { id: "tx" });
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Error: " + (err?.shortMessage || err?.message || "Unknown"), { id: "tx" });
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">Create Subscription</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Recipient</label>
          <input
            {...register("recipient")}
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            placeholder="0xRecipient..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Amount (FLOW)</label>
          <input
            {...register("amount")}
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            placeholder="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Initial Deposit (FLOW)</label>
          <input
            {...register("deposit")}
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            placeholder="0.05"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Payment Frequency</label>
          <div className="flex gap-2">
            <input
              {...register("interval")}
              type="number"
              className="w-1/2 border rounded px-3 py-2"
              placeholder="e.g. 3"
            />
            <select {...register("unit")} className="w-1/2 border rounded px-3 py-2">
              <option value="seconds">Seconds</option>
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={formState.isSubmitting || loading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex justify-center items-center gap-2"
        >
          {loading ? (
            <motion.div
              className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"
              transition={{ repeat: Infinity, ease: "linear" }}
            />
          ) : (
            "Create Subscription"
          )}
        </button>
      </form>
    </motion.div>
  );
}
