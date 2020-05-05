import React from "react"
import { TableCell, TableRow } from "@material-ui/core"

import { ContestLink } from "./ContestLink"
import { ProblemLink } from "./ProblemLink"
import { LengthSquare } from "./LengthSquare"


interface TableLineProps {
  contestId:string;
  problems:string[];
}

const TableLine: React.FC<TableLineProps> = (props) => {
  return (
    <TableRow>
      <TableCell key={props.contestId} component="th" scope="row">
        <ContestLink contestId={props.contestId} />
      </TableCell>

      {props.problems.map((problem) => {
        return (
        <TableCell>
          <LengthSquare
            lengthAve={3000}
          />
          <ProblemLink
            constestId={props.contestId}
            lengthAve={3000}
            problemTitle={problem}
          />
        </TableCell>
        )
      })}
    </TableRow>
  )
}