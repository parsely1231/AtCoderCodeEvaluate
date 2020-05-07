import React from "react"
import { TableCell } from "@material-ui/core"

import { Problem } from "../../interfaces/interfaces"

import { ProblemLink } from "./ProblemLink"
import { CodeSizeSquare } from "./CodeSizeSquare"
import { ExecTimeCircle } from "./ExecTimeCircle"


interface ProblemCellProps {
  problem: Problem;
  showCodeSize: boolean;
  showExecTime: boolean;
}

export const ProblemCell : React.FC<ProblemCellProps> = ({ problem, showCodeSize, showExecTime }) => {
  const language: string = 'Python';
  return (
        <TableCell>
          <CodeSizeSquare
            codeSizeAve={problem.codeSizeAverage?.get(language) || 3000}
            showCodeSize={showCodeSize}
          />
          <ExecTimeCircle
            execTimeAve={problem.execTimeAverage?.get(language) || 1200}
            showExecTime={showExecTime}
          />
          <ProblemLink
            constestId={problem.contest_id}
            lengthAve={3000}
            problemTitle={problem.title}
          />
        </TableCell>
  )
}