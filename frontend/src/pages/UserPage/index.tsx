import React, { useMemo, useState } from 'react';
import { connect, PromiseState } from "react-refetch"

import { Paper, Tabs, Tab, LinearProgress, MenuItem} from '@material-ui/core';

import { cachedUserSubmissions, cachedExecBorder, cachedLengthBorder, cachedProblems } from "../../utils/cachedApiClient"
import { Submission, BorderData, Problem, StatusCount, ContestType } from "../../interfaces/interfaces"
import { PieChartBlock} from "./PieChartBlock"


type OuterProps = {
  userId: string
  language: string
}

type ProblemId = string

type InnerProps = {
  problemsFetch: PromiseState<Problem[]>
  submissionsFetch: PromiseState<Submission[]>,
  execBorderFetch: PromiseState<Map<ProblemId, BorderData>>,
  lengthBorderFetch: PromiseState<Map<ProblemId, BorderData>>,
} & OuterProps


type CodeStatusMap = Map<ProblemId, number>
type StatusType = "execution_time" | "length"

function toCodeStatusMap(submissions: Submission[], statusType: StatusType): CodeStatusMap {
  const statusMap: CodeStatusMap = new Map();

  submissions.forEach((submission) => {
    const problem = submission.problem_id;
    const newValue = submission[statusType];
    const prevValue = statusMap.get(problem);

    if (prevValue == undefined || newValue < prevValue) {
      statusMap.set(problem, newValue);
    }
  })
  return statusMap
}


type ProblemRank = "a" | "b" | "c" | "d" | "e" | "f"
type ProblemCountByRank = Map<ProblemRank, number>


function calcProblemCountByRank(problems: Problem[]) {
  const countByRank: ProblemCountByRank = new Map();


  function countUp(count: ProblemCountByRank, problemRank: ProblemRank) {
    const preCount = count.get(problemRank) || 0
    count.set(problemRank, preCount + 1)
  }

  for (const problem of problems) {
    const contestType = problem.id.slice(0, 3);
    let preProblemRank = problem.id.slice(-1);

    // 初期ABCとARCがabc001_1のようにproblemIdの末尾が数字になっているのでその対応
    if (preProblemRank === '1') preProblemRank = 'a';
    else if (preProblemRank === '2') preProblemRank = 'b';
    else if (preProblemRank === '3') preProblemRank = 'c';
    else if (preProblemRank === '4') preProblemRank = 'd';

    // AGCにひとつだけF2というRankがあるのでその対応
    if (contestType === 'agc' && preProblemRank === '2') preProblemRank = 'f';

    const problemRank: ProblemRank = preProblemRank as ProblemRank

    countUp(countByRank, problemRank)
  }
  return countByRank;
}



function calculateRank(status: number | undefined, border: BorderData | undefined): keyof StatusCount {
  if (status === undefined) return "unsolved";
  if (border === undefined) return "A";
  if (status <= border.rank_a) return "A";
  if (status <= border.rank_b) return "B";
  if (status <= border.rank_c) return "C";
  if (status <= border.rank_d) return "D";
  return "E";
}

type StatusCountByProblemRank = Map<ProblemRank, StatusCount>


function calcStatusCountByProblemRank(
  codeStatus: CodeStatusMap,
  borderMap: Map<ProblemId, BorderData>,
  problemCountByRank: ProblemCountByRank,
  contestType: ContestType
) {
  const selected = contestType.toLowerCase();
  const statusCountByProblemRank: StatusCountByProblemRank = new Map();
  
  problemCountByRank.forEach((count, problemRank) => {
    const statusCount: StatusCount = {A: 0, B: 0, C: 0, D: 0, E: 0, unsolved: count}
    statusCountByProblemRank.set(problemRank, statusCount)
  })

  codeStatus.forEach((status, problemId) => {
    const contestType = problemId.slice(0, 3);
    if (contestType !== selected) return;

    const border = borderMap.get(problemId);
    const solvedRank = calculateRank(status, border);
    let preProblemRank = problemId.slice(-1);

    // 初期ABCとARCがabc001_1のようにproblemIdの末尾が数字になっているのでその対応
    if (preProblemRank === '1') preProblemRank = 'a';
    else if (preProblemRank === '2') preProblemRank = 'b';
    else if (preProblemRank === '3') preProblemRank = 'c';
    else if (preProblemRank === '4') preProblemRank = 'd';

    // AGCにひとつだけF2というRankがあるのでその対応
    if (contestType === 'agc' && preProblemRank === '2') preProblemRank = 'f';

    const problemRank: ProblemRank = preProblemRank as ProblemRank
    
    const obj = statusCountByProblemRank.get(problemRank)
    if (obj === undefined) return
    else {
      obj[solvedRank] ++;
      obj.unsolved --;
    }
    statusCountByProblemRank.set(problemRank, obj)
  })

  return statusCountByProblemRank;
}

