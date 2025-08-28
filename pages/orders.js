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
  const [page, setPage] = useState(1);

  const getOrders = async () => {
    try {
      setIsOrders(true);
      setOrders(null);
      const response = await axios
        .get("/api/order/findPagination/?page=" + page)
        .then((result) => {
          setOrders(result.data);
        });
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
  }, [page]);

  useEffect(() => {
    // Solicitamos las categorias
    axios.get("/api/categories/find").then((result) => {
      setCategories(
        result.data
          .filter((order) => order.parent?._id === "65578ea1f981a6d14e94774e")
          .sort(function (a, b) {
            if (a.name > b.name) {
              return 1;
            }
            if (a.name < b.name) {
              return -1;
            }
            return 0;
          })
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
          {orders.docs.length > 0 ? (
            <>
              {orders.docs.length > 0 && (
                <>
                  <div className="w-full lg:hidden flex flex-col items-center">
                    <table className="basic mt-4 px-12">
                      <thead>
                        <tr>
                          <td>Fecha</td>
                          <td>Cliente / Sucursal</td>
                          <td></td>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.docs.map((order) => (
                          <tr key={order._id}>
                            <td>
                              {`${new Date(order.dateOrder)
                                .toISOString()
                                .slice(0, 10)
                                .match(/([^T]+)/)[0]
                                .split("-")
                                .reverse()
                                .join("/")
                                .slice(0, 6)}` +
                                `${new Date(order.dateOrder)
                                  .toLocaleDateString()
                                  .slice(-2)}`}
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
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="w-full flex items-center justify-center mt-4">
                      <div className="flex items-center gap-4">
                        <button
                          disabled={orders.hasPrevPage ? false : true}
                          className="flex items-center gap-2 px-3 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                          type="button"
                          onClick={() => {
                            setPage(orders.prevPage);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 19.5 8.25 12l7.5-7.5"
                            />
                          </svg>
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            className={
                              orders.prevPage === null
                                ? "hidden"
                                : "relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            }
                            type="button"
                            onClick={() => {
                              setPage(orders.prevPage);
                            }}
                          >
                            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                              {orders.prevPage}
                            </span>
                          </button>
                          <button
                            className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg bg-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                          >
                            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                              {orders.page}
                            </span>
                          </button>
                          <button
                            className={
                              orders.nextPage === null
                                ? "hidden"
                                : "relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            }
                            type="button"
                            onClick={() => {
                              setPage(orders.nextPage);
                            }}
                          >
                            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                              {orders.nextPage}
                            </span>
                          </button>
                        </div>
                        <button
                          disabled={orders.hasNextPage ? false : true}
                          className="flex items-center gap-2 px-3 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                          type="button"
                          onClick={() => {
                            setPage(orders.nextPage);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m8.25 4.5 7.5 7.5-7.5 7.5"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="w-full hidden lg:flex flex-col items-center">
                    <table className="basic mt-4">
                      <thead>
                        <tr>
                          <td>N°</td>
                          <td>Fecha</td>
                          <td>Cliente</td>
                          <td>Sucursal</td>
                          <td>Trabajo</td>
                          <td>Técnico</td>
                          <td></td>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.docs.map((order) => (
                          <tr key={order._id}>
                            <td>
                              {"0".repeat(4 - order.file.toString().length) +
                                Math.abs(order.file).toString()}
                            </td>
                            <td>
                              {`${new Date(order.dateOrder)
                                .toISOString()
                                .slice(0, 10)
                                .match(/([^T]+)/)[0]
                                .split("-")
                                .reverse()
                                .join("/")
                                .slice(0, 6)}` +
                                `${new Date(order.dateOrder)
                                  .toLocaleDateString()
                                  .slice(-2)}`}
                            </td>
                            <td>
                              {order.customer.name[0].toUpperCase() +
                                order.customer.name.substring(1)}
                            </td>
                            <td className="whitespace-nowrap">
                              {order.customer.branch}
                            </td>
                            <td className="whitespace-nowrap">
                              {order.customer.property}
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
                    <div className="w-full flex items-center justify-center mt-4">
                      <div className="flex items-center gap-4">
                        <button
                          disabled={orders.hasPrevPage ? false : true}
                          className="flex items-center gap-2 px-3 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                          type="button"
                          onClick={() => {
                            setPage(orders.prevPage);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 19.5 8.25 12l7.5-7.5"
                            />
                          </svg>
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            className={
                              orders.prevPage === null
                                ? "hidden"
                                : orders.prevPage === 1
                                ? "hidden"
                                : "relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            }
                            type="button"
                            onClick={() => {
                              setPage(1);
                            }}
                          >
                            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                              1
                            </span>
                          </button>
                          <span
                            className={
                              orders.prevPage === null
                                ? "hidden"
                                : orders.prevPage === 1
                                ? "hidden"
                                : ""
                            }
                          >
                            ...
                          </span>
                          <button
                            className={
                              orders.prevPage === null
                                ? "hidden"
                                : "relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            }
                            type="button"
                            onClick={() => {
                              setPage(orders.prevPage);
                            }}
                          >
                            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                              {orders.prevPage}
                            </span>
                          </button>
                          <button
                            className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg bg-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                          >
                            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                              {orders.page}
                            </span>
                          </button>
                          <button
                            className={
                              orders.nextPage === null
                                ? "hidden"
                                : "relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            }
                            type="button"
                            onClick={() => {
                              setPage(orders.nextPage);
                            }}
                          >
                            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                              {orders.nextPage}
                            </span>
                          </button>
                          <span
                            className={
                              orders.nextPage === null
                                ? "hidden"
                                : orders.nextPage === orders.totalPages
                                ? "hidden"
                                : ""
                            }
                          >
                            ...
                          </span>
                          <button
                            className={
                              orders.nextPage === null
                                ? "hidden"
                                : orders.nextPage === orders.totalPages
                                ? "hidden"
                                : "relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            }
                            type="button"
                            onClick={() => {
                              setPage(orders.totalPages);
                            }}
                          >
                            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                              {orders.totalPages}
                            </span>
                          </button>
                        </div>
                        <button
                          disabled={orders.hasNextPage ? false : true}
                          className="flex items-center gap-2 px-3 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                          type="button"
                          onClick={() => {
                            setPage(orders.nextPage);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m8.25 4.5 7.5 7.5-7.5 7.5"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
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
