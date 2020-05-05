import React, { useState, useCallback, useMemo, useEffect, ReactElement } from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {Button, ButtonGroup} from "@material-ui/core"


import { ContestLink }  from "./ContestLink";
import { ProblemLink } from "./ProblemLink";
import { fetchContest } from "./fetchContest";
import { LengthSquare } from "./LengthSquare"




console.log('header elem create')

const getHeaderElems = (contestType: string): string[] => {
  switch (contestType) {
    case "ABC":
      return ['Contest', 'A', 'B', 'C', 'D', 'E', 'F']
    
    case "ARC":
      return ['Contest', 'C', 'D', 'E', 'F']
    
    case "AGC":
      return ['Contest', 'A', 'B', 'C', 'D', 'E', 'F', 'F2']
    
    default:
      return ['Contest', 'A', 'B', 'C', 'D', 'E', 'F']
    }
  }

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

const apiToContestData = (apiData: Map<string, string[]>): Map<string, React.ReactElement[]>  => {
  const contestData: Map<string, React.ReactElement[]> = new Map([
    ['ABC', []],
    ['ARC', []],
    ['AGC', []],
  ])

  apiData.forEach((problems, contestId) => {
    console.log(contestId)
    const contestType = contestId.slice(0, 3).toUpperCase();
    contestData.get(contestType)?.push(
      <TableLine
        contestId={contestId.toUpperCase()}
        problems={problems}
      />
    )
  })
  return contestData
}

export const ContestTable: React.FC = () => {
  const [contestData, setContestData] = useState(new Map<string, ReactElement[]>())
  console.log('FIRST');

  useEffect(() => {
    fetchContest()
      .then((apiData) => setContestData(apiToContestData(apiData)))
  }, []);

  const [contestType, setContestType]: [string, Function] = useState('ABC');
  const setABC = useCallback(() => setContestType('ABC'), []);
  const setARC = useCallback(() => setContestType('ARC'), []);
  const setAGC = useCallback(() => setContestType('AGC'), []);


  
  console.log('finish table line list')

  
  const title :React.ReactElement = <h2>{getTitle(contestType)}</h2>

  const headerElems: string[] = getHeaderElems(contestType);

  return (
    <TableContainer>
    <ButtonGroup>
      <Button variant="contained" onClick={setABC}>ABC</Button>
      <Button variant="contained" onClick={setARC}>ARC</Button>
      <Button variant="contained" onClick={setAGC}>AGC</Button>
    </ButtonGroup>
      {title}
      <Table>
        <TableHead>
          <TableRow>
            {headerElems.map((elem) => {
              return (
              <TableCell>{elem}</TableCell>
              )
            })}
          </TableRow>
        </TableHead>
        <TableBody>

          {contestData.get(contestType)}
          
        </TableBody>
      </Table>
    </TableContainer>
  );
}