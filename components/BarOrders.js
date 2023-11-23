import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function BarOrders({ orders }) {
  const data = [
    { name: "Ordenes de Trabajo", mont: "Noviembre", count: orders.length },
  ];

  return (
    <BarChart
      data={data}
      width={50}
      height={150}
      /* margin={{ top: 5, left: 10, right: 80, bottom: 5 }} */
    >
      <XAxis dataKey="name"/>
      <Bar dataKey="count" fill="#0d6c95" label={{ position: "top" }} />
    </BarChart>
  );
}
