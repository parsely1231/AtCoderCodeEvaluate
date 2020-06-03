import { RankingEntry } from "../interfaces/interfaces"



const API_BASE_URL = '/api';


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
