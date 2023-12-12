import BudgetForm from "@/components/BudgetForm";
import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function BudgetsNew() {
  const [budgets, setBudgets] = useState(null);
  const [isBudgets, setIsBudgets] = useState(false);

  const getBudgets = async () => {
    try {
      setIsBudgets(true);
/*       const response = await axios.get("/api/budget/find");
      setBudgets(response.data); */
      setBudgets([]);
    } catch (error) {
      console.error("Error fetching Budgets data:", error);
    } finally {
      setIsBudgets(false);
    }
  };

  useEffect(() => {
    getBudgets();
  }, []);

  return (
    <Layout>
      <div className="mb-4 text-gray-400 text-sm flex items-center">
        <Link className="hover:text-text-generation" href={"/budgets"}>
          Presupuestos{" "}
        </Link>
        <span>\ </span>
        <span className="text-text-generation">Nuevo Presupuesto</span>
        <div className="ml-3">{isBudgets && <Spinner color={"#0a5a7d"} />}</div>
      </div>
      {budgets && <BudgetForm title={"Nuevo Presupuesto"} budgets={budgets} />}
    </Layout>
  );
}
