import axios from "axios";
import { useRouter } from "next/router";
import { createContext, useState } from "react";

export const AlertContext = createContext({});

export function AlertContextProvider({ children }) {
  const [file, setFile] = useState("");
  const [alert, setAlert] = useState(false);
  const [action, setAction] = useState("");
  const [url, setUrl] = useState("");
  const [destination, setDestination] = useState("");
  const [data, setData] = useState("");
  const [section, setSection] = useState("");

  const [refresh, setRefresh] = useState(false);

  const router = useRouter();

  const classIcon =
    "inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg dark:text-blue-300 dark:bg-blue-900";
  const classIconDelete = classIcon + " text-pink-500 bg-pink-100 ";
  const classIconAdd = classIcon + " text-indigo-500 bg-indigo-100";

  const classButton =
    "inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-white rounded-lg cursor-pointer focus:ring-4 focus:outline-none dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800";
  const classButtonDelete =
    classButton + " bg-pink-600 hover:bg-pink-700 focus:ring-pink-300";
  const classButtonnAdd =
    classButton + " bg-indigo-500 hover:bg-indigo-700 focus:ring-indigo-300";

  const showAlert = (file, action, url, destination, data, section) => {
    try {
      setFile(file);
      setAction(action);
      setUrl(url);
      setDestination(destination);
      setData(data);
      setSection(section);
    } catch (error) {
      console.error("Error Show Alert:", error);
    } finally {
      setAlert(true);
    }
  };

  const hideAlert = () => {
    try {
      setFile("");
    } catch (error) {
      console.error("Error Hide Alert:", error);
    } finally {
      setAlert(false);
    }
  };

  const actionAlert = async () => {
    if (action === "delete") {
      try {
        await axios.delete(url);
      } catch (error) {
        console.error("Error Hide Alert:", error);
      } finally {
        if (destination === undefined) {
          setRefresh(!refresh);
        } else {
          router.push(destination);
        }
        hideAlert();
      }
    } else if (action === "add") {
      try {
        await axios.post(url, data);
      } catch (error) {
        console.error("Error Hide Alert:", error);
      } finally {
        if (destination === undefined) {
          setRefresh(!refresh);
        } else {
          router.push(destination);
        }
        hideAlert();
      }
    }
  };

  return (
    <AlertContext.Provider
      value={{
        showAlert,
        refresh,
        setRefresh,
      }}
    >
      {alert && (
        <div className="fixed z-50 bg-background-alert flex top-0 left-0 right-0 bottom-0 items-center justify-center transition-all ease-in duration-300 z-50">
          <div className="w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-400">
            <div className="flex">
              <div
                className={action === "delete" ? classIconDelete : classIconAdd}
              >
                {action === "add" && section === "admin" && (
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
                      d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                    />
                  </svg>
                )}
                {action === "add" && section === "order" && (
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
                      d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                )}
                {action === "delete" && (
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
                )}
                <span className="sr-only">Delete icon</span>
              </div>
              <div className="ml-3 text-sm font-normal">
                <span className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                  {action === "add" && section === "admin"
                    ? "Agregar Administrador"
                    : "Agregar Orden"}
                  {action === "delete" && section === "admin"
                    ? "Eliminar Administrador"
                    : "Eliminar Orden"}
                </span>
                <div className="mb-2 text-sm font-normal">
                  {action == "add"
                    ? `Seguro que quiere agregar a ${file} como Administrador?`
                    : `Seguro que quiere elimiar a ${file} como Administrador?`}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div
                      onClick={actionAlert}
                      className={
                        action === "delete"
                          ? classButtonDelete
                          : classButtonnAdd
                      }
                    >
                      {action == "add" ? "Agregar" : "Eliminar"}
                    </div>
                  </div>
                  <div>
                    <div
                      onClick={hideAlert}
                      className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
                    >
                      Cancelar
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="ml-auto -mx-1.5 -my-1.5 bg-white items-center justify-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                data-dismiss-target="#toast-interactive"
                aria-label="Close"
                onClick={hideAlert}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      {children}
    </AlertContext.Provider>
  );
}
