import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip,
} from 'recharts';


interface ScoredData {
  A: number,
  B: number,
  C: number,
  D: number,
  E: number,
  unsolved: number
}

interface PieChartProps {
  scoredData: ScoredData
}

export const StatusPieChart: React.FC<PieChartProps> = ({scoredData}) => {
  // gray, brown, green, blue, yellow, red
  const COLORS = ["#808080", "#804000", "#008000", "#0000FF", "#C0C000", "#FF0000"];
  const data = [
    { name: 'unsolved', value: scoredData.unsolved },
    { name: 'E', value: scoredData.E },
    { name: 'D', value: scoredData.D },
    { name: 'C', value: scoredData.C },
    { name: 'B', value: scoredData.B },
    { name: "A", value: scoredData.A }
  ]
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
        paddingAngle={1}
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
