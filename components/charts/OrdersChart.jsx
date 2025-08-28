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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";

export default function OrdersChart({ orders }) {
  const [timeRange, setTimeRange] = useState("all");

  // Función para procesar y agrupar los datos según el filtro de tiempo seleccionado
  const processOrderData = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    const now = new Date();
    let filteredOrders = orders;

    // Filtrar por rango de tiempo si no es "all"
    if (timeRange !== "all") {
      filteredOrders = orders.filter((order) => {
        if (!order.dateOrder) return false;

        const orderDate = new Date(order.dateOrder);
        let cutoffDate;

        switch (timeRange) {
          case "year":
            // Últimos 12 meses
            cutoffDate = new Date();
            cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
            break;

          case "month":
            // Últimos 30 días
            cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - 30);
            break;

          case "fifteendays":
            // Últimos 15 días
            cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - 15);
            break;

          default:
            return true;
        }

        return orderDate >= cutoffDate;
      });
    }

    // Agrupar por mes o día según el rango seleccionado
    const groupedData = {};

    filteredOrders.forEach((order) => {
      if (!order.dateOrder) return;

      const orderDate = new Date(order.dateOrder);
      let groupKey;

      // Determinar la clave de agrupamiento según el filtro de tiempo
      if (timeRange === "all" || timeRange === "year") {
        // Agrupar por mes y año
        groupKey = `${orderDate.getMonth() + 1}/${orderDate.getFullYear()}`;
      } else {
        // Agrupar por día y mes
        groupKey = `${orderDate.getDate()}/${orderDate.getMonth() + 1}`;
      }

      if (!groupedData[groupKey]) {
        groupedData[groupKey] = {
          name: groupKey,
          orders: 0,
          fullDate: orderDate, // Para ordenamiento
        };
      }

      groupedData[groupKey].orders += 1;
    });

    // Convertir a array y ordenar por fecha
    let result = Object.values(groupedData);

    result.sort((a, b) => a.fullDate - b.fullDate);

    // Formatear nombres para mostrar
    result = result.map((item) => ({
      name: item.name,
      orders: item.orders,
    }));

    return result;
  }, [orders, timeRange]);

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <CardTitle>Órdenes de Trabajo</CardTitle>
          <CardDescription>
            Distribución de órdenes por período de tiempo
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Seleccionar período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las órdenes</SelectItem>
            <SelectItem value="year">Último año</SelectItem>
            <SelectItem value="month">Último mes</SelectItem>
            <SelectItem value="fifteendays">Últimos 15 días</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="h-[300px]">
          {processOrderData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processOrderData}
                margin={{ top: 30, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} órdenes`, "Cantidad"]}
                  labelFormatter={(label) => `Período: ${label}`}
                />
                <Bar dataKey="orders" fill="#0ea5e9" name="Órdenes" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No hay datos para el período seleccionado
            </div>
          )}
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          <p>
            Total de órdenes en el período:{" "}
            {processOrderData.reduce((total, item) => total + item.orders, 0)}
          </p>
          <p>Total general de órdenes: {orders?.length || 0}</p>
        </div>
      </CardContent>
    </Card>
  );
}