interface TabPanelProps {
  children?: React.ReactNode;
  myType: string;
  selectedType: string;
}


function TabPanel(props: TabPanelProps) {
  const { children, selectedType, myType} = props;

  return (
    <div
      role="tabpanel"
      hidden={selectedType !== myType}
    >
      {selectedType === myType && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
}


const InnerUserPage: React.FC<InnerProps> = 
({ userId, language, problemsFetch, submissionsFetch, execBorderFetch, lengthBorderFetch }) => {

  const submissions = 
    submissionsFetch.fulfilled
      ? submissionsFetch.value
      : []
  
  const execBorderMap =
    execBorderFetch.fulfilled
      ? execBorderFetch.value
      : new Map<ProblemId, BorderData>()

  const lengthBorderMap =
    lengthBorderFetch.fulfilled
      ? lengthBorderFetch.value
      : new Map<ProblemId, BorderData>()
  
  const problems =
    problemsFetch.fulfilled
      ? problemsFetch.value
      : []

  const execStatusMap = useMemo(() => toCodeStatusMap(submissions, "execution_time"), [submissions])
  const lengthStatusMap = useMemo(() => toCodeStatusMap(submissions, "length"), [submissions])

  const abcProblemCount = useMemo(() => calcProblemCountByRank(problems.filter((problem) => problem.id.slice(0, 3) === "abc")), [submissions])
  const arcProblemCount = useMemo(() => calcProblemCountByRank(problems.filter((problem) => problem.id.slice(0, 3) === "arc")), [submissions])
  const agcProblemCount = useMemo(() => calcProblemCountByRank(problems.filter((problem) => problem.id.slice(0, 3) === "agc")), [submissions])
  
  const [statusType, setStatusType] = useState('Execution Time')

  const handleChangeStatusType = (event: React.ChangeEvent<{}>, newValue: string) => {
    setStatusType(newValue);
  };


  if (submissionsFetch.pending || execBorderFetch.pending || lengthBorderFetch.pending) {
    return <LinearProgress/>
  }

  return (
    <div>
      <h1>Hello {userId}! language={language}</h1>
      <Paper square>
        <Tabs
          value={statusType}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChangeStatusType}
        >
          <Tab label="Execution Time" value="Execution Time" />
          <Tab label="Code Length" value="Code Length" />
        </Tabs>
      </Paper>

      <TabPanel myType="Execution Time" selectedType={statusType}>
        <h1>Execution Time</h1>
        <PieChartBlock
          title="AtCoder Begginer Contest"
          statusCountByProblemRank={calcStatusCountByProblemRank(execStatusMap, execBorderMap, abcProblemCount, "ABC")}
        />
        <PieChartBlock
          title="AtCoder Regular Contest"
          statusCountByProblemRank={calcStatusCountByProblemRank(execStatusMap, execBorderMap, arcProblemCount, "ARC")}
        />
        <PieChartBlock
          title="AtCoder Begginer Contest"
          statusCountByProblemRank={calcStatusCountByProblemRank(execStatusMap, execBorderMap, agcProblemCount, "AGC")}
        />
      </TabPanel>

      <TabPanel myType="Code Length" selectedType={statusType}>
        <h1>Code Length</h1>
        <PieChartBlock
          title="AtCoder Begginer Contest"
          statusCountByProblemRank={calcStatusCountByProblemRank(lengthStatusMap, lengthBorderMap, abcProblemCount, "ABC")}
        />
        <PieChartBlock
          title="AtCoder Regular Contest"
          statusCountByProblemRank={calcStatusCountByProblemRank(lengthStatusMap, lengthBorderMap, arcProblemCount, "ARC")}
        />
        <PieChartBlock
          title="AtCoder Begginer Contest"
          statusCountByProblemRank={calcStatusCountByProblemRank(lengthStatusMap, lengthBorderMap, agcProblemCount, "AGC")}
        />
      </TabPanel>

    </div>
  )
}

export const UserPage = connect<OuterProps, InnerProps>(({userId, language}) => ({
  problemsFetch: {
    comparison: null,
    value: (): Promise<Problem[]> =>
      cachedProblems()
  },
  submissionsFetch: {
    comparison: [userId],
    value: (): Promise<Submission[]> => 
      cachedUserSubmissions(userId)
  },
  lengthBorderFetch: {
    comparison: [language],
    value: (): Promise<Map<ProblemId, BorderData>> => 
      cachedLengthBorder(language)
  },
  execBorderFetch: {
    comparison: [language],
    value: (): Promise<Map<ProblemId, BorderData>> =>
      cachedExecBorder(language)
  },
}))(InnerUserPage);
