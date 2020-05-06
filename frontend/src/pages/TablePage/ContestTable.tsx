import React, { useState, useCallback, useMemo, useEffect, ReactElement } from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import { Button, ButtonGroup } from "@material-ui/core"

import { ContestsData, Contest } from "src/interfaces/interfaces"

import { fetchContest } from "./fetchContest";

import { ContestLine } from "./ContestLine"
import { ContestTableHeader } from "./ContestTableHeader"


const getTitle = (contestType:string): string => {
  switch (contestType) {
  case "ABC":
    return "AtCoder Beginner Contest"
  
  case "ARC":
    return "AtCoder Regular Contest"
  
  case "AGC":
    return "AtCoder Grand Contest"
  
  default:
    return "AtCoder Beginner Contest"
  }
}

type ContestType = string

const apiToContestDataByType = (apiData: ContestsData): Map<ContestType, Contest[]>  => {
  const contestsDataByType: Map<ContestType, Contest[]> = new Map([
    ['ABC', []],
    ['ARC', []],
    ['AGC', []],
  ])

  apiData.forEach((problems, contestId) => {
    const contestType = contestId.slice(0, 3).toUpperCase();
    const contest: Contest = {
      contestId: contestId,
      problems: problems
    }
    contestsDataByType.get(contestType)?.push(contest)
  })
  // for (const key in contestsDataByType) {
  //   contestsDataByType.get(key)?.reverse();
  // }
  // for (const key in contestsDataByType) {
  //   contestsDataByType.get(key)?.sort((contestA, contestB) => {
  //     return contestA.contestId > contestB.contestId ? 1 : -1  // reverse sort key=contestId
  //   });
  // }
  return contestsDataByType
}

export const ContestTable: React.FC = () => {
  const [contestDataByType, setContestDataByType] = useState(new Map<ContestType, Contest[]>())

  useEffect(() => {
    fetchContest()
      .then((apiData) => setContestDataByType(apiToContestDataByType(apiData)))
  }, []);

  const [contestType, setContestType]: [string, Function] = useState('ABC');
  const setABC = useCallback(() => setContestType('ABC'), []);
  const setARC = useCallback(() => setContestType('ARC'), []);
  const setAGC = useCallback(() => setContestType('AGC'), []);
  
  const selectedContests = contestDataByType.get(contestType)?.reverse();

  return (
    <TableContainer>
      <ButtonGroup>
        <Button variant="contained" onClick={setABC}>ABC</Button>
        <Button variant="contained" onClick={setARC}>ARC</Button>
        <Button variant="contained" onClick={setAGC}>AGC</Button>
      </ButtonGroup>
        <h2>{getTitle(contestType)}</h2>
        <Table>
          <ContestTableHeader contestType={contestType} />

          <TableBody>
            {selectedContests?.map((contest) => {
              return (
                <ContestLine
                  contestId={contest.contestId}
                  problems={contest.problems}
                />
              )
            })}
          </TableBody>

        </Table>
    </TableContainer>
  );
}