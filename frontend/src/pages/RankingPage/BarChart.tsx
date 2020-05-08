import React, { PureComponent } from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const getData = (score: number, count: number) => {
  return {
    score: score,
    count: count
  }
}

const data = [
  getData(1, 10),
  getData(2, 30),
  getData(3, 40),
  getData(4, 10),
  getData(5, 3)
]

const colors = (score: number): string => {
  if (score <= 1) return "#804000";  // brown
  else if (score <= 2) return "#008000";  // green
  else if (score <= 3) return "#0000FF";  // blue
  else if (score <= 4) return "#C0C000";  // yellow
  else return "#FF0000";  // red
}


export const RankingChart: React.FC = () => {
    return (
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="score" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8">
          {
            data.map(({ score }) => (
              <Cell key={`cell-${score}`} fill={colors(score)} />
            ))
          }
        </Bar>
      </BarChart>
    );
}


