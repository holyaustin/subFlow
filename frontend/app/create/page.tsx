// app/create/page.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  recipient: z.string().min(42, "Invalid address"),
  amount: z.number().positive("Amount must be > 0"),
  frequency: z.number().min(60, "Minimum frequency is 60 seconds"),
});

type FormData = z.infer<typeof schema>;

export default function CreatePage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    console.log("Creating subscription:", data);
    // Add smart contract call here
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">
          Create Subscription
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Recipient Address</label>
            <input
              {...register("recipient")}
              placeholder="0x..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.recipient && (
              <p className="text-red-500 text-sm mt-1">{errors.recipient.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Amount (in Wei)</label>
            <input
              type="number"
              {...register("amount", { valueAsNumber: true })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Frequency (seconds)
            </label>
            <input
              type="number"
              {...register("frequency", { valueAsNumber: true })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.frequency && (
              <p className="text-red-500 text-sm mt-1">{errors.frequency.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold"
          >
            {isSubmitting ? "Creating..." : "Create Subscription"}
          </button>
        </form>
      </div>
    </section>
  );
}
