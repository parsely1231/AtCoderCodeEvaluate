import React from "react"
import { TableCell, TableRow } from "@material-ui/core"

import   from "src/"

import { ProblemLink } from "./ProblemLink"
import { LengthSquare } from "./LengthSquare"


interface Problem {
  title: string;
  contestId: string;
  codeSizeAverage?: number;
  execTimeAverage?: number;
}


interface ProblemCellProps {
  problem: Problem
}


export const ProblemCell : React.FC<ProblemCellProps> = (props) => {
  return (

        <TableCell>
          <LengthSquare
            lengthAve={3000}
          />
          <ProblemLink
            constestId={props.problem.contestId}
            lengthAve={3000}
            problemTitle={props.problem.title}
          />
        </TableCell>
  )
}