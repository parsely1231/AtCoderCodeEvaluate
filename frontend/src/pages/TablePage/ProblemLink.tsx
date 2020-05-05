import React from "react"
import { get } from "https";


interface ProblemLinkProps {
  constestId: string
  problemTitle: string
  lengthAve: number
}

const getColorClass = (lengthAve: number): string => {
  if (lengthAve < 400) {
    return "difficulty-grey";
  } else if (lengthAve < 800) {
    return "difficulty-brown";
  } else if (lengthAve < 1200) {
    return "difficulty-green";
  } else if (lengthAve < 1600) {
    return "difficulty-cyan";
  } else if (lengthAve < 2000) {
    return "difficulty-blue";
  } else if (lengthAve < 2400) {
    return "difficulty-yellow";
  } else if (lengthAve < 2800) {
    return "difficulty-orange";
  } else {
    return "difficulty-red";
  }
}


const ATCODER_CONTEST_BASE_URL:string = "https://atcoder.jp/contests/"

export const ProblemLink: React.FC<ProblemLinkProps> = (props) => {
  const contestId: string = props.constestId.toLowerCase();
  const problemId: string = contestId + "_" + props.problemTitle.slice(0,1).toLowerCase();
  const url: string = `${ATCODER_CONTEST_BASE_URL+contestId}/tasks/${problemId}`;
  const colorClass: string = getColorClass(props.lengthAve);
  
  return (
    <a
      className={colorClass}
      href={url}
      target="_blank"
      rel="noopener"
    >
      {props.problemTitle}
    </a>
  )
}