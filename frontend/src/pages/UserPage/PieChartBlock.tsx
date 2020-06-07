import React, { useEffect, useState, useMemo } from "react";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { StatusPieChart } from "../../components/StatusPieChart";
import { Submission, BorderData } from "../../interfaces/interfaces";


type Props = {
  title: string,
  countingByRankAndProblem: CountingByStatusAndProblem
}

interface CountingByStatus {
  A: number
  B: number
  C: number
  D: number
  E: number
  unsolved: number
}

type CountingByStatusAndProblem = Map<string, CountingByStatus>


const PieChartBlock: React.FC<Props> = ({title, countingByRankAndProblem}) => {


  return (
    <>
      <h2>{title}</h2>
      <div className="piecharts-line">
        {Array.from(countingByRankAndProblem).map(([problemRank, rankCount]) => {
          return (
            <div className="piechart-box">
              <StatusPieChart scoredData={rankCount}/>
              <h3>Problem {problemRank.toUpperCase()}</h3>
            </div>
          )
        })}
      </div>
    </>
  )
}