import axios from "axios";
import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Logo from "@/components/Logo";
import Spinner from "@/components/Spinner";
import { useSession } from "next-auth/react";

export default function VisualizeOrderPage() {
  const [order, setOrder] = useState(null);
  const [isOrders, setIsOrders] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const getOrder = async () => {
    try {
      setIsOrders(true);
      const response = await axios.get("/api/order/findbyid/?id=" + id);
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching Orders data:", error);
    } finally {
      setIsOrders(false);
    }
  };

  useEffect(() => {
    getOrder();
  }, [id]);

  return (
    <Layout>
      <div className="mb-4 text-gray-400 text-sm flex items-center">
        <Link className="hover:text-text-generation" href={"/orders"}>
          Ordenes de Trabajo{" "}
        </Link>
        <span>\ </span>
        <span className="text-text-generation">
          Orden{" "}
          {order &&
            "0".repeat(4 - order.file.toString().length) +
              Math.abs(order.file).toString()}
        </span>
        <div className="ml-3">{isOrders && <Spinner color={"#0a5a7d"} />}</div>
      </div>
      <div className="flex gap-1 mb-4">
        <Link
          href={"/pdfOrder"}
          className="flex w-fit cursor-pointer select-none items-center gap-2 rounded-md p-2 text-start text-blue-gray-600 leading-tight outline-none transition-all hover:bg-red-50 hover:bg-opacity-80 hover:text-red-900 focus:bg-red-50 focus:bg-opacity-80 focus:text-red-900 active:bg-red-50 active:bg-opacity-80 active:text-red-900"
          target="_blank"
        >
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
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        </Link>
      </div>
      {order && (
        <div className="w-full max-w-[650px] mx-auto flex flex-col items-center rounded-lg p-4 bg-gray-50 shadow-md backdrop-blur-2xl backdrop-saturate-200 mb-6">
          <div className="w-full flex items-center justify-between">
            <Logo />
            <div className="flex items-end gap-3">
              <h4 className="text-normal text-[11px] text-gray-600">Orden:</h4>
              <span className="text-normal text-sm">
                {"0".repeat(4 - order.file.toString().length) +
                  Math.abs(order.file).toString()}
              </span>
            </div>
          </div>
          <h4 className="block mt-5 mb-10 font-sans text-lg md:text-xl leading-snug tracking-normal text-text-generation antialiased">
            Orden de Trabajo
          </h4>
          <div className="w-full flex items-center gap-6 mb-6">
            <div className="flex items-end gap-3">
              <h4 className="text-normal text-[11px] text-gray-600">Fecha:</h4>
              <span className="text-normal text-sm">
                {new Date(order.dateOrder).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-end gap-3">
              <h4 className="text-normal text-[11px] text-gray-600">Nombre:</h4>
              <span className="text-normal text-sm">{order.name}</span>
            </div>
          </div>
          <hr />
          <div className="w-full flex items-center gap-6 mb-6">
            <div className="flex items-end gap-3">
              <h4 className="text-normal text-[11px] text-gray-600">
                Tareas Realizadas:
              </h4>
            </div>
          </div>
          <div className="w-full flex items-center gap-6 mb-6">
            <div className="w-full flex items-end gap-3 mx-4 rounded-lg p-4 shadow-md backdrop-blur-2xl backdrop-saturate-200">
              <span className="text-normal text-sm">{order.description}</span>
            </div>
          </div>
          <hr />
          <div className="w-full flex items-end justify-between mb-6">
            <div className="flex items-end gap-3">
              <h4 className="text-normal text-[11px] text-gray-600">
                Técnico:
              </h4>
              <span className="text-normal text-sm">
                {order.owner.fullName}
              </span>
            </div>
            <div className="flex items-end gap-3">
              <h4 className="text-normal text-[11px] text-gray-600">Aprobó:</h4>
              <div className="flex flex-col items-center gap-2">
                <img
                  className="w-[75px] h-[45px]"
                  src={order.signature}
                  alt={order.nameSignature}
                />
                <span className="text-normal text-sm">
                  {order.nameSignature}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
