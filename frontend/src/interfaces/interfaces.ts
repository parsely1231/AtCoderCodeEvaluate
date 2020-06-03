export interface Problem {
  id: string;
  title: string;
  contest_id: string;
  codeSizeAverage?: Map<string, number>;
  execTimeAverage?: Map<string, number>;
}

export interface Contest {
  contestId: string;
  problems: Problem[]
}

type ContestId = string
export type ContestsData = Map<ContestId, Problem[]>

export interface EntryData {
  userId: string;
  score: number;
}

export interface AggregatedData {
  title: string;  //ExecTime or CodeSize and Total or Average
  data: EntryData[]
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


export interface userData {
  userId: string;
  totalScore: number;
  averageScore: number;
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

export interface BorderData {
  "language": string
  "rank_a": number
  "rank_b": number
  "rank_c": number
  "rank_d": number
  "problem_id": string
}

export type BorderType = 'exec_time_status' | 'code_size_status';

