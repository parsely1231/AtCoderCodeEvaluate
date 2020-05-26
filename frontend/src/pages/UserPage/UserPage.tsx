import React, { useEffect, useState, useMemo } from "react";

import { StatusBarChart } from "../../components/BarChart"
import { StatusPieChart } from "../../components/StatusPieChart"


interface ScoredData {
  A: number,
  B: number,
  C: number,
  D: number,
  E: number,
  unsolved: number
}

export interface Submission {
  id: string;
  epoch_second: string;
  problem_id: string;
  contest_id: string;
  user_id: string;
  language: string;
  poing: number;
  length: number;
  result: string;
  execution_time: number;
}

function filterAC(submissions: Submission[]) {
  return submissions.filter(submission => submission.result === 'AC');
}

function fileterLanguage(language: string) {
  return (
    function(submissions: Submission[]) {
      return submissions.filter(submission => submission.language === language);
    }
  );
}

function filterNormalContest(submissions: Submission[]) {
  return submissions.filter(submission => submission.contest_id.slice(0, 3) === 'abc' || 'arc' || 'agc')
}

type ProblemID = string
type CodeStatusMap = Map<ProblemID, number>

type StatusType = 'length' | 'exec'
type StatusMapByType = Map<StatusType, CodeStatusMap>

function toStatusMapByType(submissions: Submission[]): StatusMapByType {
  const statusMap: StatusMapByType = new Map(
    [['exec', new Map()], 
     ['length', new Map()]]
  )

  submissions.forEach((submission) => {
    const problem = submission.problem_id;
    const newExec = submission.execution_time;
    const newLength = submission.length;

    const prevExec = statusMap.get('exec')?.get(problem);
    const prevLength = statusMap.get('length')?.get(problem);

    if (prevExec == undefined || newExec < prevExec) {
      statusMap.get('exec')?.set(problem, newExec);
    }
    if (prevLength == undefined || newLength < prevLength) {
      statusMap.get('length')?.set(problem, newLength);
    }
  })

  return statusMap
}

function fetchUserSubmissions(userName: string, language: string) {
  const PROBLEMS_URL = "/atcoder/atcoder-api";
  const url = `${PROBLEMS_URL}/results?user=${userName}`;
  return (
    fetch(url)
      .then(res => res.json())
      .then(filterAC)
      .then(fileterLanguage(language))
      .then(filterNormalContest)
  )
}

type BorderType = 'exec_time_status' | 'code_size_status';
interface BorderData {
  "language": string
  "rank_a": number
  "rank_b": number
  "rank_c": number
  "rank_d": number
  "problem_id": string
}



function fetchBorder(language: string, type: BorderType) {
  const url = `/api/${type}/?language=${language}`
  return (
    fetch(url)
      .then(res => res.json())
      .then((borders: BorderData[]) => borders.filter(border => border.problem_id.slice(0, 3) === 'abc' || 'arc' || 'agc'))
  )
}

// Map problemID: {language: Python3, rankA: xxx, rankB:yyy, rankC: zzz, rankD: xyz, problem_id: abc_154_a}
function toBorderMap(borders: BorderData[]): Map<string, BorderData> {
  const BorderMap = new Map()
  borders.forEach(border => {
    BorderMap.set(border.problem_id, border)
  })
  return BorderMap
}

interface SolvedRankStatus {
  A: number
  B: number
  C: number
  D: number
  E: number
  unsolved: number
}

type ProblemCount = Map<string, number>


export const UserPage: React.FC = () => {
  const [statusMap, setStatusMap] = useState(new Map())
  const [execBorderMap, setExecBorderMap] = useState(new Map<string, BorderData>())
  const [lengthBorderMap, setLengthBorderMap] = useState(new Map<string, BorderData>())

  function getProblemCount(): ProblemCount[] {
    const abcCount: ProblemCount = new Map();
    const arcCount: ProblemCount = new Map();
    const agcCount: ProblemCount = new Map();

    function countUp(count: ProblemCount, problemRank: string) {
      const preCount = count.get(problemRank) || 0
      count.set(problemRank, preCount + 1)
    }

    for (const contestId in execBorderMap) {
      const contestType = contestId.slice(0, 3);
      let problemRank = contestId.slice(-1);
      // AGCにひとつだけF2というRankがあるのでその対応
      if (problemRank == '2') problemRank = 'F';

      switch (contestType) {
        case 'abc': countUp(abcCount, problemRank);
          break;
        case 'arc': countUp(arcCount, problemRank);
          break;
        case 'agc': countUp(agcCount, problemRank);
          break;
      }
    }
    return [abcCount, arcCount, agcCount];
  }
  const [abcCount, arcCount, agcCount] = useMemo(() => getProblemCount(), [])

  function getSolvedRank(status: number, border: BorderData): number {
    if (status <= border.rank_a) return 5;
    else if (status <= border.rank_b) return 4;
    else if (status <= border.rank_c) return 3;
    else if (status <= border.rank_d) return 2;
    else return 1;
  }

  const [abcExecRank, arcExecRank, agcExecRank] = useMemo(() => [1, 2, 3], [])

  const userName = 'parsely'
  const language = 'Python3 (3.4.3)'

  console.log('api start')

  useEffect(() => {
    fetchUserSubmissions(userName, language)
      .then((apiData) => setStatusMap(toStatusMapByType(apiData)))
  }, [userName, language]);

  useEffect(() => {
    fetchBorder(language, 'exec_time_status')
      .then((apiData) => setExecBorderMap(toBorderMap(apiData)))
  }, [language]);

  useEffect(() => {
    fetchBorder(language, 'code_size_status')
      .then((apiData) => setLengthBorderMap(toBorderMap(apiData)))
  }, [language]);

  


  return (
    <div>
      {/*<StatusPieChart/>*/}
      <StatusBarChart/>
    </div>

  )
}