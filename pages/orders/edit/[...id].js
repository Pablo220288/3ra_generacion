import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import OrderForm from "@/components/OrderForm";
import Spinner from "@/components/Spinner";

export default function EditOrderPage() {
  const [orderInfo, setOrderInfo] = useState(null);
  const [isOrders, setIsOrders] = useState(false);

  const router = useRouter();
  const { id } = router.query;


  const getOrder = async () => {
    try {
      setIsOrders(true);
      if (!id) return;
      const response = await axios.get("/api/order/findbyid/?id=" + id);
      setOrderInfo(response.data);
    } catch (error) {
      console.error("Error fetching Orders data:", error);
    } finally {
      setIsOrders(false);
    }
  };

  useEffect(() => {
    getOrder();
  }, [id]);

  return (
    <Layout>
      <div className="mb-4 text-gray-400 text-sm flex items-center">
        <Link className="hover:text-generation" href={"/orders"}>
          Ordenes de Trabajo{" "}
        </Link>
        <span>\ </span>
        <span className="text-text-generation">Editar Orden</span>
        <div className="ml-3">{isOrders && <Spinner color={"#0a5a7d"} />}</div>
      </div>
      {orderInfo && <OrderForm title={"Editar Orden"} {...orderInfo} />}
    </Layout>
  );
}
