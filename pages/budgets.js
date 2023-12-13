import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function budgets() {
  const [budgets, setBudgets] = useState(null);
  const [isBudgets, setIsBudgets] = useState(false);

  const getBudgets = async () => {
    try {
      setIsBudgets(true);
      const response = await axios.get("/api/budget/find");
      setBudgets(response.data);
    } catch (error) {
      console.error("Error fetching Budgets data:", error);
    } finally {
      setIsBudgets(false);
    }
  };

  useEffect(() => {
    getBudgets();
  }, []);

  return (
    <Layout>
      <div className="mt-2 flex justify-between">
        <div className="flex items-center gap-2">
          <h4 className="block font-sans text-lg md:text-xl leading-snug tracking-normal text-indigo-500 antialiased">
            Presupuestos
          </h4>
          <div className="ml-3">
            {isBudgets && <Spinner color={"#0a5a7d"} />}
          </div>
        </div>
        <Link
          className="flex w-fit rounded-md text-white p-2 hover:bg-blue-900 select-none bg-indigo-500 text-center align-middle font-sans shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          href={"/budgets/new"}
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
              d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
            />
          </svg>
        </Link>
      </div>
      {budgets && (
        <>
          {budgets.length > 0 ? (
            <>
              {budgets.length > 0 && (
                <>
                  <div className="w-full lg:hidden">
                    <table className="basic mt-4">
                      <thead>
                        <tr>
                          <td>Fecha</td>
                          <td>Nombre</td>
                          <td>Técnico</td>
                          <td></td>
                        </tr>
                      </thead>
                      <tbody>
                        {budgets.map((budget) => (
                          <tr key={budget._id}>
                            <td>
                              {new Date(budget.dateBudget)
                                .toISOString()
                                .slice(0, 10)
                                .match(/([^T]+)/)[0]
                                .split("-")
                                .reverse()
                                .join("/")}
                            </td>
                            <td>
                              {budget.name[0].toUpperCase() +
                                budget.name.substring(1)}
                            </td>
                            <td>{budget.owner.user}</td>
                            <td>
                              <Link
                                href={"/budgets/visualize/" + budget._id}
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
                  <div className="w-full hidden lg:flex">
                    <table className="basic mt-4">
                      <thead>
                        <tr>
                          <td>N°</td>
                          <td>Fecha</td>
                          <td>Nombre</td>
                          <td>Técnico</td>
                          <td></td>
                        </tr>
                      </thead>
                      <tbody>
                        {budgets.map((budget) => (
                          <tr key={budget._id}>
                            <td>
                              {"0".repeat(4 - budget.file.toString().length) +
                                Math.abs(budget.file).toString()}
                            </td>
                            <td>
                              {new Date(budget.dateBudget)
                                .toISOString()
                                .slice(0, 10)
                                .match(/([^T]+)/)[0]
                                .split("-")
                                .reverse()
                                .join("/")}
                            </td>
                            <td>
                              {budget.name[0].toUpperCase() +
                                budget.name.substring(1)}
                            </td>
                            <td>{budget.owner.user}</td>
                            <td>
                              <Link
                                href={"/budgets/visualize/" + budget._id}
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
                Aun no se han generado Presupuestos
              </span>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
