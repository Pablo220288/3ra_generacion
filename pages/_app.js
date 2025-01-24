import { AlertContextProvider } from "@/components/AlertContext";
import { SignatureContextProvider } from "@/components/SignatureContext";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Head>
        <link rel="icon" href="/assets/icono3rageneracion.png" />
        <title>3ra Generación | Seguridad Electrónica</title>
        <meta
          name="descrption"
          content="Plataforma de Gestión para Ordenes de Traabajo y Presupuestos"
        />
      </Head>
      <AlertContextProvider>
        <SignatureContextProvider>
          <Component {...pageProps} />
        </SignatureContextProvider>
      </AlertContextProvider>
    </SessionProvider>
  );
}
