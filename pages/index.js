import Layout from "@/components/Layout";
import { getSession, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <Layout>
      <div className="text-text-generation flex justify-between">
        <h2>
          Hola, <b>{session?.user?.name}</b>
        </h2>
      </div>
    </Layout>
  );
}
