import { AlertContextProvider } from "@/components/AlertContext";
import { OrderContextProvider } from "@/components/OrderContext";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <head>
        <link
          rel="icon"
          href="/assets/icono3rageneracion>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>
      <AlertContextProvider>
        <OrderContextProvider>
          <Component {...pageProps} />
        </OrderContextProvider>
      </AlertContextProvider>
    </SessionProvider>
  );
}
