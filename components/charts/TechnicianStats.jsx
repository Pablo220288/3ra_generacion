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
} from "recharts";

export default function TechnicianStats({ data }) {
  const { orders = [], jobs = [] } = data;

  // Procesar datos de técnicos
  const processTechnicianData = () => {
    const technicianData = {};

    // Procesar órdenes por técnico
    orders.forEach((order) => {
      if (order.technician) {
        const techName = order.technician.name || order.technician;

        if (!technicianData[techName]) {
          technicianData[techName] = { name: techName, orders: 0, jobs: 0 };
        }

        technicianData[techName].orders += 1;
      }
    });

    // Procesar trabajos por técnico
    jobs.forEach((job) => {
      if (job.technician) {
        const techName = job.technician.name || job.technician;

        if (!technicianData[techName]) {
          technicianData[techName] = { name: techName, orders: 0, jobs: 0 };
        }

        technicianData[techName].jobs += 1;
      }
    });

    return Object.values(technicianData);
  };

  const chartData = processTechnicianData();

  return (
    <>
      <CardTitle className="mb-4">Rendimiento por Técnico</CardTitle>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orders" fill="#0ea5e9" name="Órdenes" />
            <Bar dataKey="jobs" fill="#10b981" name="Trabajos" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
