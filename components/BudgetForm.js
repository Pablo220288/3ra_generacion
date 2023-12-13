import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AlertContext } from "./AlertContext";
import { useSession } from "next-auth/react";
import Spinner from "./Spinner";

export default function BudgetForm({
  _id,
  title,
  budgets,
  file: existingFile,
  dateBudget: existingDateBudget,
  name: existingName,
}) {
  const { showAlert } = useContext(AlertContext);

  const { data: session } = useSession();

  const [file, setFile] = useState(
    existingFile
      ? "0".repeat(4 - existingFile.toString().length) +
          Math.abs(existingFile).toString()
      : ""
  );
  const [dateBudget, setDateBudget] = useState(
    existingDateBudget
      ? new Date(existingDateBudget).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [name, setName] = useState(existingName || "");
  const [items, setItems] = useState([]);
  const [itemsTotal, setItemsTotal] = useState(
    items.length > 0
      ? items.reduce((acum, item) => acum + parseInt(item.total), 0)
      : "0"
  );
  const [isDollar, setIsDollar] = useState(false);
  const [dollar, setDollar] = useState(null);
  const [itmesTotalDollar, setItmesTotalDollar] = useState("0");

  const addItem = () => {
    setItems((prev) => {
      return [...prev, { name: "", cant: 1, price: "", total: "0" }];
    });
  };
  const handleItemNameChange = (index, item, newName) => {
    setItems((prev) => {
      const items = [...prev];
      items[index].name = newName;
      return items;
    });
  };
  const handleItemCantChange = (index, item, newCant) => {
    setItems((prev) => {
      const items = [...prev];
      items[index].cant = newCant;
      items[index].total = items[index].price * newCant;
      return items;
    });
  };
  const handleItemPriceChange = (index, item, newPrice) => {
    setItems((prev) => {
      const items = [...prev];
      items[index].price = newPrice;
      items[index].total = items[index].cant * newPrice;
      return items;
    });
  };

  const removeItem = (indexToRemove) => {
    setItems((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  };

  const saveBudget = (ev) => {
    ev.preventDefault();

    const data = {
      file,
      dateBudget,
      name,
      items: items.map((i) => ({
        name: i.name,
        cant: i.cant,
        price: i.price,
        total: i.total,
      })),
      total: itemsTotal,
      totalDollar: itmesTotalDollar,
      owner: session.user.id,
    };

    if (data.name === "") {
      toast.error("Ingrese un Nombre de Cliente.");
      return;
    }

    if (items.length === 0) {
      toast.error("No existen Productos.");
      return;
    }

    if (_id) {
      showAlert(file, "update", "/api/budget/update", "/budgets", data, "budget");
    } else {
      showAlert(file, "add", "/api/budget/create", "/budgets", data, "budget");
    }
    console.log(data);
  };

  const fileNumber = () => {
    console.log(budgets.length)
    if (budgets.length > 0) {
      let max = 0;
      for (let numero of budgets) {
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

  const getDollar = async () => {
    try {
      /*       setIsDollar(true);
         await axios.get("/api/dollar").then((result) => {
         setDollar(result.data);
        
      });  */
      setDollar({ d: "2023-12-12", v: 366.5 });
    } catch (error) {
      console.error("Error Fetch Dollar", error);
    } finally {
      setIsDollar(false);
    }
  };

  useEffect(() => {
    if (!existingFile) {
      fileNumber();
    }
    getDollar();
  }, []);

  useEffect(() => {
    setItemsTotal(items.reduce((acum, item) => acum + item.total, 0));
  }, [items]);

  useEffect(() => {
    if (dollar === null) return;
    setItmesTotalDollar((itemsTotal / dollar.v).toFixed());
  }, [itemsTotal]);

  return (
    <form onSubmit={saveBudget} className="mt-4 flex flex-col">
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
            href={"/budgets"}
            data-ripple-light="true"
          >
            Cancelar
          </Link>
        </div>
      </div>
      <div className="mb-4 flex gap-6 ">
        <div className="relative h-11 w-full max-w-[70px]">
          <input
            className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
            placeholder=" "
            value={file}
            disabled
          />
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Número
          </label>
        </div>
        <div className="relative h-11 w-full max-w-[140px]">
          <input
            className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 focus:shadow-none disabled:border-0 disabled:bg-blue-gray-50"
            placeholder=" "
            type="date"
            value={dateBudget}
            onChange={(e) => setDateBudget(e.target.value)}
          />
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Fecha
          </label>
        </div>
      </div>
      <div className="mb-4 flex gap-6 ">
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
      </div>
      <h2 className="text-sm">Productos / Servicios</h2>
      {items.length > 0 &&
        items.map((item, index) => (
          <div className="flex gap-4 mb-1 mt-4" key={index}>
            <button
              onClick={() => {
                removeItem(index);
              }}
              type="button"
              className="flex w-fit px-2 cursor-pointer select-none items-center rounded-md p-2 text-start text-blue-gray-600 leading-tight outline-none transition-all hover:bg-pink-50 hover:bg-opacity-80 hover:text-pink-900 focus:bg-pink-50 focus:bg-opacity-80 focus:text-pink-900 active:bg-pink-50 active:bg-opacity-80 active:text-pink-900"
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
            <div className="relative h-11 w-full ">
              <input
                className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                placeholder=" "
                type="text"
                value={item.product}
                onChange={(ev) =>
                  handleItemNameChange(index, item, ev.target.value)
                }
              />
              <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[10px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Nombre
              </label>
            </div>
            <div className="relative h-11 max-w-[50px]">
              <input
                className="peer h-full w-full text-center rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                placeholder=" "
                type="text"
                value={item.cant}
                onChange={(ev) =>
                  handleItemCantChange(index, item, ev.target.value)
                }
              />
              <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[10px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Cant
              </label>
            </div>
            <div className="relative h-11 max-w-[100px] relative">
              <input
                className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 pl-6 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                placeholder=" "
                type="text"
                value={item.price}
                onChange={(ev) =>
                  handleItemPriceChange(index, item, ev.target.value)
                }
              />
              <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[10px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Precio
              </label>
              <span className="absolute left-2 top-2 text-lg text-blue-gray-700 peer-focus:block peer-placeholder-shown:hidden">
                $
              </span>
            </div>
            <div className="relative h-11 max-w-[100px] relative">
              <input
                className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 pl-6 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:bg-blue-gray-50"
                placeholder=" "
                type="text"
                value={item.total}
                disabled
              />
              <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[10px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Total
              </label>
              <span className="absolute left-2 top-2 text-lg text-blue-gray-700 peer-focus:block peer-placeholder-shown:hidden">
                $
              </span>
            </div>
          </div>
        ))}
      <button
        type="button"
        onClick={addItem}
        className="block w-fit select-none rounded-lg bg-teal-500 p-2 mt-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-teal-500/20 transition-all hover:shadow-lg hover:shadow-teal-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
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
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
      <div className="mb-4 flex justify-end gap-6 ">
        <div className="relative h-11 max-w-[100px] relative">
          <input
            className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 pl-6 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:bg-blue-gray-50"
            placeholder=" "
            type="text"
            value={itemsTotal}
            disabled
          />
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[10px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Total
          </label>
          <span className="absolute left-2 top-3 text-sm text-blue-gray-700 peer-focus:block peer-placeholder-shown:hidden">
            $
          </span>
        </div>
      </div>
      <div className="mb-4 flex justify-end items-center gap-6 ">
        <div className="flex justify-center items-center">
          {isDollar && <Spinner color={"#0a5a7d"} dollar={true} />}
        </div>
        {dollar && (
          <div className="flex flex-col items-start">
            <span className="text-[10px] italic">Fecha : {dollar.d}</span>
            <span className="text-[10px] italic">Cotización : {dollar.v}</span>
          </div>
        )}
        <div className="relative h-11 max-w-[100px] relative">
          <input
            className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 pl-10 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:bg-blue-gray-50"
            placeholder=" "
            type="text"
            value={itmesTotalDollar}
            disabled
          />
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[10px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-indigo-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-indigo-500 peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Total
          </label>
          <span className="absolute left-2 top-3 text-sm text-blue-gray-700 peer-focus:block peer-placeholder-shown:hidden">
            USD
          </span>
        </div>
      </div>
    </form>
  );
}
