import React, { useEffect, useState, useMemo } from "react";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { StatusPieChart } from "./StatusPieChart";
import { CountingByStatus } from "../../interfaces/interfaces";


type CountingByStatusAndProblem = Map<ProblemRank, CountingByStatus>
type ProblemRank = "a" | "b" | "c" | "d" | "e" | "f"

type Props = {
  title: string,
  countingByStatusByProblemRank: CountingByStatusAndProblem
}


export const PieChartBlock: React.FC<Props> = ({title, countingByStatusByProblemRank}) => {

  return (
    <>
      <h2>{title}</h2>
      <div className="piecharts-line">
        {Array.from(countingByStatusByProblemRank).map(([problemRank, CountingByStatus]) => {
          return (
            <div className="piechart-box">
              <StatusPieChart countingByStatus={CountingByStatus}/>
              <h3>Problem {problemRank.toUpperCase()}</h3>
            </div>
          )
        })}
      </div>
    </>
  )
}