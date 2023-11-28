import React, { useEffect } from "react";
import {
  Bar,
  BarChart,
  LabelList,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
} from "recharts";

export default function BarTechnical({ orders }) {
  const lm = orders.filter(
    (order) => order.owner.fullName === "Leonardo Moreno"
  );
  const rr = orders.filter(
    (order) => order.owner.fullName === "Ricardo Robledo"
  );
  const ph = orders.filter(
    (order) => order.owner.fullName === "Pablo Hernandez"
  );

  const data = [
    { name: "LM", value: lm.length },
    { name: "RR", value: rr.length },
    { name: "PH", value: ph.length },
  ];

  const dataOrder = data.sort(function (a, b) {
    if (a.value > b.value) {
      return -1;
    }
    if (a.value < b.value) {
      return 1;
    }
    // a must be equal to b
    return 0;
  });

  return (
    <BarChart data={dataOrder} width={125} height={170} margin={{ top: 30 }}>
      <XAxis dataKey="name" />
      <Bar dataKey="value" fill="#0d94d2">
        <LabelList data="name" position="top" />
      </Bar>
    </BarChart>
  );
}

{
  /* <PieChart width={150} height={150}>
  <Tooltip />
<Pie data={dataOrder} dataKey="value" cx="50%" cy="50%" outerRadius={40} innerRadius={30} fill="#0d94d2" label labelLine={false}/>
</PieChart>
     */
}
