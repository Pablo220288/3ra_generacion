import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AlertContext } from "./AlertContext";
import { useSession } from "next-auth/react";
import axios from "axios";

export const priorityMap = [
  {
    name: "Muy Alta",
    number: 1,
  },
  {
    name: "Alta",
    number: 2,
  },
  {
    name: "Media",
    number: 3,
  },
  {
    name: "Baja",
    number: 4,
  },
];

export default function JobForm({
  _id,
  title,
  jobs,
  orders,
  file: existingFile,
  dateJob: existingDateJob,
  name: existingName,
  branch: existingBranch,
  property: existingProperty,
  gender: existingGender,
  job: existingJob,
  status: existingStatus,
  orderJob: existingOrderJob,
  priority: esixtingPriority,
}) {
  const { showAlert } = useContext(AlertContext);

  const { data: session } = useSession();

  const [file, setFile] = useState(
    existingFile
      ? "0".repeat(4 - existingFile.toString().length) +
          Math.abs(existingFile).toString()
      : ""
  );
  const [dateJob, setDateJob] = useState(
    existingDateJob
      ? new Date(existingDateJob).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [gender, setGender] = useState(existingGender || "Particular");
  const [name, setName] = useState(existingName || "");
  const [branch, setBranch] = useState(existingBranch || "");

  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showCustomer, setShowCustomer] = useState(
    !existingGender ? false : existingGender === "Cliente" ? true : false
  );

  const [properties, setProperties] = useState(null);
  const [property, setProperty] = useState(existingProperty || "");
  const [job, setJob] = useState(existingJob || "");
  const [status, setStatus] = useState(existingStatus || "pending");

  const [finish, setFinish] = useState(false);
  const [orderJob, setOrderJob] = useState(existingOrderJob || "");
  const [priority, setPriority] = useState(esixtingPriority || 2);

  const fileNumber = () => {
    if (jobs.length > 0) {
      let max = 0;
      for (let numero of jobs) {
        if (max < numero.file) max = numero.file;
      }
      setFile(
        "0".repeat(4 - (max + 1).toString().length) +
          Math.abs(max + 1).toString()
      );
    } else {
      setFile("0".repeat(4 - (1).toString().length) + Math.abs(1).toString());
    }
  };

  useEffect(() => {
    if (!existingFile) {
      fileNumber();
    }
    axios.get("/api/categories/find").then((result) => {
      setCategories(result.data);
    });
  }, []);

  const selectCustomer = () => {
    try {
      setCustomers(
        categories.filter(
          (order) => order.parent?._id === "65578ea1f981a6d14e94774e"
        )
      );
    } catch (error) {
      console.error("Error Customer Selected", error);
    } finally {
      setName("");
      setBranch("");
      setGender("Cliente");
      setShowCustomer(true);
    }
  };
  const selectParticular = () => {
    try {
      // Limpiamos Campos del Formulario
      setName("");
      setBranch("");
      setGender("Particular");
    } catch (error) {
      console.error("Error Particular Selected", error);
    } finally {
      setShowCustomer(false);
    }
  };

  const selectedCustomer = async (ev) => {
    setName(ev.target.value);

    if (ev.target.value === "") {
      setProperties(null);
    } else {
      setProperties(
        categories.find((customer) => customer.name === ev.target.value)
          .properties
      );
    }
  };

  const saveJob = (ev) => {
    ev.preventDefault();

    const data = {
      _id,
      file,
      dateJob,
      name,
      branch,
      property,
      job,
      gender,
      status,
      owner: session.user.id,
      priority,
    };
    console.log(data);

    if (data.name === "") {
      toast.error("Ingrese un Nombre de Cliente.");
      return;
    }

    if (data.branch === "") {
      if (data.gender === "Particular") {
        toast.error("Ingrese Direccion");
        return;
      }
      toast.error("Ingrese Sucursal");
      return;
    }

    if (data.job === "") {
      toast.error("Describa una Tarea");
      return;
    }

    if (_id) {
      if (finish) {
        if (orderJob === "") {
          toast.error("Ingrese Orden de Trabajo");
          return;
        }
        const order = orders.find(
          (order) => order.file === parseInt(orderJob)
        )._id;
        data.orderJob = order;
        data.status = "finish";
        showAlert(
          file,
          "update",
          "/api/job/update",
          "/jobs",
          data,
          "jobFinish"
        );
      } else {
        showAlert(file, "update", "/api/job/update", "/jobs", data, "job");
      }
    } else {
      showAlert(file, "add", "/api/job/create", "/jobs", data, "job");
    }
  };

  return (
    <form onSubmit={saveJob} className="mt-4 flex flex-col">
      <div>
        <Toaster />
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1>{title}</h1>
        <div className="flex items-center gap-2">
          {status !== "finish" ? (
            <button
              className="block w-full select-none rounded-lg bg-indigo-500 py-2 px-3 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="submit"
              data-ripple-light="true"
            >
              {finish ? "finalizar" : "Guardar"}
            </button>
          ) : (
            <Link
              href={"/orders/visualize/" + orderJob}
              className=" block w-full select-none rounded-lg bg-cyan-500 py-2 px-3 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-cyan-500/20 transition-all hover:shadow-lg hover:shadow-cyan-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              data-ripple-light="true"
            >
              Orden
            </Link>
          )}
          <Link
            className=" block w-full select-none rounded-lg bg-pink-500 py-2 px-3 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            href={"/jobs"}
            data-ripple-light="true"
          >
            {status === "finish" ? "Volver" : "Cancelar"}
          </Link>
        </div>
      </div>
      <div className="mb-4 flex gap-2 ">
        <div className="relative h-11 w-full max-w-[70px]">
          <input
            className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-end text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:bg-blue-gray-50"
            placeholder=" "
            value={file}
            disabled
          />
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[10px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Número
          </label>
        </div>
        <div className="relative h-11 w-full max-w-[140px]">
          <input
            className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 focus:shadow-none disabled:bg-blue-gray-50"
            placeholder=" "
            type="date"
            value={dateJob}
            onChange={(e) => setDateJob(e.target.value)}
            disabled={status !== "finish" ? false : true}
          />
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Fecha
          </label>
        </div>
        <div className="relative h-11 w-full max-w-[100px]">
          <select
            value={priority}
            onChange={(ev) => {
              setPriority(ev.target.value);
            }}
            className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 focus:shadow-none disabled:bg-blue-gray-50"
            disabled={status !== "finish" ? false : true}
          >
            {priorityMap.map((priority, index) => (
              <option value={priority.number} key={index}>
                {priority.name}
              </option>
            ))}
          </select>
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Prioridad
          </label>
        </div>
      </div>
      <div className="mb-1 flex gap-6 ">
        <div className={existingGender ? "hidden" : "flex items-center"}>
          <div onClick={selectParticular} className="inline-flex items-center">
            <label
              className="relative flex gap-2 cursor-pointer items-center rounded-full p-3"
              htmlFor="particular"
              data-ripple-dark="true"
            >
              <input
                id="particular"
                name="type"
                type="radio"
                className="before:content[''] peer relative h-3 w-3 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-pink-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-5 before:w-5 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-pink-500 checked:before:bg-pink-500 hover:before:opacity-10"
                defaultChecked={gender === "Particular" ? true : false}
              />
              <div className="pointer-events-none absolute top-2/4 left-3.5 -translate-y-2/4 text-pink-500 opacity-0 transition-opacity peer-checked:opacity-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-2 w-2"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                </svg>
              </div>
              <label
                className="mt-px cursor-pointer select-none font-light text-sm text-gray-400 peer-checked:text-gray-700"
                htmlFor="particular"
              >
                Particular
              </label>
            </label>
          </div>
          <div onClick={selectCustomer} className="inline-flex items-center">
            <label
              className="relative flex gap-2 cursor-pointer items-center rounded-full p-3"
              htmlFor="customer"
              data-ripple-dark="true"
            >
              <input
                id="customer"
                name="type"
                type="radio"
                className="before:content[''] peer relative h-3 w-3 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-pink-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-5 before:w-5 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-pink-500 checked:before:bg-pink-500 hover:before:opacity-10"
                defaultChecked={gender === "Cliente" ? true : false}
              />
              <div className="pointer-events-none absolute top-2/4 left-3.5 -translate-y-2/4 text-pink-500 opacity-0 transition-opacity peer-checked:opacity-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-2 w-2"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                </svg>
              </div>
              <label
                className="mt-px cursor-pointer select-none font-light text-sm text-gray-400 peer-checked:text-gray-700"
                htmlFor="customer"
              >
                Cliente
              </label>
            </label>
          </div>
        </div>
      </div>
      {existingFile ? (
        <div className="mb-4 flex flex-col gap-3 lg:flex-row ">
          <div className="relative h-11 w-full min-w-[100px]">
            <input
              className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:bg-blue-gray-50"
              placeholder=" "
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              disabled={status !== "finish" ? false : true}
            />
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              {existingGender === "Cliente" ? "Cliente" : "Nombre"}
            </label>
          </div>
          <div className="relative h-11 w-full min-w-[100px]">
            <input
              className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:bg-blue-gray-50"
              placeholder=" "
              value={branch}
              onChange={(ev) => setBranch(ev.target.value)}
              disabled={status !== "finish" ? false : true}
            />
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              {existingGender === "Cliente" ? "Sucursal" : "Dirección"}
            </label>
          </div>
        </div>
      ) : (
        <>
          {showCustomer === true ? (
            <div className="mb-4 flex flex-col gap-3 lg:flex-row">
              <div className="relative h-11 w-full min-w-[140px]">
                <select
                  value={name}
                  onChange={(ev) => {
                    selectedCustomer(ev);
                  }}
                  className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-red-500 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 focus:shadow-none disabled:border-0 disabled:bg-blue-gray-50"
                >
                  <option value="">Seleccione al Cliente</option>
                  {customers?.map((c) => (
                    <option value={c.name} key={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Cliente
                </label>
              </div>
              <div className="relative h-11 w-full min-w-[100px]">
                <input
                  className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  placeholder=" "
                  value={branch}
                  onChange={(ev) => setBranch(ev.target.value)}
                />
                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:text-blue-gray-500 peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Sucursal
                </label>
              </div>
            </div>
          ) : (
            <div className="mb-4 flex flex-col gap-3 lg:flex-row ">
              <div className="relative h-11 w-full min-w-[100px]">
                <input
                  className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  placeholder=" "
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                />
                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Nombre
                </label>
              </div>
              <div className="relative h-11 w-full min-w-[100px]">
                <input
                  className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  placeholder=" "
                  value={branch}
                  onChange={(ev) => setBranch(ev.target.value)}
                />
                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Dirección
                </label>
              </div>
            </div>
          )}
        </>
      )}
      <div className="mb-4 flex gap-6 ">
        {properties &&
          properties.map((prop, index) => (
            <div
              className="inline-flex items-center"
              onClick={() => {
                setProperty(prop.name);
              }}
              key={index}
            >
              <label
                className="relative flex gap-2 cursor-pointer items-center rounded-full p-3"
                htmlFor={"propertie" + index}
                data-ripple-dark="true"
                key={prop.name}
              >
                <input
                  id={"propertie" + index}
                  name="propertie"
                  type="radio"
                  className="before:content[''] peer relative h-3 w-3 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-pink-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-5 before:w-5 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-pink-500 checked:before:bg-pink-500 hover:before:opacity-10"
                />
                <div className="pointer-events-none absolute top-2/4 left-3.5 -translate-y-2/4 text-pink-500 opacity-0 transition-opacity peer-checked:opacity-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-2 w-2"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                  </svg>
                </div>
                <label
                  className="mt-px cursor-pointer select-none font-light text-sm text-gray-400 peer-checked:text-gray-700"
                  htmlFor={"propertie" + index}
                >
                  {prop.name}
                </label>
              </label>
            </div>
          ))}
      </div>
      <div className="relative w-full min-w-[200px]">
        <textarea
          className="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled: disabled:bg-blue-gray-50"
          placeholder=" "
          value={job}
          onChange={(ev) => setJob(ev.target.value)}
          disabled={status !== "finish" ? false : true}
        ></textarea>
        <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-indigo-500 peer-disabled:peer-placeholder-shown:text-blue-gray-500">
          Tarea a relizar
        </label>
      </div>
      {existingFile ? (
        <div className="w-full flex flex-col items-start">
          <div className="mt-4 mb-2 h-[44px] flex items-start gap-3">
            {status === "pending" ? (
              <div className="flex flex-col items-start gap-2">
                <button
                  className="select-none block rounded-lg bg-green-500 py-2 px-3 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                  data-ripple-light="true"
                  onClick={() => {
                    setFinish(!finish);
                  }}
                >
                  Orden
                </button>
              </div>
            ) : null}
            {finish ? (
              <div
                data-aos="fade-left"
                data-aos-offset="-1000"
                className="relative h-11 w-full max-w-[200px] min-w-[140px]"
              >
                <select
                  value={orderJob}
                  onChange={(ev) => {
                    setOrderJob(ev.target.value);
                  }}
                  className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-red-500 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 focus:shadow-none disabled:border-0 disabled:bg-blue-gray-50"
                >
                  <option value="">Seleccione</option>
                  {orders?.map((order) => (
                    <option value={order.file} key={order._id}>
                      {order.file}
                    </option>
                  ))}
                </select>
                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Orden de Trabajo
                </label>
              </div>
            ) : null}
          </div>
          <span className="text-xs italic">
            Para Finalizar la Tarea ingrese una Orden de Trabajo
          </span>
        </div>
      ) : null}
    </form>
  );
}
