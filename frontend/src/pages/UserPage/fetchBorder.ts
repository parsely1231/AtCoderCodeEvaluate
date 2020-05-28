import { BorderData, BorderType } from "../../interfaces/interfaces"


export function fetchBorder(language: string, type: BorderType) {
  const url = `/api/${type}/?language=${language}`
  return (
    fetch(url)
      .then(res => res.json())
      .then((borders: BorderData[]) => borders.filter(border => border.problem_id.slice(0, 3) === 'abc' || 'arc' || 'agc'))
  )
}