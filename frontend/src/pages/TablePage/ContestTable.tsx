import React, { useState, useCallback, useMemo, useEffect, ReactElement } from "react";
import { Button, ButtonGroup ,Checkbox, FormControlLabel, Table, TableBody, TableContainer } from "@material-ui/core"
// import { FixedSizeList } from "react-window"

import { ContestsData, Contest } from "../../interfaces/interfaces"

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

function apiToContestDataByType (apiData: ContestsData): Map<ContestType, Contest[]> {
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
  for (const key of contestsDataByType.keys()) {
    contestsDataByType.get(key)?.reverse();
  }

  return contestsDataByType
}

export const ContestTable: React.FC = () => {
  const [contestDataByType, setContestDataByType] = useState(new Map<ContestType, Contest[]>())
  const [showCodeSize, setShowCodeSize] = useState(true);
  const [showExecTime, setShowExecTime] = useState(true);

  useEffect(() => {
    fetchContest()
      .then((apiData) => setContestDataByType(apiToContestDataByType(apiData)))
  }, []);

  const [contestType, setContestType]: [string, Function] = useState('ABC');
  const setABC = useCallback(() => setContestType('ABC'), []);
  const setARC = useCallback(() => setContestType('ARC'), []);
  const setAGC = useCallback(() => setContestType('AGC'), []);

  const problemCount: number = 
    contestType === "ABC" ? 6
    :contestType ==='ARC' ? 4
    : 7;
  
  const handleShowCodeSize = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setShowCodeSize(event.target.checked)
  }, [])

  const handleShowExecTime = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setShowExecTime(event.target.checked)
  }, [])

  const selectedContests = contestDataByType.get(contestType);
  // const length = selectedContests? selectedContests.length : 0
  // const Line = ({ index, style }: {index: number, style:any}) => {
  //   const contest = selectedContests? selectedContests[index] : null;
  //   if (contest == null) return null;
  //   return (
  //     <ContestLine
  //       key={contest.contestId}
  //       contestId={contest.contestId}
  //       problems={contest.problems}
  //       showCodeSize={showCodeSize}
  //       showExecTime={showExecTime}
  //     />
  //   )}

  return (
    <TableContainer>
      <div>
        <FormControlLabel
            value="showCodeSize"
            control={<Checkbox color="primary" checked={showCodeSize} onChange={handleShowCodeSize}/>}
            label="ShowCodeSize"
            labelPlacement="start"
        />
        <FormControlLabel
            value="showExecTime"
            control={<Checkbox color="primary" checked={showExecTime} onChange={handleShowExecTime}/>}
            label="ShowExecTime"
            labelPlacement="start"
        />
      </div>
      <ButtonGroup>
        <Button variant="contained" onClick={setABC}>ABC</Button>
        <Button variant="contained" onClick={setARC}>ARC</Button>
        <Button variant="contained" onClick={setAGC}>AGC</Button>
      </ButtonGroup>
        <h2>{getTitle(contestType)}</h2>
        <Table>
          <ContestTableHeader contestType={contestType} />

          <TableBody>
            {/* <FixedSizeList
              className="List"
              height={1000}
              itemCount={length}
              itemSize={20}
              width={1600}
            >
              {Line}
            </FixedSizeList> */}
            {selectedContests?.map((contest) => {
              return (
                <ContestLine
                  key={contest.contestId}
                  contestId={contest.contestId}
                  problems={contest.problems}
                  problemCount={problemCount}
                  showCodeSize={showCodeSize}
                  showExecTime={showExecTime}
                />
              )
            })}
          </TableBody>

        </Table>
    </TableContainer>
  );
}