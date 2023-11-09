import Layout from "@/components/Layout";
import OrderForm from "@/components/OrderForm";
import Link from "next/link";

export default function StaffNew() {
  return (
    <Layout>
      <div className="mb-4 text-gray-400 text-sm">
        <Link className="hover:text-generation" href={"/ordres"}>
          Orders{" "}
        </Link>
        <span>\ </span>
        <span className="text-text-generation">New Order</span>
      </div>
      <OrderForm title={"New Order"}/>
    </Layout>
  );
}