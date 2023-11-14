import axios from "axios";
import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Logo from "@/components/Logo";

export default function VisualizeOrderPage() {
  const [order, setOrder] = useState(null);
  const [isOrders, setIsOrders] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    try {
      setIsOrders(true);
      if (!id) {
        return;
      }
      axios.get("/api/order/findbyid/?id=" + id).then((response) => {
        setOrder(response.data);
      });
    } catch (error) {
      console.error("Error find Order by id", error);
    } finally {
      setIsOrders(false);
    }
  }, [id]);

  return (
    <Layout>
      <div className="mb-4 text-gray-400 text-sm flex items-center">
        <Link className="hover:text-generation" href={"/orders"}>
          Ordenes de Trabajo{" "}
        </Link>
        <span>\ </span>
        <span className="text-text-generation">Orden {order && "0".repeat(4 - (order.file).toString().length) + Math.abs(order.file).toString()}</span>
        <div className="ml-3">{isOrders && <Spinner color={"#0a5a7d"} />}</div>
      </div>
      <div>
        <Logo />
      </div>

    </Layout>
  );
}
