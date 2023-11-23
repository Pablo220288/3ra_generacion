import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function BarOrdersAnnual({ orders }) {
  const data = [
    { month: "Ene", count: 0 },
    { month: "Feb", count: 0 },
    { month: "Mar", count: 0 },
    { month: "Abr", count: 0 },
    { month: "May", count: 0 },
    { month: "Jun", count: 0 },
    { month: "Jul", count: 0 },
    { month: "Ago", count: 0 },
    { month: "Sep", count: 0 },
    { month: "Oct", count: 0 },
    { month: "Nov", count: orders.length },
    { month: "Dic", count: 0 },
  ];

  return (

      <LineChart data={data} width={300} height={170}>
        <XAxis dataKey="month" padding={{ left: 15, right: 15 }} />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#0d94d2"
          activeDot={{ r: 6 }}
          label={{ position: "top" }} 
        />
      </LineChart>

  );
}
