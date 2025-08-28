import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function MonthlyComparison({ data }) {
  const { orders = [], budgets = [], jobs = [], checklists = [] } = data;

  // Procesar datos para comparación mensual
  const processMonthlyData = () => {
    const monthlyData = {};

    // Función para agregar datos a un mes específico
    const addToMonth = (date, type) => {
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          name: monthYear,
          orders: 0,
          budgets: 0,
          jobs: 0,
          checklists: 0,
        };
      }

      monthlyData[monthYear][type] += 1;
    };

    // Procesar órdenes
    orders.forEach((order) => {
      if (order.createdAt) {
        addToMonth(new Date(order.createdAt), "orders");
      }
    });

    // Procesar presupuestos
    budgets.forEach((budget) => {
      if (budget.createdAt) {
        addToMonth(new Date(budget.createdAt), "budgets");
      }
    });

    // Procesar trabajos
    jobs.forEach((job) => {
      if (job.createdAt) {
        addToMonth(new Date(job.createdAt), "jobs");
      }
    });

    // Procesar checklists
    checklists.forEach((checklist) => {
      if (checklist.createdAt) {
        addToMonth(new Date(checklist.createdAt), "checklists");
      }
    });

    return Object.values(monthlyData).sort((a, b) => {
      const [aMonth, aYear] = a.name.split("/").map(Number);
      const [bMonth, bYear] = b.name.split("/").map(Number);

      if (aYear !== bYear) return aYear - bYear;
      return aMonth - bMonth;
    });
  };

  const chartData = processMonthlyData();

  return (
    <>
      <CardTitle className="mb-4">Comparación Mensual</CardTitle>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" fill="#0ea5e9" name="Órdenes" />
            <Bar dataKey="budgets" fill="#10b981" name="Presupuestos" />
            <Bar dataKey="jobs" fill="#f59e0b" name="Trabajos" />
            <Bar dataKey="checklists" fill="#ef4444" name="Checklists" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
