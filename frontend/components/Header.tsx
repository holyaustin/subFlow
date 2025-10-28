// components/Header.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ConnectWallet from "./ConnectWallet";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="bg-red-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and name */}
        <div className="flex items-center space-x-2">
          <img
            src="https://cryptologos.cc/logos/flow-flow-logo.png"
            alt="subFlow logo"
            className="w-8 h-8"
          />
          <Link href="/" className="text-xl font-bold tracking-wide">
            subFlow
          </Link>
        </div>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="hover:text-blue-200">
            Home
          </Link>
          <Link href="/about" className="hover:text-blue-200">
            About
          </Link>
          <Link href="/create" className="hover:text-blue-200">
            Create
          </Link>
          <Link href="/dashboard" className="hover:text-blue-200">
            Dashboard
          </Link>
        </nav>

        {/* Wallet button */}
        <div className="hidden md:block">
          <ConnectWallet />
        </div>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none text-white"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-red-700 border-t border-red-500 px-4 py-3 space-y-3">
          <Link href="/" className="block hover:text-blue-200" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/about" className="block hover:text-blue-200" onClick={() => setMenuOpen(false)}>
            About
          </Link>
          <Link href="/create" className="block hover:text-blue-200" onClick={() => setMenuOpen(false)}>
            Create
          </Link>
          <Link href="/dashboard" className="block hover:text-blue-200" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>

          <div className="border-t border-red-500 pt-3">
            <ConnectWallet />
          </div>
        </div>
      )}
    </header>
  );
}
