export type Problem = {
  id: string,
  title: string,
  contest_id: string,
}

export type Contest = {
  contestId: string,
  problems: Problem[],
}

export type ContestType = "ABC" | "ARC" | "AGC";

type ContestId = string
export type ContestsWithProblems = Map<ContestId, Problem[]>

export type EntryData = {
  userId: string,
  score: number,
}

export type RankingEntry = {
  user_name: string,
  language: string,
  ac_count: number,
  code_size_points: number,
  exec_time_points: number,
  code_size_average?: number,
  exec_time_average?: number,
}

export type RankingOrderBy = keyof RankingEntry


export type userData = {
  userId: string,
  totalScore: number,
  averageScore: number,
}

export type Submission = {
  id: string,
  epoch_second: string,
  problem_id: string,
  contest_id: string,
  user_id: string,
  language: string,
  poing: number,
  length: number,
  result: string,
  execution_time: number,
}

export interface BorderData {
  "language": string
  "rank_a": number
  "rank_b": number
  "rank_c": number
  "rank_d": number
  "problem_id": string
}

export type BorderType = 'exec_time_status' | 'code_size_status';

export type StatusCount = {
  A: number
  B: number
  C: number
  D: number
  E: number
  unsolved: number
}

export type ProblemId = string
export type CodeStatusMap = Map<ProblemId, number>

