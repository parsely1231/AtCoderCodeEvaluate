import React from "react"
import { TableCell } from "@material-ui/core"

import { Problem } from "../../interfaces/interfaces"

import { ProblemLink } from "./ProblemLink"
import { CodeSizeSquare } from "./CodeSizeSquare"
import { ExecTimeCircle } from "./ExecTimeCircle"


interface ProblemCellProps {
  problem: Problem;
  execBorderMedian: number | undefined;
  execUserRank: number;
  lengthBorderMedian: number | undefined;
  lengthBorderQuantiles: number[];
  lengthUserRank: number;
  showCodeSize: boolean;
  showExecTime: boolean;
}

export const ProblemCell : React.FC<ProblemCellProps> = 
({ problem, execBorderMedian, execUserRank, lengthBorderMedian, 
  lengthBorderQuantiles, lengthUserRank, showCodeSize, showExecTime }) => {

  return (
        <TableCell>
          <CodeSizeSquare
            medianBorder={lengthBorderMedian}
            quantiles={lengthBorderQuantiles}
            showCodeSize={showCodeSize}
            lengthUserRank={lengthUserRank}
          />
          <ExecTimeCircle
            medianBorder={execBorderMedian}
            showExecTime={showExecTime}
            execUserRank={execUserRank}
          />
          <ProblemLink
            problem={problem}
          />
        </TableCell>
  )
}