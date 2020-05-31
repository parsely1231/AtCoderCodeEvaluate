import { BorderData, BorderType } from "../../interfaces/interfaces"


export function fetchBorder(language: string, type: BorderType) {
  const url = `/api/${type}/?language=${language}`
  const normalContestTypes = new Set(['abc', 'arc', 'agc'])
  return (
    fetch(url)
      .then(res => res.json())
      .then((borders: BorderData[]) => borders.filter(border => normalContestTypes.has(border.problem_id.slice(0, 3))))
  )
}