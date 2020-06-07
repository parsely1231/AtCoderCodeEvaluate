import React, { useState, useCallback, useMemo, useEffect, ReactElement } from "react";
import { Button, ButtonGroup ,Checkbox, FormControlLabel, Table, TableBody, TableContainer } from "@material-ui/core"
// import { FixedSizeList } from "react-window"

import { ContestsWithProblems, Contest, BorderData, ContestType, Submission } from "../../interfaces/interfaces"


import { ContestLine } from "./ContestLine"
import { ContestTableHeader } from "./ContestTableHeader"


type TableProps = {
  contestType: ContestType,
  contests: Contest[],
  execBorderMap: Map<string, BorderData>,
  lengthBorderMap: Map<string, BorderData>,
  submissions: Submission[],
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

function toCodeStatusMap(submissions: Submission[]): Map<string, number>[] {
  const execStatusMap: Map<string, number> = new Map();
  const lengthStatusMap: Map<string, number> = new Map();

  submissions.forEach((submission) => {
    const problem = submission.problem_id;
    const newExec = submission.execution_time;
    const newLength = submission.length;

    const prevExec = execStatusMap.get(problem);
    const prevLength = lengthStatusMap.get(problem);

    if (prevExec == undefined || newExec < prevExec) {
      execStatusMap.set(problem, newExec);
    }
    if (prevLength == undefined || newLength < prevLength) {
      lengthStatusMap.set(problem, newLength);
    }
  })
  return [execStatusMap, lengthStatusMap];
}

export const ContestTable: React.FC<TableProps> = 
({contestType, contests, execBorderMap, lengthBorderMap, submissions, showCodeSize, showExecTime}) => {

  const title = getTitle(contestType);
  const baseProblemCount: number 
    = contestType === "ABC" ? 6
    :contestType ==='ARC' ? 4
    : 7;
  
  const lengthBorderMedianList = [...lengthBorderMap.values()].map(border => border.rank_c)
  lengthBorderMedianList.sort().reverse()
  const lengthBorderQuantiles = quantiles(lengthBorderMedianList, [0.3, 1, 3, 7, 15, 30, 50, 100])
  const mod = Math.ceil((lengthBorderMedianList[0] - lengthBorderMedianList[-1]) / 8)
  const lowerContestType = contestType.toLowerCase()
  const filterdContests = contests.filter((contest) => contest.contestId.slice(0, 3) === lowerContestType)

  const [execStatusMap, lengthStatusMap] = useMemo(() => toCodeStatusMap(submissions), [submissions])

  return (
    <div className="contest-table">
      <h2>{title}</h2>
      <TableContainer>
        <Table>
          <ContestTableHeader contestType={contestType} />

          <TableBody>

            {filterdContests.map((contest) => {
              return (
                <ContestLine
                  key={contest.contestId}
                  contestId={contest.contestId}
                  problems={contest.problems}
                  mod={mod}
                  baseProblemCount={baseProblemCount}
                  execBorderMap={execBorderMap}
                  execStatusMap={execStatusMap}
                  lengthBorderMap={lengthBorderMap}
                  lengthStatusMap={lengthStatusMap}
                  lengthBorderQuantiles={lengthBorderQuantiles}
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