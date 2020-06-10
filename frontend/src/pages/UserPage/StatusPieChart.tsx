import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';


import { StatusCount } from "../../interfaces/interfaces"


type PieChartProps = {
  statusCount: StatusCount
}

// red, yellow, bluem green, brown, gray
const COLORS = ["#FF0000","#C0C000","#0000FF","#008000", "#804000", "#808080"];

export const StatusPieChart: React.FC<PieChartProps> = ({statusCount}) => {

  const data = [
    { name: "A", value: statusCount.A },
    { name: 'B', value: statusCount.B },
    { name: 'C', value: statusCount.C },
    { name: 'D', value: statusCount.D },
    { name: 'E', value: statusCount.E },
    { name: 'unsolved', value: statusCount.unsolved },
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
