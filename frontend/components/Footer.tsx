import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black/90 dark:bg-gray-900 text-white py-6 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 px-4">
        <img
          src="/logo.png"
          alt="subFlow logo"
          className="w-8 h-8 object-cover rounded-md"
        />
        <p className="text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-red-400">subFlow</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
