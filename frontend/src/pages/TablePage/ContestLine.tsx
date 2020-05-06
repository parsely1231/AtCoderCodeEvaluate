import React from "react"
import { TableCell, TableRow } from "@material-ui/core"

import { Problem } from "src/interfaces/interfaces"

import { ContestLink } from "./ContestLink"
import { ProblemCell } from "./ProblemCell"


interface ContestLineProps {
  contestId :string;
  problems :Problem[];
  showCodeSize: boolean;
  showExecTime: boolean;
}

export const ContestLine: React.FC<ContestLineProps> = ({ contestId, problems, showCodeSize, showExecTime }) => {
  const language: string = 'Python'
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
        })}

    </TableRow>
  )
}