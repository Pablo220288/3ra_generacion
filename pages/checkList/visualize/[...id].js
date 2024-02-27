import axios from "axios";
import Layout from "@/components/Layout";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Logo from "@/components/Logo";
import Spinner from "@/components/Spinner";
import { useSession } from "next-auth/react";
import { AlertContext } from "@/components/AlertContext";

export default function VisualizecheckListsPage() {
  const [checkList, setCheckList] = useState(null);
  const [isCheckList, setIsCheckList] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const { showAlert } = useContext(AlertContext);
  const { data: session } = useSession();
  const idSuperAdmin = ["65523c27e089088ecbaa2221", "65c38b878feae67710fab930"];

  const getCheckList = async () => {
    try {
      setIsCheckList(true);
      const response = await axios.get("/api/checkList/findbyid/?id=" + id[0]);
      setCheckList(response.data);
    } catch (error) {
      console.error("Error fetching Check List data:", error);
    } finally {
      setIsCheckList(false);
    }
  };

  useEffect(() => {
    getCheckList();
  }, [id]);

  return (
    <Layout>
      <div className="mb-4 text-gray-400 text-sm flex items-center">
        <Link className="hover:text-text-generation" href={"/checkList"}>
          Check Lists{" "}
        </Link>
        <span>\ </span>
        <span className="text-text-generation">
          Check List{" "}
          {checkList &&
            "0".repeat(4 - checkList.file.toString().length) +
              Math.abs(checkList.file).toString()}
        </span>
        <div className="ml-3">
          {isCheckList && <Spinner color={"#0a5a7d"} />}
        </div>
      </div>
      {checkList && (
        <div className="w-full max-w-[900px] mx-auto mb-6 flex flex-col">
          <div className="w-full flex items-center justify-between">
            <div className="flex gap-1 mb-4">
              <Link
                href={"/pdfview?id=" + id + "&&type=checkList"}
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
              {idSuperAdmin.includes(session.user.id) ||
              checkList.owner._id === session.user.id ? (
                <>
                  <Link
                    href={"/checkList/edit/" + checkList._id}
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
                      const url = "/api/checkList/delete?id=" + checkList._id;
                      const file =
                        "0".repeat(4 - checkList.file.toString().length) +
                        Math.abs(checkList.file).toString();
                      showAlert(
                        file,
                        "delete",
                        url,
                        "/checkList",
                        null,
                        "checkList"
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
              ) : null}
            </div>
            <Link
              href={"/checkList"}
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
              </div>
              <div className="w-full flex items-center justify-between">
                <h4 className="w-full text-left block mt-5 mb-5 font-sans text-sm md:text-lg leading-snug tracking-normal text-text-generation antialiased">
                  Check List
                </h4>
                <div className="flex items-center gap-3">
                  <h4 className="text-normal text-[11px] text-gray-600">
                    Número:
                  </h4>
                  <span className="text-normal text-xs">
                    {"0".repeat(4 - checkList.file.toString().length) +
                      Math.abs(checkList.file).toString()}
                  </span>
                </div>
              </div>
              <div className="w-full flex flex-col items-start gap-2 mb-2 xl:flex-row xl:items-center xl:gap-0 xl:mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <h4 className="text-normal text-[11px] text-gray-600">
                    Fecha:
                  </h4>
                  <span className="text-normal text-xs">
                    {new Date(checkList.dateCheckList)
                      .toISOString()
                      .slice(0, 10)
                      .match(/([^T]+)/)[0]
                      .split("-")
                      .reverse()
                      .join("/")}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-1">
                  <h4 className="text-normal text-[11px] text-gray-600">
                    Tarea Asignada a:
                  </h4>
                  <span className="text-normal text-xs">3ra Generación</span>
                </div>
                <div className="flex items-center gap-3 flex-1">
                  <h4 className="text-normal text-[11px] text-gray-600">
                    Filial / Objetivo:
                  </h4>
                  <span className="text-normal text-xs">
                    {checkList.branch}
                  </span>
                </div>
              </div>
              <div className="w-full flex items-center gap-6 mb-4">
                <div className="flex items-center gap-3">
                  <h4 className="text-normal text-[11px] text-gray-600">
                    Equipamineto Entregado:
                  </h4>
                  <span className="text-normal text-xs">
                    {checkList.equipment}
                  </span>
                </div>
              </div>
              <hr />
              <div className="w-full flex-col items-start gap-4 mb-6 xl:hidden">
                <div className="flex items-end gap-3">
                  <h4 className="text-normal text-[11px] text-gray-600">
                    Tareas:
                  </h4>
                </div>
                <div className="w-full flex flex-col items-start gap-2 mt-2">
                  {checkList.items.map((item, index) => (
                    <div
                      key={index}
                      className=" w-full flex flex-col items-start gap-2 border border-transparent border-b-gray-400 pb-2"
                    >
                      <div className="w-full flex flex-row items-center gap-3">
                        {item.check === "si" ? (
                          <div className="flex items-center justify-center text-green-500">
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
                                d="m4.5 12.75 6 6 9-13.5"
                              />
                            </svg>
                          </div>
                        ) : item.check === "no" ? (
                          <div className="flex items-center justify-center text-red-600">
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
                                d="M6 18 18 6M6 6l12 12"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center text-orange-600">
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
                                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="text-xs">{item.name}</div>
                      </div>
                      <div className="w-full flex flex-col items-start gap-3">
                        <div className="text-xs flex flex-crow itmes-center gap-2">
                          <div className="text-xs text-gray-600 uppercase">
                            Obs:
                          </div>
                          <div className="text-xs">
                            {item.check === "na"
                              ? "No Aplica"
                              : item.observation}
                          </div>
                        </div>
                        <div className="text-xs flex flex-crow itmes-center gap-2">
                          <div className="text-xs text-gray-600 uppercase">
                            N° Serie:
                          </div>
                          <div className="text-xs">
                            {item.check === "na" ? "--" : item.serialNumber}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full flex-col items-start gap-4 mb-6 hidden xl:flex">
                <div className="w-full">
                  <table className="basic">
                    <thead>
                      <tr>
                        <td className="!text-[10px]">Tareas</td>
                        <td className="text-start !text-[10px]">Resultado</td>
                        <td className="text-center !text-[10px]">
                          Observaciones
                        </td>
                        <td className="text-end !text-[10px]">Num. Serie</td>
                      </tr>
                    </thead>
                    <tbody>
                      {checkList.items.map((item, index) => (
                        <tr
                          key={index}
                          className="border border-transparent border-b-blue-gray-100"
                        >
                          <td className="!text-xs p-2">
                            {item.name[0].toUpperCase() +
                              item.name.substring(1)}
                          </td>
                          <td className="text-start !text-xs !pl-0 h-full">
                            {item.check === "si" ? (
                              <div className="flex items-center justify-center text-green-500">
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
                                    d="m4.5 12.75 6 6 9-13.5"
                                  />
                                </svg>
                              </div>
                            ) : item.check === "no" ? (
                              <div className="flex items-center justify-center text-red-600">
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
                                    d="M6 18 18 6M6 6l12 12"
                                  />
                                </svg>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center text-orange-600">
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
                                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                                  />
                                </svg>
                              </div>
                            )}
                          </td>
                          <td className="text-start !text-xs !pl-0">
                            {item.check === "na"
                              ? "No Aplica"
                              : item.observation}
                          </td>
                          <td className="text-center !text-xs !pl-0">
                            {item.check === "na" ? "--" : item.serialNumber}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="w-full flex items-center gap-6 mb-4">
                <div className="flex items-center gap-3">
                  <h4 className="text-normal text-[11px] text-gray-600">
                    Kilometros Recorridos:
                  </h4>
                  <span className="text-normal text-xs">
                    {checkList.mileage} KM
                  </span>
                </div>
              </div>
              <div className="w-full flex items-center gap-6 mb-4">
                <div className="flex items-center gap-3">
                  <h4 className="text-normal text-[11px] text-gray-600">
                    Observaciones Generales:
                  </h4>
                  <span className="text-normal text-xs">
                    {checkList.observations}
                  </span>
                </div>
              </div>
              <div className="w-full flex items-center justify-end gap-6 mb-4">
                <div className="flex items-end gap-3">
                  <h4 className="text-normal text-[11px] text-gray-600">
                    Aprobó:
                  </h4>
                  <div className="flex flex-col items-center gap-2">
                    <img
                      className="w-[75px] h-[45px]"
                      src={checkList.signature}
                      alt={checkList.nameSignature}
                    />
                    <span className="text-normal text-xs">
                      {checkList.nameSignature}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
