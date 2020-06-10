import React, {useMemo, useCallback, useState} from 'react';
import { connect, PromiseState } from "react-refetch"

import { Button, ButtonGroup, Checkbox, FormControlLabel } from '@material-ui/core';

import { cachedContestsWithProblems, cachedExecBorder, cachedLengthBorder, cachedUserSubmissions } from "../../utils/cachedApiClient"
import { ContestsWithProblems, Submission, BorderData, ContestType, Problem, Contest } from "../../interfaces/interfaces"

import { ContestTable } from "./ContestTable"


type OuterProps = {
  userId: string
  language: string
}

interface InnerProps extends OuterProps {
  contestsWithProblemsFetch: PromiseState<ContestsWithProblems>;
  submissionsFetch: PromiseState<Submission[]>;
  execBorderFetch: PromiseState<Map<string, BorderData>>;
  lengthBorderFetch: PromiseState<Map<string, BorderData>>;
}


export const InnerContestTablePage: React.FC<InnerProps> = 
({contestsWithProblemsFetch, submissionsFetch, execBorderFetch, lengthBorderFetch}) => {
  const [contestType, setContestType]: [ContestType, Function] = useState("ABC")
  const [showCodeSize, setShowCodeSize] = useState(true);
  const [showExecTime, setShowExecTime] = useState(true);

  const handleShowCodeSize = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setShowCodeSize(event.target.checked)
  }, [])

  const handleShowExecTime = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setShowExecTime(event.target.checked)
  }, [])

  const contests: Contest[] = contestsWithProblemsFetch.fulfilled
    ? [...contestsWithProblemsFetch.value.entries()].reverse().map((entry): Contest => {
      const [contestId, problems]: [string, Problem[]] = entry
      return {
        contestId: contestId,
        problems: problems
      }
    })
    : []
  
  const execBorderMap = execBorderFetch.fulfilled
    ? execBorderFetch.value
    : new Map()

  const lengthBorderMap = lengthBorderFetch.fulfilled
    ? lengthBorderFetch.value
    : new Map()

  const submissions = submissionsFetch.fulfilled
    ? submissionsFetch.value
    : []

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
          <Button variant="contained" onClick={() => setContestType("ABC")}>ABC</Button>
          <Button variant="contained" onClick={() => setContestType("ARC")}>ARC</Button>
          <Button variant="contained" onClick={() => setContestType("AGC")}>AGC</Button>
        </ButtonGroup>
      </div>

      <ContestTable
        contestType={contestType}
        contests={contests}
        showCodeSize={showCodeSize}
        showExecTime={showExecTime}
        execBorderMap={execBorderMap}
        lengthBorderMap={lengthBorderMap}
        submissions={submissions}
      />
    </div>

  );
}

export const ContestTablePage = connect<OuterProps, InnerProps>(({userId, language}) => ({
  contestsWithProblemsFetch: {
    comparison: null,
    value: (): Promise<ContestsWithProblems> =>
      cachedContestsWithProblems()
  },
  submissionsFetch: {
    comparison: [userId],
    value: (): Promise<Submission[]> => 
      cachedUserSubmissions(userId)
  },
  lengthBorderFetch: {
    comparison: [language],
    value: (): Promise<Map<string, BorderData>> => 
      cachedLengthBorder(language)
  },
  execBorderFetch: {
    comparison: [language],
    value: (): Promise<Map<string, BorderData>> =>
      cachedExecBorder(language)
  },
}))(InnerContestTablePage);
