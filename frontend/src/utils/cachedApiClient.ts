import {} from "../interfaces/interfaces"



const API_BASE_URL = '/api';

type RankingEntry = {
  user_name: string,
  language: string,
  ac_count: number,
  code_size_points: number,
  exec_time_points: number,
  code_size_average?: number,
  exec_time_average?: number,
}


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


async function fetchRankings(language: string): Promise<RankingEntry[]> {
  const url = `${API_BASE_URL}/user_status/?language=${language}`
  
  return fetch(url)
          .then(res => res.json())
}


let RANKINGS: Promise<Required<RankingEntry>[]> | undefined;
export const cachedRankings = (language: string): Promise<Required<RankingEntry>[]> => {
  if (RANKINGS === undefined) {
    RANKINGS = fetchRankings(language)
                .then((res) => calcuAverageScore(res));
  }
  return RANKINGS;
}
