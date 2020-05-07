import React from "react"
import { TableCell, TableRow } from "@material-ui/core"

import { Problem } from "../../interfaces/interfaces"

import { ContestLink } from "./ContestLink"
import { ProblemCell } from "./ProblemCell"


interface ContestLineProps {
  contestId: string;
  problems: Problem[];
  problemCount: number;
  showCodeSize: boolean;
  showExecTime: boolean;
}

export const ContestLine: React.FC<ContestLineProps> = ({ contestId, problems, problemCount, showCodeSize, showExecTime }) => {
  const language: string = 'Python'
  const shortage: number = problemCount - problems.length
  return (
    <TableRow>
      <TableCell key={contestId} component="th" scope="row">
        <ContestLink contestId={contestId} />
      </TableCell>

      {problems.map((problem, index) => {
        return <ProblemCell
                  key={index} 
                  problem={problem}
                  showCodeSize={showCodeSize}
                  showExecTime={showExecTime}
                />
        })
      }

      {Array(shortage).fill(0).map((_, index) => {
        return <TableCell key={index} component="th" scope="row"/>
       })}
    </TableRow>
  )
}