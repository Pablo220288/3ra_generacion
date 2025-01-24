import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import AdminForm from "@/components/AdminForm";
import Spinner from "@/components/Spinner";

export default function EditAdminPage() {
  const [adminInfo, setAdminInfo] = useState(null);

  const router = useRouter();
  const { id } = router.query;

  const getAdmin = async () => {
    try {
      if (!id) return;
      const admins = await axios.get("/api/admin/findbyid/?id=" + id);
      setAdminInfo(admins.data);
      console.log(admins.data);
    } catch (error) {
      console.error("Error fetching Admins data:", error);
    }
  };

  useEffect(() => {
    getAdmin();
  }, [id]);

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
        <span className="text-text-generation">Editar</span>
      </div>
      <div className="mt-2 flex justify-between">
        <div className="flex items-center gap-2">
          <h1>Editar Administrador</h1>
        </div>
      </div>
      {adminInfo && <AdminForm {...adminInfo} titleButton={"Editar"} />}
    </Layout>
  );
}
