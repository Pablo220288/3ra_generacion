import AdminForm from "@/components/AdminForm";
import Layout from "@/components/Layout";
import Link from "next/link";
import React from "react";

export default function NewAdminPage() {
  return (
    <Layout>
      <div className="mb-4 text-gray-400 text-sm">
        <Link className="hover:text-text-generation" href={"/settings"}>
          Configuraciones{" "}
        </Link>
        <span>\ </span>
        <Link className="hover:text-text-generation" href={"/settings/admin"}>
          Administradores{" "}
        </Link>
        <span>\ </span>
        <span className="text-text-generation">Nuevo</span>
      </div>
      <div className="mt-2 flex justify-between">
        <div className="flex items-center gap-2">
          <h1>Nuevo Administrador</h1>
        </div>
      </div>
      <AdminForm />
    </Layout>
  );
}
