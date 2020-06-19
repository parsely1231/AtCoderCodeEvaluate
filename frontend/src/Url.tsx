const BASE_URL = "https://atcoder.jp";

export const formatContestUrl = (contest: string) =>
  `${BASE_URL}/contests/${contest}`;

export const formatProblemUrl = (contest: string, problemRank: string) =>
  `${formatContestUrl(contest)}/tasks/${contest}_${problemRank}`;
