import React, { useContext, useEffect, useState } from "react";
import { AlertContext } from "./AlertContext";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { SignatureContext } from "./SignatureContext";

export default function CheckListForm({
  _id,
  title,
  checkList,
  file: existingFile,
  dateCheckList: existingDateCheckList,
  branch: existingBranch,
  equipment: existingEquipment,
  items: existingItems,
  observations: existingObservations,
  mileage: existingMileage,
  signature: existingSignature,
  nameSignature: existingNameSignature,
}) {
  const { showAlert } = useContext(AlertContext);
  const { showSignature, signature, setSignature } =
    useContext(SignatureContext);

  const { data: session } = useSession();

  const [file, setFile] = useState(
    existingFile
      ? "0".repeat(4 - existingFile.toString().length) +
          Math.abs(existingFile).toString()
      : ""
  );
  const [dateCheckList, setDateCheckList] = useState(
    existingDateCheckList
      ? new Date(existingDateCheckList).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [branch, setBranch] = useState(existingBranch || "");
  const [equipment, setEquipment] = useState(existingEquipment || "");
  const [items, setItems] = useState(
    existingItems || [
      {
        name: "Verificar DVR / NVR: Funciona ok?",
        check: "si",
        observation: "",
        serialNumber: "",
        disabled: "false",
      },
      {
        name: "Verificar HDD: Funciona ok? Graba deacuerdo a su configuración?",
        check: "si",
        observation: "",
        serialNumber: "",
        disabled: "false",
      },
      {
        name: "Verificar Hardware: Funciona ok?",
        check: "si",
        observation: "",
        serialNumber: "",
        disabled: "false",
      },
      {
        name: "Verificar Software: Funciona ok?",
        check: "si",
        observation: "",
        serialNumber: "",
        disabled: "false",
      },
      {
        name: "Verificar Monitor: Funciona ok?",
        check: "si",
        observation: "",
        serialNumber: "",
        disabled: "false",
      },
      {
        name: "Verificar Cámaras: Funciona ok?",
        check: "si",
        observation: "",
        serialNumber: "",
        disabled: "false",
      },
      {
        name: "Verificar UPS: Funciona ok?",
        check: "si",
        observation: "",
        serialNumber: "",
        disabled: "false",
      },
      {
        name: "Verificar apertura chapón frontal: Funciona ok?",
        check: "si",
        observation: "",
        serialNumber: "",
        disabled: "false",
      },
      {
        name: "Verificar Monitor complementario en linea de cajas: Funciona ok?",
        check: "si",
        observation: "",
        serialNumber: "",
        disabled: "false",
      },
    ]
  );
  const [observations, setObservations] = useState(existingObservations || "");
  const [mileage, setMileage] = useState(existingMileage || "");
  const [nameSignature, setNameSignature] = useState(
    existingNameSignature || ""
  );

  const fileNumber = () => {
    if (checkList.length > 0) {
      let max = 0;
      for (let numero of checkList) {
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
  }, []);

  const handleItemCheckChange = (index, item, newCheck) => {
    setItems((prev) => {
      const items = [...prev];
      items[index].check = newCheck;
      newCheck === "na"
        ? (items[index].disabled = "true")
        : (items[index].disabled = "false");
      return items;
    });
  };

  const handleItemObservationChange = (index, item, newObservation) => {
    setItems((prev) => {
      const items = [...prev];
      items[index].observation = newObservation;
      return items;
    });
  };

  const handleItemSerialNumberChange = (index, item, newSerialNumber) => {
    setItems((prev) => {
      const items = [...prev];
      items[index].serialNumber = newSerialNumber;
      return items;
    });
  };

  const saveCheckList = (ev) => {
    ev.preventDefault();
    const dataSignature = existingSignature ? existingSignature : signature;

    const data = {
      _id,
      file,
      dateCheckList,
      branch,
      equipment,
      items: items.map((i) => ({
        name: i.name,
        check: i.check,
        observation: i.observation,
        serialNumber: i.serialNumber,
        disabled: i.disabled,
      })),
      observations,
      mileage,
      signature: dataSignature,
      nameSignature,
      owner: session.user.id,
    };

    if (data.branch === "") {
      toast.error("Ingrese una Sucursal.");
      return;
    }
    if (data.equipment === "") {
      toast.error("Ingrese el Equipo Entregado.");
      return;
    }
    if (data.signature === "") {
      toast.error("Ingrese Firma.");
      return;
    }
    if (data.nameSignature === "") {
      toast.error("Ingrese Aclaración de Firma.");
      return;
    }

    if (_id) {
      showAlert(
        file,
        "update",
        "/api/checkList/update",
        "/checkList",
        data,
        "checkList"
      );
    } else {
      showAlert(
        file,
        "add",
        "/api/checkList/create",
        "/checkList",
        data,
        "checkList"
      );
    }
  };
  console.log(items);
  return (
    <form onSubmit={saveCheckList} className="mt-4 flex flex-col">
      <div>
        <Toaster />
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1>{title}</h1>
        <div className="flex items-center gap-2">
          <button
            className="block w-full select-none rounded-lg bg-indigo-500 py-2 px-3 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="submit"
            data-ripple-light="true"
          >
            Guardar
          </button>
          <Link
            className=" block w-full select-none rounded-lg bg-pink-500 py-2 px-3 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            href={"/checkList"}
            data-ripple-light="true"
          >
            Cancelar
          </Link>
        </div>
      </div>
      <div className="mb-4 flex gap-6 ">
        <div className="relative h-11 w-full max-w-[70px]">
          <input
            className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:bg-blue-gray-50"
            placeholder=" "
            value={file}
            disabled
          />
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Número
          </label>
        </div>
        <div className="relative h-11 w-full max-w-[160px]">
          <input
            className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 focus:shadow-none disabled:border-0 disabled:bg-blue-gray-50"
            placeholder=" "
            type="date"
            value={dateCheckList}
            onChange={(e) => setDateCheckList(e.target.value)}
          />
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Fecha
          </label>
        </div>
      </div>
      <div className="mb-4 flex gap-6 ">
        <div className="relative h-11 w-full min-w-[100px]">
          <input
            className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:bg-blue-gray-50"
            placeholder=" "
            value={"3ra Generación"}
            disabled
          />
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Tarea Asignada a
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
      <div className="mb-4 flex gap-6 ">
        <div className="relative h-11 w-full min-w-[100px]">
          <input
            className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
            placeholder=" "
            value={equipment}
            onChange={(ev) => setEquipment(ev.target.value)}
          />
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:text-blue-gray-500 peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Equipamiento Entregado
          </label>
        </div>
      </div>
      <h2 className="text-sm text-blue-gray-700">Tareas</h2>
      <div className="[&>*:nth-child(9)]:border-transparent">
        {items.length > 0 &&
          items.map((item, index) => (
            <div
              className="flex flex-col items-start xl:flex-row xl:items-center border border-transparent border-b-blue-gray-200 mt-2 mb-2 pb-1"
              key={index}
            >
              <div className="relative h-11 w-full flex items-center xl:flex-1">
                <label className="text-[13px] font-normal leading-tight text-blue-gray-400">
                  {item.name}
                </label>
              </div>
              <div className="flex items-center gap-4 mb-2 mt-2 xl:flex-1">
                <div className="relative h-11">
                  <select
                    value={item.check}
                    onChange={(ev) => {
                      handleItemCheckChange(index, item, ev.target.value);
                    }}
                    className="peer h-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-red-500 focus:border-2 focus:border-indigo-500 focus:outline-0 focus:shadow-none disabled:border-0 disabled:bg-blue-gray-50"
                  >
                    <option value="si">Si</option>
                    <option value="no">NO</option>
                    <option value="na">N/A</option>
                  </select>
                </div>
                <div className="relative h-11 w-full min-w-[130px]">
                  {item.disabled === "true" ? (
                    <input
                      className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-[12px] font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                      placeholder=" "
                      value={item.observation}
                      disabled
                    />
                  ) : (
                    <input
                      className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-[12px] font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                      placeholder=" "
                      value={item.observation}
                      onChange={(ev) =>
                        handleItemObservationChange(
                          index,
                          item,
                          ev.target.value
                        )
                      }
                    />
                  )}

                  <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:text-blue-gray-500 peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    Observaciones
                  </label>
                </div>
                <div className="relative h-11 w-full min-w-[130px]">
                  {item.disabled === "true" ? (
                    <input
                      className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-[12px] font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                      placeholder=" "
                      value={item.serialNumber}
                      disabled
                    />
                  ) : (
                    <input
                      className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-[12px] font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                      placeholder=" "
                      value={item.serialNumber}
                      onChange={(ev) =>
                        handleItemSerialNumberChange(
                          index,
                          item,
                          ev.target.value
                        )
                      }
                    />
                  )}
                  <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[12px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:text-blue-gray-500 peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    Numero de serie
                  </label>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="mb-4 mt-4 flex items-center gap-4 ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-blue-gray-600"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
          />
        </svg>
        <div className="relative h-11 w-full max-w-[200px]">
          <input
            className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
            placeholder=" "
            value={mileage}
            onChange={(ev) => setMileage(ev.target.value)}
          />
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:text-blue-gray-500 peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Kilometraje Recorrido
          </label>
        </div>
      </div>
      <div className="mb-4 mt-2 flex gap-6 ">
        <div className="relative w-full min-w-[200px]">
          <textarea
            className="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
            placeholder=" "
            value={observations}
            onChange={(ev) => setObservations(ev.target.value)}
          ></textarea>
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Observaciones Generales
          </label>
        </div>
      </div>
      <div className="mb-4 mt-2 flex flex-col items-start gap-6 xl:flex-row xl:items-end">
        <div className="h-[45px] my-4 flex gap-6 items-end">
          <div className="flex items-end gap-4 w-full justify-end pr-2">
            <span className="text-[11px] font-normal leading-tight text-blue-gray-400">
              Aprobó:
            </span>
            <div className="w-[75px] h-[45px]">
              {existingSignature ? (
                <img
                  className="w-[75px] h-[45px]"
                  src={existingSignature}
                  alt="Signature"
                />
              ) : (
                <>
                  {signature && (
                    <img
                      className="w-[75px] h-[45px]"
                      src={signature}
                      alt="Signature"
                    />
                  )}
                </>
              )}
            </div>
          </div>
          {!existingSignature && (
            <div className="flex flex-col items-center gap-2">
              <button
                className="flex w-fit cursor-pointer select-none items-center gap-2 rounded-md p-2 text-start text-blue-gray-600 leading-tight outline-none transition-all hover:bg-indigo-50 hover:bg-opacity-80 hover:text-indigo-900 focus:bg-indigo-50 focus:bg-opacity-80 focus:text-indigo-900 active:bg-indigo-50 active:bg-opacity-80 active:text-indigo-900"
                type="button"
                data-ripple-light="true"
                onClick={showSignature}
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
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </button>
              <button
                className="flex w-fit cursor-pointer select-none items-center gap-2 rounded-md p-2 text-start text-blue-gray-600 leading-tight outline-none transition-all hover:bg-pink-50 hover:bg-opacity-80 hover:text-pink-900 focus:bg-pink-50 focus:bg-opacity-80 focus:text-pink-900 active:bg-pink-50 active:bg-opacity-80 active:text-pink-900"
                type="button"
                data-ripple-light="true"
                onClick={() => setSignature("")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
        <div className="mb-4 w-full flex justify-start gap-6 ">
          <div className="relative h-11 w-full xl:w-1/3">
            <input
              className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
              placeholder=" "
              value={nameSignature}
              onChange={(ev) => setNameSignature(ev.target.value)}
            />
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Aclaración
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
