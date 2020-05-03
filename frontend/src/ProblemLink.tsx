import React from "react"


interface ProblemLinkProps {
  constestId: string
  problemTitle: string
}

const ATCODER_CONTEST_BASE_URL:string = "https://atcoder.jp/contests/"

export const ProblemLink: React.FC<ProblemLinkProps> = (props) => {
  const contestId: string = props.constestId.toLowerCase();
  const problemId: string = contestId + "_" + props.problemTitle.slice(0,1).toLowerCase();
  const url: string = `${ATCODER_CONTEST_BASE_URL+contestId}/tasks/${problemId}`;
  
  return (
    <a
      className="problem-link"
      href={url}
      target="_blank"
      rel="noopener"
    >
      {props.problemTitle}
    </a>
  )
}