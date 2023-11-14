import Layout from "@/components/Layout";
import Link from "next/link";
import React from "react";

export default function SettingsPage() {
  return (
    <Layout>
      <div className="flex items-center gap-2 mt-3">
        <h4 className="block font-sans text-lg md:text-xl leading-snug tracking-normal text-text-generation antialiased">
          Configuraciones
        </h4>
      </div>
      <div className="m-2">
        <Link
          href={"/settings/admin"}
          className="flex items-center gap-2 p-2 rounded-lg text-gray-600 transition ease-in-out duration-150 hover:bg-backgroud-body hover:text-text-generation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z"
            />
          </svg>
          Administradores
        </Link>
      </div>
    </Layout>
  );
}
