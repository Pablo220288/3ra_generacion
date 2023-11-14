import axios from "axios";
import Layout from "@/components/Layout";
import Link from "next/link";
import OrderForm from "@/components/OrderForm";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";

export default function StaffNew() {
  const [orders, setOrders] = useState([]);
  const [isOrders, setIsOrders] = useState(false);

  const getOrders = async () => {
    try {
      setIsOrders(true);
      const response = await axios.get("/api/order/find");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching Orders data:", error);
    } finally {
      setIsOrders(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <Layout>
      <div className="mb-4 text-gray-400 text-sm flex items-center">
        <Link className="hover:text-generation" href={"/orders"}>
          Ordenes de Trabajo{" "}
        </Link>
        <span>\ </span>
        <span className="text-text-generation">Nueva Orden</span>
        <div className="ml-3">{isOrders && <Spinner color={"#0a5a7d"} />}</div>
      </div>
      {orders.length > 0 && (
        <OrderForm
          title={"Nueva Orden"}
          orders={orders}
        />
      )}
    </Layout>
  );
}
