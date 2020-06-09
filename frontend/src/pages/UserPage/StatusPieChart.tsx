import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';


import { CountingByStatus } from "../../interfaces/interfaces"


type PieChartProps = {
  countingByStatus: CountingByStatus
}

// red, yellow, bluem green, brown, gray
const COLORS = ["#FF0000","#C0C000","#0000FF","#008000", "#804000", "#808080"];

export const StatusPieChart: React.FC<PieChartProps> = ({countingByStatus}) => {

  const data = [
    { name: "A", value: countingByStatus.A },
    { name: 'B', value: countingByStatus.B },
    { name: 'C', value: countingByStatus.C },
    { name: 'D', value: countingByStatus.D },
    { name: 'E', value: countingByStatus.E },
    { name: 'unsolved', value: countingByStatus.unsolved },
  ]

  return (
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            innerRadius="60%"
            outerRadius="80%"
            fill="#8884d8"
            paddingAngle={1}
            dataKey="value"
            >
            {
              data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
            }
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
  );
}
