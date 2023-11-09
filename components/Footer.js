import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <div className="w-full flex items-center justify-between p-4">
      <span className="text-xs text-blue-gray-400">&copy; 3ra Generación - 2023</span>
      <Link
        className="text-xs text-blue-gray-400 hover:text-indigo-500 transition ease-in-out duration-150"
        href="https://pablo220288.github.io/Portafolio_2022/"
        target="_blank"
      >
        <span className="text-[8px]">by</span> Pablo Hernandez
      </Link>
    </div>
  );
}
