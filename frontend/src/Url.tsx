const BASE_URL = "https://atcoder.jp";

export const formatContestUrl = (contest: string) =>
  `${BASE_URL}/contests/${contest}`;

export const formatProblemUrl = (contest: string, problem_rank: string) =>
  `${formatContestUrl(contest)}/tasks/${contest}_${problem_rank}`;
