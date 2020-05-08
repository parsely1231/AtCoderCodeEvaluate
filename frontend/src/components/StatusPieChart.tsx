import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip,
} from 'recharts';

const data = [
  { name: 'A', value: 400 },
  { name: 'B', value: 0 },
  { name: 'C', value: 300 },
  { name: 'D', value: 200 },
  { name: 'E', value: 100 },
  { name: "unsolved", value: 100 }
];
const COLORS = ["#808080", "#804000", "#008000", "#0000FF", "#C0C000", "#FF0000"];

// gray
// brown
// green
// blue
// yellow  
// red


export const StatusPieChart = () => {
    return (
      <PieChart width={800} height={400}>
        <Pie
          data={data}
          cx={120}
          cy={200}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          label
          paddingAngle={5}
          dataKey="value"
        >
          {
            data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
          }
        </Pie>
        <Tooltip />
      </PieChart>
    );
}
