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

export interface RankingEntry {
  readonly rank: number;
  readonly userId: string;
  readonly score: number;
}

export interface RankingProps {
  title: string;
  ranking: RankingEntry[];
}

export interface userData {
  userId: string;
  totalScore: number;
  averageScore: number;
}