import axios from "axios";
import Layout from "@/components/Layout";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import React, { useEffect, useState } from "react";
import FilterOrder from "@/components/FilterOrder";

export default function OrdersPage() {
  const [orders, setOrders] = useState(null);
  const [isOrders, setIsOrders] = useState(false);
  const [categories, setCategories] = useState(null);
  const [customer, setCustomer] = useState("");
  const [orderFilter, setOrderFilter] = useState([]);

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

  const getOrdersFilter = async (customer) => {
    try {
      setIsOrders(true);
      const response = await axios.get(
        "/api/order/findcustomer/?customer=" + customer
      );
      setOrders(response.data);
      setOrderFilter(response.data);
    } catch (error) {
      console.error("Error fetching Orders data:", error);
    } finally {
      setIsOrders(false);
    }
  };

  useEffect(() => {
    getOrders();

    // Solicitamos las categorias
    axios.get("/api/categories/find").then((result) => {
      setCategories(
        result.data.filter(
          (order) => order.parent?._id === "65578ea1f981a6d14e94774e"
        )
      );
    });
  }, []);

  const selectCustomer = async (ev) => {
    const customer = ev.target.value;
    setCustomer(ev.target.value);

    if (customer === "") {
      setOrders(null);
      getOrders();
    } else {
      setOrders(null);
      getOrdersFilter(customer);
    }
  };

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
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        </Link>
      </div>
      {categories && (
        <FilterOrder
          categories={categories}
          customer={customer}
          selectCustomer={selectCustomer}
        />
      )}
      {orders && (
        <>
          {orders.length > 0 ? (
            <>
              {orders.length > 0 && (
                <>
                  <div className="w-full lg:hidden">
                    <table className="basic mt-4">
                      <thead>
                        <tr>
                          <td>Fecha</td>
                          <td>Cliente / Sucursal</td>
                          <td></td>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order._id}>
                            <td>
                              {new Date(order.dateOrder)
                                .toISOString()
                                .slice(0, 10)
                                .match(/([^T]+)/)[0]
                                .split("-")
                                .reverse()
                                .join("/")}
                            </td>
                            <td>
                              {order.customer.name[0].toUpperCase() +
                                order.customer.name.substring(1) +
                                (order.customer.type === "Particular"
                                  ? ""
                                  : " / " +
                                    (order.customer.branch === undefined
                                      ? ""
                                      : order.customer.branch))}
                            </td>
                            <td>
                              <Link
                                href={"/orders/visualize/" + order._id}
                                className="flex w-fit cursor-pointer select-none items-center gap-2 rounded-md p-2 text-start text-blue-gray-600 leading-tight outline-none transition-all hover:bg-orange-50 hover:bg-opacity-80 hover:text-orange-900 focus:bg-orange-50 focus:bg-opacity-80 focus:text-orange-900 active:bg-orange-50 active:bg-opacity-80 active:text-orange-900"
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
                                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                              </Link>
                              {/*                           <div className="relative w-fit md:hidden">
                            <button
                              type="button"
                              className="peer flex w-fit cursor-pointer select-none items-center gap-2 rounded-md p-2 text-start text-blue-gray-600 leading-tight outline-none transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
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
                                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                />
                              </svg>
                            </button>
                            <div className="hidden absolute z-10 top-0 right-[40px] peer-focus:block active:block">
                              <ul
                                role="menu"
                                data-popover="profile-menu"
                                data-popover-placement="bottom"
                                className="flex min-w-[100px] flex-col gap-2 overflow-auto rounded-md border border-blue-gray-50 bg-white p-3 font-sans text-sm font-normal text-blue-gray-500 shadow-lg shadow-blue-gray-500/10 focus:outline-none"
                              >
                                <Link
                                  href={"/orders/visualize/" + order._id}
                                  tabIndex="-1"
                                  role="menuitem"
                                  className="flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-3 pt-[9px] pb-2 text-start leading-tight outline-none transition-all hover:bg-orange-50 hover:bg-opacity-80 hover:text-orange-900 focus:bg-orange-50 focus:bg-opacity-80 focus:text-orange-900 active:bg-orange-50 active:bg-opacity-80 active:text-orange-900"
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
                                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                  <p className="block font-sans text-sm font-normal leading-normal text-inherit antialiased">
                                    Visualizar
                                  </p>
                                </Link>
                                {order.owner._id === session.user.id && (
                                  <>
                                    <Link
                                      href={"/orders/edit/" + order._id}
                                      tabIndex="-1"
                                      role="menuitem"
                                      className="flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-3 pt-[9px] pb-2 text-start leading-tight outline-none transition-all hover:bg-indigo-50 hover:bg-opacity-80 hover:text-indigo-900 focus:bg-indigo-50 focus:bg-opacity-80 focus:text-indigo-900 active:bg-indigo-50 active:bg-opacity-80 active:text-indigo-900"
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
                                      <p className="block font-sans text-sm font-normal leading-normal text-inherit antialiased">
                                        Editar
                                      </p>
                                    </Link>
                                    <button
                                      onClick={() => {
                                        const url =
                                          "/api/order/delete?id=" + order._id;
                                        const file =
                                          "0".repeat(
                                            4 - order.file.toString().length
                                          ) + Math.abs(order.file).toString();
                                        showAlert(
                                          file,
                                          "delete",
                                          url,
                                          undefined,
                                          null,
                                          "order"
                                        );
                                      }}
                                      type="button"
                                      className="flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-3 pt-[9px] pb-2 text-start leading-tight outline-none transition-all hover:bg-pink-50 hover:bg-opacity-80 hover:text-pink-900 focus:bg-pink-50 focus:bg-opacity-80 focus:text-pink-900 active:bg-pink-50 active:bg-opacity-80 active:text-pink-900"
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
                                      <p className="block font-sans text-sm font-normal leading-normal text-inherit antialiased">
                                        Eliminar
                                      </p>
                                    </button>
                                  </>
                                )}
                              </ul>
                            </div>
                          </div>
                          <div className="hidden gap-1 justify-end mt-2 md:flex">
                            <Link
                              href={"/orders/visualize/" + order._id}
                              className="flex w-fit cursor-pointer select-none items-center gap-2 rounded-md p-2 text-start text-blue-gray-600 leading-tight outline-none transition-all hover:bg-orange-50 hover:bg-opacity-80 hover:text-orange-900 focus:bg-orange-50 focus:bg-opacity-80 focus:text-orange-900 active:bg-orange-50 active:bg-opacity-80 active:text-orange-900"
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
                                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </Link>
                            {order.owner._id === session.user.id && (
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
                                    const url =
                                      "/api/order/delete?id=" + order._id;
                                    const file =
                                      "0".repeat(
                                        4 - order.file.toString().length
                                      ) + Math.abs(order.file).toString();
                                    showAlert(
                                      file,
                                      "delete",
                                      url,
                                      undefined,
                                      null,
                                      "order"
                                    );
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
                            )}
                          </div>*/}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="w-full hidden lg:flex">
                    <table className="basic mt-4">
                      <thead>
                        <tr>
                          <td>N°</td>
                          <td>Fecha</td>
                          <td>Cliente</td>
                          <td>Sucursal</td>
                          <td>Técnico</td>
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
                            <td>
                              {new Date(order.dateOrder)
                                .toISOString()
                                .slice(0, 10)
                                .match(/([^T]+)/)[0]
                                .split("-")
                                .reverse()
                                .join("/")}
                            </td>
                            <td>
                              {order.customer.name[0].toUpperCase() +
                                order.customer.name.substring(1)}
                            </td>
                            <td className="whitespace-nowrap">
                              {order.customer.branch}
                            </td>
                            <td>{order.owner.user}</td>
                            <td>
                              <Link
                                href={"/orders/visualize/" + order._id}
                                className="flex w-fit cursor-pointer select-none items-center gap-2 rounded-md p-2 text-start text-blue-gray-600 leading-tight outline-none transition-all hover:bg-orange-50 hover:bg-opacity-80 hover:text-orange-900 focus:bg-orange-50 focus:bg-opacity-80 focus:text-orange-900 active:bg-orange-50 active:bg-opacity-80 active:text-orange-900"
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
                                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
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
                Aun no se han generado Ordenes de Trabajo
              </span>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
