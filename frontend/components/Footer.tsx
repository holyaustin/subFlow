import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black/90 dark:bg-gray-900 text-white py-6 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto text-center px-4">
        <p className="text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-red-400">subFlow</span>. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
