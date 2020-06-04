import { RankingEntry, ContestsWithProblems, Problem } from "../interfaces/interfaces"



const API_BASE_URL = '/api';
const PROBLEMS_URL = "/atcoder/resources/problems.json";


// *************** Fetch Ranking ***************
function calcuAverageScore(rankingEntries: RankingEntry[]): Required<RankingEntry>[] {
  const calcuedEntries = rankingEntries.map((entry): Required<RankingEntry> => {
    const averages = {
      code_size_average: entry.code_size_points / entry.ac_count,
      exec_time_average: entry.exec_time_points / entry.ac_count
    }
    return Object.assign(entry, averages)
  })
  return calcuedEntries
}


async function fetchRanking(language: string): Promise<RankingEntry[]> {
  const url = `${API_BASE_URL}/user_status/?language=${language}`
  const res = await fetch(url);
  const json = await res.json()
  return json
}


let RANKINGS_MAP = new Map<string, Promise<Required<RankingEntry>[]>>();
export const cachedRankings = (language: string): Promise<Required<RankingEntry>[]> => {
  const cache = RANKINGS_MAP.get(language)
  if (cache) return cache;
  
  const ranking = fetchRanking(language).then((json) => calcuAverageScore(json))
  RANKINGS_MAP.set(language, ranking)

  return ranking;
}



// *************** Fetch Contests and Problems ***************
function pushProblemToContestDict (contestDict:ContestsWithProblems, problem:Problem) {
  const contestId: string = problem.contest_id;
  if (contestDict.get(contestId) === undefined) contestDict.set(contestId, []);
  contestDict.get(contestId)?.push(problem);
}

async function fetchContestsWithProblems(): Promise<ContestsWithProblems> {
  const res = await fetch(PROBLEMS_URL);
  const problemsJson: Problem[] = await res.json();
  const contestDict: ContestsWithProblems = problemsJson.reduce((dict, problem) => {
    pushProblemToContestDict(dict, problem);
    return dict;
  }, new Map() as ContestsWithProblems)

  return contestDict
}

let CONTESTS_WITH_PROBLEMS: undefined | Promise<ContestsWithProblems>
export const cachedContestsWithProblmes = () => {
  if (CONTESTS_WITH_PROBLEMS === undefined) {
    CONTESTS_WITH_PROBLEMS = fetchContestsWithProblems()
  }
  return CONTESTS_WITH_PROBLEMS;
}