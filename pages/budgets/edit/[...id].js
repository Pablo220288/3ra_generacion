import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import BudgetForm from "@/components/BudgetForm";

export default function EditOrderPage() {
  const [budgetInfo, setBudgetInfo] = useState(null);
  const [isBudgets, setIsBudgets] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const getBudget = async () => {
    try {
      setIsBudgets(true);
      if (!id) return;
      const response = await axios.get("/api/budget/findbyid/?id=" + id[0]);     
      setBudgetInfo(response.data);
    } catch (error) {
      console.error("Error fetching Orders data:", error);
    } finally {
      setIsBudgets(false);
    }
  };

  useEffect(() => {
    getBudget();
  }, [id]);

  return (
    <Layout>
      <div className="mb-4 text-gray-400 text-sm flex items-center">
        <Link className="hover:text-generation" href={"/orders"}>
          Presupuestos{" "}
        </Link>
        <span>\ </span>
        <span className="text-text-generation">Editar Presupuesto</span>
        <div className="ml-3">{isBudgets && <Spinner color={"#0a5a7d"} />}</div>
      </div>
      {budgetInfo && (
        <BudgetForm title={"Editar Presupuesto"} {...budgetInfo} />
      )}
    </Layout>
  );
}
