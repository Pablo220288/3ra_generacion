import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { priorityMap } from "@/components/JobForm";

export default function JobsPage() {
  const [jobs, setJobs] = useState(null);
  const [isJobs, setIsJobs] = useState(false);
  const [orderJob, setOrderJob] = useState("");
  const [stateJob, setStateJob] = useState("");

  const getJobs = async () => {
    try {
      setIsJobs(true);
      const response = await axios.get("/api/job/find");
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching Jobs data:", error);
    } finally {
      setIsJobs(false);
    }
  };

  const order = [
    { name: "fileUp", text: "Número + a - ", sort: "file", type: -1 },
    { name: "fileDown", text: "Número - a +", sort: "file", type: 1 },
    { name: "priorityUp", text: "Prioridad + a -", sort: "priority", type: 1 },
    {
      name: "priorityDown",
      text: "Prioridad - a +",
      sort: "priority",
      type: -1,
    },
  ];

  const getFilter = async () => {
    try {
      setIsJobs(true);
      setJobs(null);

      const state = stateJob;
      let sort = "";
      let type = "";

      if (orderJob !== "") {
        sort = order.find((o) => o.name === orderJob).sort;
        type = order.find((o) => o.name === orderJob).type;
      }

      console.log(state, sort, type);

      const response = await axios.get(
        "/api/job/findFilter/?sort=" + sort + "&type=" + type + "&state=" + state
      );
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching Jobs data:", error);
    } finally {
      setIsJobs(false);
    }
  };

  useEffect(() => {
    if (orderJob === "" && stateJob === "") {
      setJobs(null);
      getJobs();
      return;
    }
    getFilter();
  }, [orderJob, stateJob]);

  return (
    <Layout>
      <div className="mt-2 flex justify-between">
        <div className="flex items-center gap-2">
          <h4 className="block font-sans text-lg md:text-xl leading-snug tracking-normal text-indigo-500 antialiased">
            Tareas a Realizar
          </h4>
          <div className="ml-3">{isJobs && <Spinner color={"#0a5a7d"} />}</div>
        </div>
        <Link
          className="flex w-fit rounded-md text-white p-2 hover:bg-blue-900 select-none bg-indigo-500 text-center align-middle font-sans shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          href={"/jobs/new"}
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
              d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.867 19.125h.008v.008h-.008v-.008Z"
            />
          </svg>
        </Link>
      </div>
      {jobs && (
        <div className="w-full my-4 flex items-start gap-4">
          <div className="relative h-11 w-full max-w-[150px]">
            <select
              value={stateJob}
              onChange={(ev) => {
                setStateJob(ev.target.value);
              }}
              className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 focus:shadow-none disabled:bg-blue-gray-50"
            >
              <option value="">Por Defecto</option>
              <option value="pending">Pendientes</option>
              <option value="finish">Finalizadas</option>
            </select>
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Estado
            </label>
          </div>
          <div className="relative h-11 w-full max-w-[150px]">
            <select
              value={orderJob}
              onChange={(ev) => {
                setOrderJob(ev.target.value);
              }}
              className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 focus:shadow-none disabled:bg-blue-gray-50"
            >
              <option value="">Por Defecto</option>
              {order.map((o, index) => (
                <option value={o.name} key={index}>
                  {o.text}
                </option>
              ))}
            </select>
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Orden
            </label>
          </div>
        </div>
      )}

      {jobs && (
        <>
          {jobs.length > 0 ? (
            <>
              {jobs.length > 0 && (
                <>
                  <div className="w-full lg:hidden">
                    <table className="basic mt-4">
                      <thead>
                        <tr>
                          <td></td>
                          <td>Fecha</td>
                          <td>Cliente</td>
                          <td>Tec.</td>
                          <td></td>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.map((job) => (
                          <tr key={job._id}>
                            <td className="!pl-0 w-[30px]">
                              <div
                                className={
                                  job.status === "pending"
                                    ? "flex w-fit select-none items-center gap-2 rounded-md p-2 text-start text-orange-600 leading-tight outline-none transition-all hover:bg-orange-50 hover:bg-opacity-80 hover:text-orange-900 focus:bg-orange-50 focus:bg-opacity-80 focus:text-orange-900 active:bg-orange-50 active:bg-opacity-80 active:text-orange-900"
                                    : "flex w-fit select-none items-center gap-2 rounded-md p-2 text-start text-green-600 leading-tight outline-none transition-all hover:bg-orange-50 hover:bg-opacity-80 hover:text-green-900 focus:bg-orange-50 focus:bg-opacity-80 focus:text-green-900 active:bg-orange-50 active:bg-opacity-80 active:text-green-900"
                                }
                              >
                                {job.status === "pending" ? (
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
                                      d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z"
                                    />
                                  </svg>
                                ) : (
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
                                      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                                    />
                                  </svg>
                                )}
                              </div>
                            </td>
                            <td>
                              {`${new Date(job.dateJob)
                                .toISOString()
                                .slice(0, 10)
                                .match(/([^T]+)/)[0]
                                .split("-")
                                .reverse()
                                .join("/")
                                .slice(0, 6)}` +
                                `${new Date(job.dateJob)
                                  .toLocaleDateString()
                                  .slice(-2)}`}
                            </td>
                            <td>{job.name}</td>
                            <td>{job.owner.user}</td>
                            <td className="flex">
                              <Link
                                href={"/jobs/visualize/" + job._id}
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
                          <td></td>
                          <td>N°</td>
                          <td>Fecha</td>
                          <td>Cliente</td>
                          <td>Prioridad</td>
                          <td>Tec.</td>
                          <td></td>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.map((job) => (
                          <tr key={job._id}>
                            <td className="!pl-0 w-[30px]">
                              <div
                                className={
                                  job.status === "pending"
                                    ? "flex w-fit select-none items-center gap-2 rounded-md p-2 text-start text-orange-600 leading-tight outline-none transition-all hover:bg-orange-50 hover:bg-opacity-80 hover:text-orange-900 focus:bg-orange-50 focus:bg-opacity-80 focus:text-orange-900 active:bg-orange-50 active:bg-opacity-80 active:text-orange-900"
                                    : "flex w-fit select-none items-center gap-2 rounded-md p-2 text-start text-green-600 leading-tight outline-none transition-all hover:bg-orange-50 hover:bg-opacity-80 hover:text-green-900 focus:bg-orange-50 focus:bg-opacity-80 focus:text-green-900 active:bg-orange-50 active:bg-opacity-80 active:text-green-900"
                                }
                              >
                                {job.status === "pending" ? (
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
                                      d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z"
                                    />
                                  </svg>
                                ) : (
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
                                      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                                    />
                                  </svg>
                                )}
                              </div>
                            </td>
                            <td>
                              {"0".repeat(4 - job.file.toString().length) +
                                Math.abs(job.file).toString()}
                            </td>
                            <td>
                              {`${new Date(job.dateJob)
                                .toISOString()
                                .slice(0, 10)
                                .match(/([^T]+)/)[0]
                                .split("-")
                                .reverse()
                                .join("/")
                                .slice(0, 6)}` +
                                `${new Date(job.dateJob)
                                  .toLocaleDateString()
                                  .slice(-2)}`}
                            </td>
                            <td>
                              {job.name[0].toUpperCase() +
                                job.name.substring(1)}
                            </td>
                            <td>
                              {
                                priorityMap.find(
                                  (p) => p.number === job.priority
                                ).name
                              }
                            </td>
                            <td className="items-center">{job.owner.user}</td>
                            <td className="flex justify-end">
                              <Link
                                href={"/jobs/visualize/" + job._id}
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
                Aun no se han cargado Tareas
              </span>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
