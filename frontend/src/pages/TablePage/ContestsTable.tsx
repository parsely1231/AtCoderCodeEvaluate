import React, { useState, useCallback, useMemo, useEffect, ReactElement } from "react";
import { Button, ButtonGroup ,Checkbox, FormControlLabel, Table, TableBody, TableContainer } from "@material-ui/core"
// import { FixedSizeList } from "react-window"

import { ContestsWithProblems, Contest, BorderData } from "../../interfaces/interfaces"

import { fetchContest } from "./fetchContest";

import { ContestLine } from "./ContestLine"
import { ContestTableHeader } from "./ContestTableHeader"


type TableProps = {
  contests: Contest[],
  execBorder: Map<string, BorderData>
  lengthBorder: Map<string, BorderData>
}


export const ContestTable: React.FC<TableProps> = ({contests, execBorder, lengthBorder, }) => {


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
    <div className="contest-table-page">
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
      <div>
        <ButtonGroup>
          <Button variant="contained" onClick={setABC}>ABC</Button>
          <Button variant="contained" onClick={setARC}>ARC</Button>
          <Button variant="contained" onClick={setAGC}>AGC</Button>
        </ButtonGroup>
      </div>

      <h2>{getTitle(contestType)}</h2>
      <TableContainer>
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
    </div>

  );
}