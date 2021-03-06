import {
  RankingEntry,
  ContestsWithProblems,
  Problem,
  BorderData,
  BorderType,
  Submission
} from "../interfaces/interfaces";

const API_BASE_URL = "https://api.ac-code-eval.com/api";
const PROBLEMS_URL = "https://kenkoooo.com/atcoder/resources/problems.json";
const SUBMISSION_URL = "https://kenkoooo.com/atcoder/atcoder-api";

// ***************** Fetch Ranking *****************

function calcuAverageScore(
  rankingEntries: RankingEntry[]
): Required<RankingEntry>[] {
  const calcuedEntries = rankingEntries.map(
    (entry): Required<RankingEntry> => {
      const averages = {
        code_size_average: entry.code_size_points / entry.ac_count,
        exec_time_average: entry.exec_time_points / entry.ac_count
      };
      return Object.assign(entry, averages);
    }
  );
  return calcuedEntries;
}

async function fetchRanking(language: string): Promise<RankingEntry[]> {
  const encodedLanguage = encodeURIComponent(language)
  const url = `${API_BASE_URL}/user_status/?language=${encodedLanguage}`;
  const res = await fetch(url);
  const json = await res.json();
  return json;
}

const RANKINGS_MAP = new Map<string, Promise<Required<RankingEntry>[]>>();

export const cachedRankings = (
  language: string
): Promise<Required<RankingEntry>[]> => {
  const cache = RANKINGS_MAP.get(language);
  if (cache) {
    return cache;
  }

  const ranking = fetchRanking(language).then(json => calcuAverageScore(json));
  RANKINGS_MAP.set(language, ranking);

  return ranking;
};

// ***************** Fetch Problems *****************
async function fetchProblems(): Promise<Problem[]> {
  const res = await fetch(PROBLEMS_URL);
  return await res.json();
}

let PROBLEMS: undefined | Promise<Problem[]>;

export const cachedProblems = () => {
  if (PROBLEMS === undefined) {
    PROBLEMS = fetchProblems();
  }
  return PROBLEMS;
};

// ***************** Fetch Contests and Problems *****************

export function pushProblemToContestDict(
  contestDict: ContestsWithProblems,
  problem: Problem
) {
  const contestId: string = problem.contest_id;
  if (contestDict.get(contestId) === undefined) {
    contestDict.set(contestId, []);
  }
  contestDict.get(contestId)?.push(problem);
}

export function problemsJsonToContestDict(problemsJson: Problem[]) {
  return problemsJson.reduce(
    (dict, problem) => {
      pushProblemToContestDict(dict, problem);
      return dict;
    },
    new Map() as ContestsWithProblems
  );
}

export async function fetchContestsWithProblems(): Promise<ContestsWithProblems> {
  const problemsJson = await cachedProblems();
  const contestDict = problemsJsonToContestDict(problemsJson)
  return contestDict;
}

let CONTESTS_WITH_PROBLEMS: undefined | Promise<ContestsWithProblems>;

export const cachedContestsWithProblems = () => {
  if (CONTESTS_WITH_PROBLEMS === undefined) {
    CONTESTS_WITH_PROBLEMS = fetchContestsWithProblems();
  }
  return CONTESTS_WITH_PROBLEMS;
};

// ***************** Fetch Border *****************

// Map problemId: {language: Python3, rankA: xxx, rankB:yyy, rankC: zzz, rankD: xyz, problem_id: abc_154_a}
function toBorderMap(borders: BorderData[]): Map<string, BorderData> {
  const BorderMap = new Map<string, BorderData>();
  borders.forEach(border => {
    BorderMap.set(border.problem_id, border);
  });
  return BorderMap;
}

async function fetchBorder(
  language: string,
  type: BorderType
): Promise<Map<string, BorderData>> {
  const encodedLanguage = encodeURIComponent(language)
  const url = `${API_BASE_URL}/${type}/?language=${encodedLanguage}`;
  const normalContestTypes = new Set(["abc", "arc", "agc"]);
  const res = await fetch(url);
  const borders: BorderData[] = await res.json();
  const normalFilteredBorders = borders.filter(border =>
    normalContestTypes.has(border.problem_id.slice(0, 3))
  );
  const borderMap = toBorderMap(normalFilteredBorders);
  return borderMap;
}

// Map language: {proglemId: {language: Python3, rankA: xxx, rankB:yyy, rankC: zzz, rankD: xyz, problem_id: abc_154_a}}
const EXEC_BORDER = new Map<string, Promise<Map<string, BorderData>>>();

export const cachedExecBorder = (language: string) => {
  if (EXEC_BORDER.get(language) === undefined) {
    const borderMap = fetchBorder(language, "exec_time_status");
    EXEC_BORDER.set(language, borderMap);
  }
  return EXEC_BORDER.get(language)!;
};

const LENGTH_BORDER = new Map<string, Promise<Map<string, BorderData>>>();

export const cachedLengthBorder = (language: string) => {
  if (LENGTH_BORDER.get(language) === undefined) {
    const borderMap = fetchBorder(language, "code_size_status");
    LENGTH_BORDER.set(language, borderMap);
  }
  return LENGTH_BORDER.get(language)!;
};

// ***************** Fetch Submission *****************

function filterAC(submissions: Submission[]) {
  return submissions.filter(submission => submission.result === "AC");
}

function filterNormalContest(submissions: Submission[]) {
  const normalContestTypes = new Set(["abc", "arc", "agc"]);
  return submissions.filter(submission =>
    normalContestTypes.has(submission.contest_id.slice(0, 3))
  );
}

async function fetchUserSubmissions(userId: string): Promise<Submission[]> {
  const url = `${SUBMISSION_URL}/results?user=${userId}`;
  const res = await fetch(url);
  const submissions: Submission[] = await res.json();
  const acSubmissions = filterAC(submissions);
  const acSubmissionsInNormalContest = filterNormalContest(acSubmissions);

  return acSubmissionsInNormalContest;
}

const USER_SUBMISSIONS = new Map<string, Promise<Submission[]>>();

export const cachedUserSubmissions = (userId: string) => {
  if (USER_SUBMISSIONS.get(userId) === undefined) {
    const submissions = fetchUserSubmissions(userId);
    USER_SUBMISSIONS.set(userId, submissions);
  }
  return USER_SUBMISSIONS.get(userId)!;
};
