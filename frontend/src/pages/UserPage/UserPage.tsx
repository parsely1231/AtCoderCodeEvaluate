import React, { useEffect, useState, useMemo } from "react";

import { StatusBarChart } from "../../components/BarChart";
import { StatusPieChart } from "../../components/StatusPieChart";
import { stat } from "fs";
import { Submission, BorderData } from "../../interfaces/interfaces";

import { fetchUserSubmissions } from "./fetchUserSubmission"
import { fetchBorder } from "./fetchBorder";
import { fetchProblemCount } from "./fetchProblemCount"
import { exec } from "child_process";


type ProblemID = string
type CodeStatusMap = Map<ProblemID, number>

function toCodeStatusMap(submissions: Submission[]): CodeStatusMap[] {
  const execStatusMap: CodeStatusMap = new Map();
  const lengthStatusMap: CodeStatusMap = new Map();

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

// Map problemID: {language: Python3, rankA: xxx, rankB:yyy, rankC: zzz, rankD: xyz, problem_id: abc_154_a}
function toBorderMap(borders: BorderData[]): Map<string, BorderData> {
  const BorderMap = new Map()
  borders.forEach(border => {
    BorderMap.set(border.problem_id, border)
  })
  return BorderMap
}

interface RankCount {
  A: number
  B: number
  C: number
  D: number
  E: number
  unsolved: number
}

class RankCount {
  constructor(total: number) {
    this.A = 0;
    this.B = 0;
    this.C = 0;
    this.D = 0;
    this.E = 0;
    this.unsolved = total;
  }
}

type ProblemRank = string
type RankCountByProblemRank = Map<ProblemRank, RankCount>

type ProblemCount = Map<ProblemRank, number>

function getSolvedRank(status: number, border: BorderData | undefined): number {
  if (border == undefined) return 5;
  else if (status <= border.rank_a) return 5;
  else if (status <= border.rank_b) return 4;
  else if (status <= border.rank_c) return 3;
  else if (status <= border.rank_d) return 2;
  else return 1;
}

function updateRankCount(rankCount: RankCount | undefined, solvedRank: number) {
  if (rankCount == undefined) return;
  rankCount.unsolved -= 1
  switch (solvedRank) {
    case 5: rankCount.A += 1;
      break
    case 4: rankCount.B += 1;
      break
    case 3: rankCount.C += 1;
      break
    case 2: rankCount.D += 1;
      break
    case 1: rankCount.E += 1;
      break
  }
}

function calculateRankCount(codeStatus: CodeStatusMap, bordeMap: Map<ProblemID, BorderData>, problemCounts: ProblemCount[]) {
  const abcRankCount: RankCountByProblemRank = new Map();
  const arcRankCount: RankCountByProblemRank = new Map();
  const agcRankCount: RankCountByProblemRank = new Map();

  const [abcProblemCount, arcProblemCount, agcProblemCount] = problemCounts;

  abcProblemCount.forEach((count, problemRank) => abcRankCount.set(problemRank, new RankCount(count)))
  arcProblemCount.forEach((count, problemRank) => arcRankCount.set(problemRank, new RankCount(count)))
  agcProblemCount.forEach((count, problemRank) => agcRankCount.set(problemRank, new RankCount(count)))

  codeStatus?.forEach((status, problemId) => {
    const border = bordeMap.get(problemId);
    const solvedRank = getSolvedRank(status, border);
    const contestType = problemId.slice(0, 3);
    let problemRank = problemId.slice(-1);
    // AGCにひとつだけF2というRankがあるのでその対応
    if (contestType === 'agc' && problemRank === '2') problemRank = 'f';

    // 初期ABCのみabc001_1のようにproblemIdの末尾が数字になっているのでその対応
    if (problemRank === '1') problemRank = 'a';
    else if (problemRank === '2') problemRank = 'b';
    else if (problemRank === '3') problemRank = 'c';
    else if (problemRank === '4') problemRank = 'd';

    if (contestType === 'abc') updateRankCount(abcRankCount.get(problemRank), solvedRank);
    else if (contestType === 'arc') updateRankCount(arcRankCount.get(problemRank), solvedRank);
    else if (contestType === 'agc') updateRankCount(agcRankCount.get(problemRank), solvedRank);

  })
  return [abcRankCount, arcRankCount, agcRankCount];
}


export const UserPage: React.FC = () => {
  const [execStatusMap, setExecStatusMap] = useState(new Map<ProblemID, number>())
  const [lengthStatusMap, setLengthStatusMap] = useState(new Map<ProblemID, number>())
  const [execBorderMap, setExecBorderMap] = useState(new Map<ProblemID, BorderData>())
  const [lengthBorderMap, setLengthBorderMap] = useState(new Map<ProblemID, BorderData>())
  const [abcProblemCount, setAbcProblemCount] = useState(new Map<ProblemRank, number>())
  const [arcProblemCount, setArcProblemCount] = useState(new Map<ProblemRank, number>())
  const [agcProblemCount, setAgcProblemCount] = useState(new Map<ProblemRank, number>())
  

  const userName = 'parsely'
  const language = 'Python3 (3.4.3)'

  useEffect(() => {
    fetchUserSubmissions(userName, language)
      .then((apiData) => toCodeStatusMap(apiData))
      .then(([execStatus, lengthStatus]) => {
        setExecStatusMap(execStatus);
        setLengthStatusMap(lengthStatus)
      })
  }, [userName, language]);

  useEffect(() => {
    fetchBorder(language, 'exec_time_status')
      .then((apiData) => setExecBorderMap(toBorderMap(apiData)));
  }, [language]);

  useEffect(() => {
    fetchBorder(language, 'code_size_status')
      .then((apiData) => setLengthBorderMap(toBorderMap(apiData)));
  }, [language]);

  useEffect(() => {
    fetchProblemCount()
      .then(([abc, arc, agc]) => {
        setAbcProblemCount(abc);
        setArcProblemCount(arc);
        setAgcProblemCount(agc);
      });
  }, []);

  const[abcExecRankCount, arcExecRankCount, agcExecRankCount] = useMemo(() => {
    return calculateRankCount(execStatusMap, execBorderMap, [abcProblemCount, arcProblemCount, agcProblemCount]);
  }, [execStatusMap, execBorderMap, abcProblemCount])

  const[abcLengthRankCount, arcLengthRankCount, agcLengthRankCount] = useMemo(() => {
    return calculateRankCount(lengthStatusMap, lengthBorderMap, [abcProblemCount, arcProblemCount, agcProblemCount]);
  }, [lengthStatusMap, lengthBorderMap, abcProblemCount])


  return (
    <div>
      {/*<StatusPieChart/>*/}
      <StatusBarChart/>
    </div>

  )
}