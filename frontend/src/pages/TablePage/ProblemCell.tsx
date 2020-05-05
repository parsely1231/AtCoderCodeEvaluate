import React from "react"
import { TableCell, TableRow } from "@material-ui/core"

import { Problem } from "src/interfaces/interfaces"

import { ProblemLink } from "./ProblemLink"
import { CodeSizeSquare } from "./CodeSizeSquare"
import { ExecTimeCircle } from "./ExecTimeCircle"


interface ProblemCellProps {
  problem: Problem
}

export const ProblemCell : React.FC<ProblemCellProps> = ({ problem }) => {
  const language: string = 'Python';
  return (
        <TableCell>
          <CodeSizeSquare
            codeSizeAve={problem.codeSizeAverage?.get(language) || 3000}
          />
          <ExecTimeCircle
            execTimeAve={problem.execTimeAverage?.get(language) || 1200}
          />
          <ProblemLink
            constestId={problem.contest_id}
            lengthAve={3000}
            problemTitle={problem.title}
          />
        </TableCell>
  )
}