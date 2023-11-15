import axios from "axios";
import { AlertContext } from "@/components/AlertContext";
import Layout from "@/components/Layout";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import React, { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isOrders, setIsOrders] = useState(false);

  const { showAlert, refresh } = useContext(AlertContext);
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

  useEffect(() => {
    getOrders();
  }, [refresh]);

  return (
    <Layout>
      <div className="mt-2 flex justify-between">
        <div className="flex items-center gap-2">
          <h4 className="block font-sans text-lg md:text-xl leading-snug tracking-normal text-indigo-500 antialiased">
            Ordenes de Trabajo
          </h4>
          <div className="ml-3">
            {isOrders && <Spinner color={"#0a5a7d"} />}
          </div>
        </div>
        <Link
          className="flex w-fit rounded-md text-white p-2 hover:bg-blue-900 select-none bg-indigo-500 text-center align-middle font-sans shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          href={"/orders/new"}
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
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
            />
          </svg>
        </Link>
      </div>
      {orders.length > 0 && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>N°</td>
              <td>Fecha</td>
              <td>Cliente</td>
              <td>Emisor</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  {"0".repeat(4 - order.file.toString().length) +
                    Math.abs(order.file).toString()}
                </td>
                <td>{new Date(order.dateOrder).toLocaleDateString()}</td>
                <td>{order.name[0].toUpperCase() + order.name.substring(1)}</td>
                <td>{order.owner.user}</td>
                <td>
                  <div className="flex gap-2 justify-end mt-2">
                    <div>
                      <Menu>
                        <MenuHandler>
                          <Button className="">Menu</Button>
                        </MenuHandler>
                        <MenuList className="z-40">
                          <MenuItem>Menu Item 1</MenuItem>
                          <MenuItem>Menu Item 2</MenuItem>
                          <MenuItem>Menu Item 3</MenuItem>
                        </MenuList>
                      </Menu>
                    </div>
                    <Link
                      href={"/orders/visualize/" + order._id}
                      className="flex w-fit rounded-md text-white p-2 hover:bg-orange-600 select-none bg-orange-500 text-center align-middle font-sans shadow-md shadow-orange-500/20 transition-all cursor-pointer hover:shadow-lg hover:shadow-orange-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
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
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </Link>
                    {order.owner._id === session.user.id ? (
                      <Link
                        href={"/orders/edit/" + order._id}
                        className="flex w-fit rounded-md text-white p-2 hover:bg-blue-900 select-none bg-indigo-500 text-center align-middle font-sans shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        data-ripple-light="true"
                        data-tooltip-target="tooltip-animation"
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
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="flex w-fit rounded-md text-white p-2 hover:bg-blue-900 select-none bg-indigo-500 text-center align-middle font-sans shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        data-ripple-light="true"
                        data-tooltip-target="tooltip-animation"
                        disabled
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
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </button>
                    )}
                    <div
                      onClick={() => {
                        const url = "/api/order/delete?id=" + order._id;
                        const file =
                          "0".repeat(4 - order.file.toString().length) +
                          Math.abs(order.file).toString();
                        showAlert(
                          file,
                          "delete",
                          url,
                          undefined,
                          null,
                          "order"
                        );
                      }}
                      className="flex w-fit rounded-md text-white p-2 hover:bg-pink-600 select-none bg-pink-500 text-center align-middle font-sans shadow-md shadow-pink-500/20 transition-all cursor-pointer hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
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
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
