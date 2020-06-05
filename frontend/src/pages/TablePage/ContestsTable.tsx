import React, { useState, useCallback, useMemo, useEffect, ReactElement } from "react";
import { Button, ButtonGroup ,Checkbox, FormControlLabel, Table, TableBody, TableContainer } from "@material-ui/core"
// import { FixedSizeList } from "react-window"

import { ContestsWithProblems, Contest, BorderData, ContestType } from "../../interfaces/interfaces"


import { ContestLine } from "./ContestLine"
import { ContestTableHeader } from "./ContestTableHeader"


type TableProps = {
  contestType: ContestType,
  contests: Contest[],
  execBorderMap: Map<string, BorderData>,
  lengthBorderMap: Map<string, BorderData>,
  execStatusMap: Map<string, number>,
  lengthStatusMap: Map<string, number>,
  showExecTime: boolean,
  showCodeSize: boolean,
}

function getTitle(contestType: ContestType): string {
  switch (contestType) {
    case "ABC": return "AtCoder Begginer Contest";
    case "ARC": return "AtCoder Regular Contest";
    case "AGC": return "AtCoder Grand Contest";
  }
}


function quantile(sortedArray: number[], percentile: number) {
  const index = percentile/100. * (sortedArray.length-1);
  if (Math.floor(index) == index) return sortedArray[index];

  const i = Math.floor(index)
  const fraction = index - i;
  const result = sortedArray[i] + (sortedArray[i+1] - sortedArray[i]) * fraction;
  return result;
}

function quantiles(sortedArray: number[], percentiles: number[]) {
  return percentiles.map((percentile) => quantile(sortedArray, percentile))
}


export const ContestTable: React.FC<TableProps> = 
({contestType, contests, execBorderMap, lengthBorderMap, execStatusMap, lengthStatusMap, showCodeSize, showExecTime}) => {

  const title = getTitle(contestType);
  const baseProblemCount: number = contestType === "ABC" ? 6
                                  :contestType ==='ARC' ? 4
                                  : 7;
  
  const lengthBorderMedianList = [...lengthBorderMap.values()].map(border => border.rank_c)
  lengthBorderMedianList.sort().reverse()
  const lengthBorderQuantiles = quantiles(lengthBorderMedianList, [0.3, 1, 3, 7, 15, 30, 50, 100])
  const mod = Math.ceil((lengthBorderMedianList[0] - lengthBorderMedianList[-1]) / 8)

  return (
    <div className="contest-table">
      <h2>{title}</h2>
      <TableContainer>
        <Table>
          <ContestTableHeader contestType={contestType} />

          <TableBody>

            {contests.map((contest) => {
              return (
                <ContestLine
                  key={contest.contestId}
                  contestId={contest.contestId}
                  problems={contest.problems}
                  baseProblemCount={baseProblemCount}
                  showCodeSize={showCodeSize}
                  showExecTime={showExecTime}
                />
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>

  );
}