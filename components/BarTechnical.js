import React, { useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function BarTechnical({ orders }) {
  const data = [
    { name: "LM", value: 4 },
    { name: "RR", value: 2 },
    { name: "PH", value: 1 },
  ];
  return (
    <BarChart
      data={data}
      width={125}
      height={170}
      margin={{ top: 30}}
    >
      <XAxis dataKey="name" />
      <Bar dataKey="value" fill="#0d94d2">
        <LabelList data="name" position="top"/>
      </Bar>
    </BarChart>
  );
}
