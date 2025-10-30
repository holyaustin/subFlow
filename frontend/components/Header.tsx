"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ConnectWallet from "./ConnectWallet";
import { useIsMounted } from "@/lib/hooks";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((v) => !v);
  const mounted = useIsMounted();

  if (!mounted) return null; // prevents SSR mismatch

  return (
    <header className="bg-red-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + title */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="subFlow logo"
            className="w-16 h-16 object-cover"
          />
          <Link href="/" className="text-3xl font-bold">
            subFlow
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/about" className="hover:text-gray-200">
            About
          </Link>
          <Link href="/create" className="hover:text-gray-200">
            Create
          </Link>
          <Link href="/dashboard" className="hover:text-gray-200">
            Dashboard
          </Link>
          <Link href="/analytics" className="hover:text-gray-200">
            Analytics
          </Link>
          <Link href="/admin" className="hover:text-gray-200">
            Admin
          </Link>
        </nav>

        <div className="hidden md:block">
          <ConnectWallet />
        </div>

        <button
          className="md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-red-700 px-4 py-3 border-t border-red-500">
          <div className="flex flex-col gap-3">
            <Link href="/about" onClick={() => setMenuOpen(false)} className="block">
              About
            </Link>
            <Link href="/create" onClick={() => setMenuOpen(false)} className="block">
              Create
            </Link>
            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block">
              Dashboard
            </Link>
            <Link href="/analytics" onClick={() => setMenuOpen(false)} className="block">
              Analytics
            </Link>
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="block">
              Admin
            </Link>
            <div className="pt-3 border-t border-red-500">
              <ConnectWallet />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
