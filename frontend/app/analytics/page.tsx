// app/analytics/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
          📊 SubFlow Analytics
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          Gain deep insights into subscription trends, top-ups, and payment flows powered by{" "}
          <span className="font-semibold text-red-600">Dune Analytics</span>.
        </p>

        {/* Responsive Iframe for Dune Analytics */}
        <div className="relative w-full overflow-hidden rounded-xl shadow-lg" style={{ paddingTop: "56.25%" }}>
          <iframe
            src="https://dune.com/embeds/YOUR_DUNE_IFRAME_URL"
            title="SubFlow Analytics Dashboard"
            className="absolute top-0 left-0 w-full h-full border-0 rounded-xl"
            allowFullScreen
          ></iframe>
        </div>
      </motion.div>
    </main>
  );
}
