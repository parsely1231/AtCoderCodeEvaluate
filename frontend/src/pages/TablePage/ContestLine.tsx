import React from "react"
import { TableCell, TableRow } from "@material-ui/core"

import { Problem, BorderData } from "../../interfaces/interfaces"

import { ContestLink } from "./ContestLink"
import { ProblemCell } from "./ProblemCell"


interface ContestLineProps {
  contestId: string;
  problems: Problem[];
  baseProblemCount: number;
  execBorderMap: Map<string, BorderData>,
  lengthBorderMap: Map<string, BorderData>,
  execStatusMap: Map<string, number>,
  lengthStatusMap: Map<string, number>,
  lengthBorderQuantiles: number[],
  showCodeSize: boolean;
  showExecTime: boolean;
}


function calculateRank(status: number | undefined, border: BorderData | undefined): number {
  if (status === undefined) return 0;
  if (border === undefined) return 5;
  if (status <= border.rank_a) return 5;
  if (status <= border.rank_b) return 4;
  if (status <= border.rank_c) return 3;
  if (status <= border.rank_d) return 2;
  return 1;
}


export const ContestLine: React.FC<ContestLineProps> =
 ({ contestId, problems, baseProblemCount, showCodeSize, showExecTime,
   execBorderMap, execStatusMap, lengthBorderMap, lengthStatusMap, lengthBorderQuantiles }) => {

  const shortage: number = baseProblemCount - problems.length
  return (
    <TableRow>
      <TableCell key={contestId} component="th" scope="row">
        <ContestLink contestId={contestId} />
      </TableCell>

      {problems.map((problem, index) => {
        const execStatus = execStatusMap.get(problem.id)
        const execBorder = execBorderMap.get(problem.id)
        const lengthStatus = lengthStatusMap.get(problem.id)
        const lengthBorder = lengthBorderMap.get(problem.id)

        const execRank = calculateRank(execStatus, execBorder)
        const lengthRank = calculateRank(lengthStatus, lengthBorder)

        return <ProblemCell
                  key={index} 
                  problem={problem}
                  execBorderMedian={execBorder?.rank_c}
                  execUserRank={execRank}
                  lengthBorderMedian={lengthBorder?.rank_c}
                  lengthBorderQuantiles={lengthBorderQuantiles}
                  lengthUserRank={lengthRank}
                  showCodeSize={showCodeSize}
                  showExecTime={showExecTime}
                />
        })
      }

      {Array(shortage).fill(0).map((_, index) => {
        return <TableCell key={"blank"+index} component="th" scope="row"/>
       })}
    </TableRow>
  )
}