import React, { useState, useCallback, useMemo, useEffect } from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


import { ContestLink }  from "./ContestLink";
import { ProblemLink } from "./ProblemLink";
import { fetchContest } from "./fetchContest";
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
            lengthAve={1900}
          />
          <ProblemLink
            constestId={props.contestId}
            problemTitle={problem}
          />
        </TableCell>
        )
      })}
    </TableRow>
  )
}


export const ContestTable: React.FC = () => {
  const [contestData, setContestData] = useState(new Map<string, string[]>())
  const tableHeaderElement = ['Contest', 'A', 'B', 'C', 'D', 'E', 'F']

  useEffect(() => {
    fetchContest().then(data => setContestData(data))
  }, []);

  const [contestType, setContestType]: [string, Function] = useState('ABC');
  const setABC = useCallback(() => setContestType('ABC'), []);
  const setARC = useCallback(() => setContestType('ARC'), []);
  const setAGC = useCallback(() => setContestType('AGC'), []);

  const tableLineList:React.ReactElement[] = []

  contestData.forEach((problems, contestId) => {
    if (contestId.slice(0,3).toUpperCase() === contestType) {
      tableLineList.push(
        <TableLine
          contestId={contestId.toUpperCase()}
          problems={problems}
        />)
      }
  })
  tableLineList.reverse();
  console.log('finish table line list')

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
  }}
  const title :React.ReactElement = <h2>{getTitle(contestType)}</h2>

  return (
    <TableContainer>
      <button onClick={setABC}>ABC</button>
      <button onClick={setARC}>ARC</button>
      <button onClick={setAGC}>AGC</button>
      {title}
      <Table>
        <TableHead>
          <TableRow>
            {tableHeaderElement.map((elem) => {
              return (
              <TableCell>{elem}</TableCell>
              )
            })}
          </TableRow>
        </TableHead>
        <TableBody>

          {tableLineList}
          
        </TableBody>
      </Table>
    </TableContainer>
  );
}