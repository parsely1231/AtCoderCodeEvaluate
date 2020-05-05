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