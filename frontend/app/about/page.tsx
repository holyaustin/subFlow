// app/about/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-gray-50 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl space-y-10"
      >
        {/* Section 1: About the Project */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
            About <span className="text-red-600">subFlow</span>
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            <span className="text-red-600 font-semibold">subFlow</span> is a decentralized
            subscription management platform built on the{" "}
            <span className="font-semibold text-blue-600">Flow EVM</span>. It enables users and
            businesses to automate recurring crypto payments using native tokens (like ETH on Flow),
            without relying on centralized services or custodians.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mt-2">
            With <span className="font-semibold text-red-600">subFlow</span>, anyone can create,
            manage, and cancel on-chain subscriptions in just a few clicks. Payments are executed
            automatically using <span className="text-blue-600 font-semibold">Forte Workflows</span>,
            ensuring reliability and security through decentralization.
          </p>
        </section>

        {/* Section 2: Problem It Solves */}
        <section>
          <h3 className="text-2xl font-bold text-red-600 mb-3">
            What Problem Does subFlow Solve?
          </h3>
          <p className="text-gray-700 text-lg leading-relaxed">
            Traditional Web2 subscription platforms rely on centralized payment processors, which
            are prone to high fees, restricted access, and lack of transparency. Web3 users and
            creators need a trustless system to automate payments — without losing control of their
            funds or needing a backend server.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mt-2">
            <span className="font-semibold text-blue-600">subFlow</span> solves this by using smart
            contracts and Flow Forte Actions to manage and execute recurring transactions directly
            on-chain. No cron jobs, no middlemen — just decentralized, programmable cash flow.
          </p>
        </section>

        {/* Section 3: Who Can Benefit */}
        <section>
          <h3 className="text-2xl font-bold text-blue-600 mb-3">
            Who Can Use or Benefit from subFlow?
          </h3>
          <ul className="text-gray-700 text-lg leading-relaxed list-disc list-inside space-y-2 text-left sm:text-center md:text-left">
            <li>
              💼 <span className="font-semibold">Content Creators & Streamers</span> — automate
              monthly payments from fans or patrons.
            </li>
            <li>
              🏢 <span className="font-semibold">Businesses & SaaS Providers</span> — accept crypto
              subscriptions for digital services.
            </li>
            <li>
              🧑‍💻 <span className="font-semibold">Developers & DAOs</span> — integrate subFlow to
              automate recurring transfers, payroll, or donations.
            </li>
            <li>
              🌍 <span className="font-semibold">Everyday Users</span> — manage streaming, gaming, or
              membership payments easily in Web3.
            </li>
          </ul>
        </section>

        {/* Call to Action */}
        <div className="mt-10">
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
          >
            Explore Dashboard →
          </button>
        </div>
      </motion.div>
    </main>
  );
}
