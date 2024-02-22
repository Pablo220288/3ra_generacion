import Logo from "@/components/Logo";
import Spinner from "@/components/Spinner";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const InvoicePDF = dynamic(() => import("./pdfOrder"), {
  ssr: false,
});
const InvoicePDFBudget = dynamic(() => import("./pdfBudget"), {
  ssr: false,
});

const View = ({ idData }) => {
  const [data, setData] = useState(null);

  const router = useRouter();
  const { id } = idData ? idData : router.query;
  const { type } = router.query;

  const getData = async () => {
    try {
      if (!id) return;

      if (type === "budget") {
        const response = await axios.get("/api/budget/findbyid/?id=" + id);
        setData(response.data);
      } else {
        const response = await axios.get("/api/order/findbyid/?id=" + id);
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  return (
    <>
      {data ? (
        <>
          {type === "order" ? (
            <InvoicePDF orderInfo={data} />
          ) : (
            <InvoicePDFBudget budgetInfo={data} />
          )}
        </>
      ) : (
        <div className="bg-backgroud-body w-screen h-screen flex flex-col items-center justify-center gap-2">
          <Logo />
          <Spinner color={"#0a5a7d"} />
        </div>
      )}
    </>
  );
};

export default View;
