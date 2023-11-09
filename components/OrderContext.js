import { createContext, useEffect, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

export const OrderContext = createContext({});

export function OrderContextProvider({ children }) {
  const [orders, setOrders] = useState([]);

  const [signature, setSignature] = useState(false);

  const showSignature = () => {
    setSignature(true);
  };

  const hideSignature = () => {
    setSignature(false);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        showSignature,
      }}
    >
      {signature && (
        <div
          className="fixed flex top-0 left-0 right-0 bottom-0 items-center justify-center transition-all ease-in duration-300 z-50"
        >
          <div className="w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-400">
            <div className="flex">
              <div
                className={
                  "text-indigo-500 bg-indigo-100 inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg dark:text-blue-300 dark:bg-blue-900"
                }
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
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
                <span className="sr-only">Pencil icon</span>
              </div>
              <div className="ml-3 text-sm font-normal flex flex-col gap-2">
                <span className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                  Signature
                </span>
                <SignatureCanvas
                  penColor="#0a5a7d"
                  canvasProps={{
                    width: 200,
                    height: 100,
                    className: "sigCanvas",
                  }}
                />
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div
                      className={
                        "bg-indigo-500 hover:bg-indigo-700 focus:ring-indigo-300 inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-white rounded-lg cursor-pointer focus:ring-4 focus:outline-none dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                      }
                    >
                      Add
                    </div>
                  </div>
                  <div>
                    <div className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">
                      Clear
                    </div>
                  </div>
                  <div>
                    <div
                      onClick={hideSignature}
                      className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
                    >
                      Cancel
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="ml-auto -mx-1.5 -my-1.5 bg-white items-center justify-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                data-dismiss-target="#toast-interactive"
                aria-label="Close"
                onClick={hideSignature}
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
    </OrderContext.Provider>
  );
}
