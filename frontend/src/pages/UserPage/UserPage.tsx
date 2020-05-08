import React from "react";

import { StatusBarChart } from "../../components/BarChart"
import { StatusPieChart } from "../../components/StatusPieChart"


export const UserPage: React.FC = () => {
  return (
    <div>
      <StatusPieChart/>
      <StatusBarChart/>
    </div>

  )
}