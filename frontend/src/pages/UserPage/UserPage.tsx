import React, { useEffect, useState } from "react";

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

type ContestType = string
type CodeStatusByContestType = Map<ContestType, CodeStatusMap>

type StatusType = 'length' | 'exec'
type StatusMap = Map<StatusType, CodeStatusByContestType>

function toStatusMap(submissions: Submission[]): StatusMap {
  const statusMap: StatusMap = new Map(
    [['exec', new Map(
      [['abc', new Map()], ['arc', new Map()], ['agc', new Map()]]
    )], 
    ['length', new Map(
      [['abc', new Map()], ['arc', new Map()], ['agc', new Map()]]
    )]]
  )

  submissions.forEach((submission) => {
    const contestType = submission.contest_id.slice(0, 3);
    const problem = submission.problem_id;
    const newExec = submission.execution_time;
    const newLength = submission.length;

    const beforeExec = statusMap.get('exec')?.get(contestType)?.get(problem);
    const beforeLength = statusMap.get('exec')?.get(contestType)?.get(problem);

    if (beforeExec == undefined || newExec < beforeExec) {
      statusMap.get('exec')?.get(contestType)?.set(problem, newExec);
    }
    if (beforeLength == undefined || newLength < beforeLength) {
      statusMap.get('exec')?.get(contestType)?.set(problem, newLength);
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

function toBorderMap(borders: BorderData[]): Map<string, BorderData> {
  const BorderMap = new Map()
  borders.forEach(border => {
    BorderMap.set(border.problem_id, border)
  })
  return BorderMap
}


export const UserPage: React.FC = () => {
  const [statusMap, setStatusMap] = useState(new Map<StatusType, CodeStatusByContestType>())
  const [execBorderMap, setExecBorderMap] = useState(new Map<string, BorderData>())
  const [lengthBorderMap, setLengthBorderMap] = useState(new Map<string, BorderData>())

  const userName = 'parsely'
  const language = 'Python3 (3.4.3)'

  console.log('api start')

  useEffect(() => {
    fetchUserSubmissions(userName, language)
      .then((apiData) => setStatusMap(toStatusMap(apiData)))
  }, [userName, language]);

  useEffect(() => {
    fetchBorder(language, 'exec_time_status')
      .then((apiData) => setExecBorderMap(toBorderMap(apiData)))
  }, [language]);

  useEffect(() => {
    fetchBorder(language, 'code_size_status')
      .then((apiData) => setLengthBorderMap(toBorderMap(apiData)))
  });

  execBorderMap.forEach((value, key) => console.log(`${key}: ${value}`))

  return (
    <div>
      {/*<StatusPieChart/>*/}
      <StatusBarChart/>
    </div>

  )
}