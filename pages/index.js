import BarOrders from "@/components/BarOrders";
import BarTechnical from "@/components/BarTechnical";
import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const [orders, setOrders] = useState(null);
  const [isOrders, setIsOrders] = useState(false);

  const { data: session } = useSession();

  const getOrders = async () => {
    try {
      setIsOrders(true);
      const response = await axios.get("/api/order/find");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching Orders data:", error);
    } finally {
      setIsOrders(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <Layout>
      <div className="text-text-generation flex flex-col gap-4 items-start">
        <div className="flex items-center gap-2">
          <h2 className="">
            Hola, <b>{session?.user?.name}</b>
          </h2>
          <div className="ml-3">
            {isOrders && <Spinner color={"#0a5a7d"} />}
          </div>
        </div>
        {orders && (
          <>
            {orders.length > 0 ? (
              <div className="w-full flex flex-col gap-6 items-start md:flex-row ">
                <div className="w-full flex gap-4 items-end justify-start md:justify-center flex-1">
                  <div className="flex flex-col items-end mb-2">
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
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                    <span>Ordenes de Trabajo</span>
                    <p className="text-[10px] italic text-blue-gray-700">
                      Ordenes de trabajo totales : {orders.length}
                    </p>
                  </div>
                  <BarOrders orders={orders} />
                </div>
                <div className="w-full flex gap-4 items-end justify-start md:justify-center flex-1">
                  <div className="flex flex-col items-end mb-2">
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
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                    <span>Ordenes por Técnico</span>
                    <p className="text-[10px] italic text-blue-gray-700">
                      Totales de Ordenes por técnico
                    </p>
                  </div>
                  <BarTechnical orders={orders} />
                </div>
              </div>
            ) : (
              <div className="mt-4 flex gap-2 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                  />
                </svg>
                <span className=" text-sm italic">
                  No hay datos que analizar.
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
