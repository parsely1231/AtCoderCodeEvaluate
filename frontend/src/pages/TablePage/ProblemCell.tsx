import React from "react"
import { TableCell } from "@material-ui/core"

import { Problem } from "../../interfaces/interfaces"

import { ProblemLink } from "./ProblemLink"
import { CodeSizeSquare } from "./CodeSizeSquare"
import { ExecTimeCircle } from "./ExecTimeCircle"


interface ProblemCellProps {
  problem: Problem;
  mod: number;
  execBorderMedian: number | undefined;
  execUserRank: number;
  lengthBorderMedian: number | undefined;
  lengthBorderQuantiles: number[];
  lengthUserRank: number;
  showCodeSize: boolean;
  showExecTime: boolean;
}

export const ProblemCell : React.FC<ProblemCellProps> = 
({ problem, mod, execBorderMedian, execUserRank, lengthBorderMedian, 
  lengthBorderQuantiles, lengthUserRank, showCodeSize, showExecTime }) => {

  return (
        <TableCell>
          <CodeSizeSquare
            medianBorder={lengthBorderMedian}
            quantiles={lengthBorderQuantiles}
            mod={mod}
            showCodeSize={showCodeSize}
          />
          <ExecTimeCircle
            medianBorder={execBorderMedian}
            showExecTime={showExecTime}
          />
          <ProblemLink
            constestId={problem.contest_id}
            problemTitle={problem.title}
          />
        </TableCell>
  )
}