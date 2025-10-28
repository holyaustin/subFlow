// components/Footer.tsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto text-center px-4">
        <p className="text-sm">
          © {new Date().getFullYear()} <span className="font-semibold">subFlow</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
