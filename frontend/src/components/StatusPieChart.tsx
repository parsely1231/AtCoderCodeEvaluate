import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
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
  // red, yellow, bluem green, brown, gray
  const COLORS = ["#FF0000","#C0C000","#0000FF","#008000", "#804000", "#808080"];
  const data = [
    { name: "A", value: scoredData.A },
    { name: 'B', value: scoredData.B },
    { name: 'C', value: scoredData.C },
    { name: 'D', value: scoredData.D },
    { name: 'E', value: scoredData.E },
    { name: 'unsolved', value: scoredData.unsolved },
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
