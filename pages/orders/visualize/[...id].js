import axios from "axios";
import Layout from "@/components/Layout";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Logo from "@/components/Logo";
import Spinner from "@/components/Spinner";
import { useSession } from "next-auth/react";
import { AlertContext } from "@/components/AlertContext";

export default function VisualizeOrderPage() {
  const [order, setOrder] = useState(null);
  const [isOrders, setIsOrders] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const { showAlert } = useContext(AlertContext);
  const { data: session } = useSession();
  const idSuperAdmin = "65523c27e089088ecbaa2221";

  const getOrder = async () => {
    try {
      if (!id) return;
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
      {order && (
        <div className="w-full max-w-[600px] mx-auto mb-6 flex flex-col">
          <div className="w-full flex items-center justify-between">
            <div className="flex gap-1 mb-4">
              <Link
                href={"/pdfview?id=" + id}
                className="flex w-fit cursor-pointer select-none items-center gap-2 rounded-md p-2 text-start text-blue-gray-600 leading-tight outline-none transition-all hover:bg-orange-50 hover:bg-opacity-80 hover:text-orange-900 focus:bg-orange-50 focus:bg-opacity-80 focus:text-orange-900 active:bg-orange-50 active:bg-opacity-80 active:text-orange-900"
                target="_blank"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </Link>
              {session.user.id === idSuperAdmin ||
              order.owner._id === session.user.id ? (
                <>
                  <Link
                    href={"/orders/edit/" + order._id}
                    className="flex w-fit cursor-pointer select-none items-center gap-2 rounded-md p-2 text-start text-blue-gray-600 leading-tight outline-none transition-all hover:bg-indigo-50 hover:bg-opacity-80 hover:text-indigo-900 focus:bg-indigo-50 focus:bg-opacity-80 focus:text-indigo-900 active:bg-indigo-50 active:bg-opacity-80 active:text-indigo-900"
                    data-ripple-light="true"
                    data-tooltip-target="tooltip-animation"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </Link>
                  <button
                    onClick={() => {
                      const url = "/api/order/delete?id=" + order._id;
                      const file =
                        "0".repeat(4 - order.file.toString().length) +
                        Math.abs(order.file).toString();
                      showAlert(file, "delete", url, "/orders", null, "order");
                    }}
                    type="button"
                    className="flex w-fit cursor-pointer select-none items-center gap-2 rounded-md p-2 text-start text-blue-gray-600 leading-tight outline-none transition-all hover:bg-pink-50 hover:bg-opacity-80 hover:text-pink-900 focus:bg-pink-50 focus:bg-opacity-80 focus:text-pink-900 active:bg-pink-50 active:bg-opacity-80 active:text-pink-900"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </>
              ) : null}
            </div>
            <Link
              href={"/orders"}
              className="flex w-fit cursor-pointer select-none items-center gap-2 rounded-md p-2 text-start text-blue-gray-600 leading-tight outline-none transition-all hover:bg-teal-50 hover:bg-opacity-80 hover:text-teal-900 focus:bg-teal-50 focus:bg-opacity-80 focus:text-teal-900 active:bg-teal-50 active:bg-opacity-80 active:text-teal-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                />
              </svg>
            </Link>
          </div>
          <div className=" w-full flex flex-col items-center justify-between rounded-lg p-10 bg-gray-50 shadow-md backdrop-blur-2xl backdrop-saturate-200">
            <div className="w-full flex flex-col items-center">
              <div className="w-full flex items-center justify-between">
                <Logo />
                <div className="flex items-center gap-3">
                  <h4 className="text-normal text-[11px] text-gray-600">
                    Orden:
                  </h4>
                  <span className="text-normal text-sm">
                    {"0".repeat(4 - order.file.toString().length) +
                      Math.abs(order.file).toString()}
                  </span>
                </div>
              </div>
              <h4 className="w-full text-left block mt-8 mb-10 font-sans text-sm md:text-lg leading-snug tracking-normal text-text-generation antialiased">
                ORDEN DE TRABAJO
              </h4>
              <div className="w-full flex items-center gap-6 mb-4">
                <div className="flex items-center gap-3">
                  <h4 className="text-normal text-[11px] text-gray-600">
                    Fecha:
                  </h4>
                  <span className="text-normal text-xs md:text-sm">
                    {new Date(order.dateOrder)
                      .toISOString()
                      .slice(0, 10)
                      .match(/([^T]+)/)[0]
                      .split("-")
                      .reverse()
                      .join("/")}
                  </span>
                </div>
              </div>
              <div className="w-full flex items-center gap-6 mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <h4 className="text-normal text-[11px] text-gray-600">
                    Cliente:
                  </h4>
                  <span className="text-normal text-xs md:text-sm">
                    {order.customer.name}
                  </span>
                </div>
                {order.customer.type === "Cliente" ? (
                  <div className="flex items-center gap-3 flex-1">
                    <h4 className="text-normal text-[11px] text-gray-600">
                      Sucursal:
                    </h4>
                    <span className="text-normal text-xs md:text-sm">
                      {order.customer.branch}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 flex-1">
                    <h4 className="text-normal text-[11px] text-gray-600">
                      Dirección:
                    </h4>
                    <span className="text-normal text-xs md:text-sm">
                      {order.customer.address}
                    </span>
                  </div>
                )}
              </div>
              {order.customer.type === "Cliente" ? (
                order.customer.property === "" ||
                order.customer.property === undefined ? null : (
                  <div className="w-full flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <h4 className="text-normal text-[11px] text-gray-600">
                        Trabajo:
                      </h4>
                      <span className="text-normal text-xs md:text-sm">
                        {order.customer.property}
                      </span>
                    </div>
                  </div>
                )
              ) : null}
              {order.customer.type === "Particular" ? (
                <>
                  <div className="w-full flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <h4 className="text-normal text-[11px] text-gray-600">
                        Localidad:
                      </h4>
                      <span className="text-normal text-xs md:text-sm">
                        {order.customer.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-1">
                      <h4 className="text-normal text-[11px] text-gray-600">
                        Teléfono:
                      </h4>
                      <span className="text-normal text-xs md:text-sm">
                        {order.customer.phone}
                      </span>
                    </div>
                  </div>
                  <div className="w-full flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <h4 className="text-normal text-[11px] text-gray-600">
                        Email:
                      </h4>
                      <span className="text-normal text-xs md:text-sm">
                        {order.customer.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-1">
                      <h4 className="text-normal text-[11px] text-gray-600">
                        Contacto:
                      </h4>
                      <span className="text-normal text-xs md:text-sm">
                        {order.customer.contact}
                      </span>
                    </div>
                  </div>
                </>
              ) : null}
              <hr />
              <div className="w-full flex items-center gap-6 mb-6">
                <div className="flex items-end gap-3">
                  <h4 className="text-normal text-[11px] text-gray-600">
                    Tareas Realizadas:
                  </h4>
                </div>
              </div>
              <div className="w-full flex items-center gap-6 mb-6">
                <span className="w-full mx-4 p-4 text-normal text-xs md:text-sm">
                  {order.description}
                </span>
              </div>
            </div>
            <div className="w-full flex flex-col items-center">
              <div className="w-full flex items-end justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h4 className="text-normal text-[11px] text-gray-600">
                    Técnico:
                  </h4>
                  <span className="text-normal text-xs md:text-sm">
                    {order.owner.fullName}
                  </span>
                </div>
                <div className="flex items-end gap-3">
                  <h4 className="text-normal text-[11px] text-gray-600">
                    Aprobó:
                  </h4>
                  <div className="flex flex-col items-center gap-2">
                    <img
                      className="w-[75px] h-[45px]"
                      src={order.signature}
                      alt={order.nameSignature}
                    />
                    <span className="text-normal text-xs md:text-sm">
                      {order.nameSignature}
                    </span>
                  </div>
                </div>
              </div>
              <hr />
              <div className="w-full flex items-center justify-center">
                <span className="text-normal text-[10px] text-gray-700">
                  www.3rageneracion.com
                </span>
              </div>
              <div className="w-full flex items-center justify-evenly mt-4">
                <div className="flex-1 flex justify-start gap-2 items-center flex-col md:flex-row">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                    />
                  </svg>
                  <span className=" flex items-center justify-center text-normal text-[9px] text-gray-700">
                    +54 3543 552622
                  </span>
                </div>
                <div className="flex-1 flex justify-center gap-2 items-center flex-col md:flex-row">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                  <span className=" flex items-center justify-center text-normal text-[9px] text-gray-700">
                    3gseguridad@gmail.com
                  </span>
                </div>
                <div className="flex-1 flex justify-end gap-2 items-center flex-col md:flex-row">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 512 512"
                  >
                    <path
                      d="M480 257.35c0-123.7-100.3-224-224-224s-224 100.3-224 224c0 111.8 81.9 204.47 189 221.29V322.12h-56.89v-64.77H221V208c0-56.13 33.45-87.16 84.61-87.16 24.51 0 50.15 4.38 50.15 4.38v55.13H327.5c-27.81 0-36.51 17.26-36.51 35v42h62.12l-9.92 64.77H291v156.54c107.1-16.81 189-109.48 189-221.31z"
                      fillRule="evenodd"
                    />
                  </svg>
                  <span className=" flex items-center justify-center text-normal text-[9px] text-gray-700">
                    facebook/3GSeguridad
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
