import Logo from "@/components/Logo";
import Spinner from "@/components/Spinner";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const InvoicePDF = dynamic(() => import("./pdf"), {
  ssr: false,
});

const View = ({ idOrder }) => {
  const [order, setOrder] = useState(null);

  const router = useRouter();
  const { id } = idOrder ? idOrder : router.query;

  const getOrder = async () => {
    try {
      if (!id) return;
      const response = await axios.get("/api/order/findbyid/?id=" + id);
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching Orders data:", error);
    }
  };

  useEffect(() => {
    getOrder();
  }, [id]);

  return (
    <>
      {order ? (
        <InvoicePDF orderInfo={order} />
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
