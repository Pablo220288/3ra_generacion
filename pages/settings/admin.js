import axios from "axios";
import Layout from "@/components/Layout";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import toast, { Toaster } from "react-hot-toast";
import { AlertContext } from "@/components/AlertContext";

export default function SettingsAdmin() {
  const [admins, setAdmins] = useState([]);
  const [isAdmins, setIsAdmins] = useState(false);

  const { showAlert, refresh } = useContext(AlertContext);

  const getAdmins = async () => {
    try {
      setIsAdmins(true);
      const response = await axios.get("/api/admin/find");
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching Admins data:", error);
    } finally {
      setIsAdmins(false);
    }
  };

  useEffect(() => {
    getAdmins();
  }, []);

  useEffect(() => {
    getAdmins();
  }, [refresh]);

  return (
    <Layout>
      <div>
        <Toaster
          toastOptions={{
            // Define default options
            className: "",
            duration: 100000,
            success: {
              duration: 2000,
            },
          }}
        />
      </div>
      <div className="mb-4 text-gray-400 text-sm">
        <Link className="hover:text-text-generation" href={"/settings"}>
          Configuraciones{" "}
        </Link>
        <span>\ </span>
        <span className="text-text-generation">Administradores</span>
      </div>
      <div className="mt-2 flex justify-between">
        <div className="flex items-center gap-2">
          <h1>Administradores</h1>
          <div className="ml-3">
            {isAdmins && <Spinner color={"#0a5a7d"} />}
          </div>
        </div>
        <Link
          className="flex w-fit rounded-md text-white p-2 hover:bg-blue-900 select-none bg-indigo-500 text-center align-middle font-sans shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          href={"/settings/admin/new"}
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
              d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
            />
          </svg>
        </Link>
      </div>
      {admins.length > 0 && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Usuario</td>
              <td>Nombre</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin._id}>
                <td>{admin.user}</td>
                <td>
                  {admin.fullName[0].toUpperCase() +
                    admin.fullName.substring(1)}
                </td>
                <td>
                  <div className="flex gap-2 justify-end mt-2">
                    <Link
                      href={"/settings/admin/edit/" + admin._id}
                      className="flex w-fit cursor-pointer select-none items-center gap-2 rounded-md p-2 text-start text-blue-gray-600 leading-tight outline-none transition-all hover:bg-indigo-50 hover:bg-opacity-80 hover:text-indigo-900 focus:bg-indigo-50 focus:bg-opacity-80 focus:text-indigo-900 active:bg-indigo-50 active:bg-opacity-80 active:text-indigo-900"
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
                    <div
                      onClick={() => {
                        const url = "/api/admin/delete?id=" + admin._id;
                        showAlert(
                          admin.fullName,
                          "delete",
                          url,
                          undefined,
                          null,
                          "admin"
                        );
                      }}
                      className="flex w-fit cursor-pointer select-none items-center gap-2 rounded-md p-2 text-start text-blue-gray-600 leading-tight outline-none transition-all hover:bg-pink-50 hover:bg-opacity-80 hover:text-pink-900 focus:bg-pink-50 focus:bg-opacity-80 focus:text-pink-900 active:bg-pink-50 active:bg-opacity-80 active:text-pink-900"
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
