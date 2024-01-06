import React, { useState } from "react";
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
  const [ene, setEne] = useState(
    orders.filter((order) => new Date(order.createdAt).getMonth() === 0)
  );
  const [feb, setFeb] = useState(
    orders.filter((order) => new Date(order.createdAt).getMonth() === 1)
  );
  const [mar, setMar] = useState(
    orders.filter((order) => new Date(order.createdAt).getMonth() === 2)
  );
  const [abr, setAbr] = useState(
    orders.filter((order) => new Date(order.createdAt).getMonth() === 3)
  );
  const [may, setMay] = useState(
    orders.filter((order) => new Date(order.createdAt).getMonth() === 4)
  );
  const [jun, setJun] = useState(
    orders.filter((order) => new Date(order.createdAt).getMonth() === 5)
  );
  const [jul, setJul] = useState(
    orders.filter((order) => new Date(order.createdAt).getMonth() === 6)
  );
  const [ago, setAgo] = useState(
    orders.filter((order) => new Date(order.createdAt).getMonth() === 7)
  );
  const [sep, setSep] = useState(
    orders.filter((order) => new Date(order.createdAt).getMonth() === 8)
  );
  const [oct, setOct] = useState(
    orders.filter((order) => new Date(order.createdAt).getMonth() === 9)
  );
  const [nov, setNov] = useState(
    orders.filter((order) => new Date(order.createdAt).getMonth() === 10)
  );
  const [dic, setDic] = useState(
    orders.filter((order) => new Date(order.createdAt).getMonth() === 11)
  );
  const data = [
    { month: "Ene", count: ene.length },
    { month: "Feb", count: feb.length },
    { month: "Mar", count: mar.length },
    { month: "Abr", count: abr.length },
    { month: "May", count: may.length },
    { month: "Jun", count: jun.length },
    { month: "Jul", count: jul.length },
    { month: "Ago", count: ago.length },
    { month: "Sep", count: sep.length },
    { month: "Oct", count: oct.length },
    { month: "Nov", count: nov.length },
    { month: "Dic", count: dic.length },
  ];

  return (
    <LineChart data={data} width={300} height={170} margin={{ top: 15 }}>
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
