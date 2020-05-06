import React from "react";

interface ContestLinkProps {
  contestId: string
}

const ATCODER_CONTEST_BASE_URL:string = "https://atcoder.jp/contests/"

export const ContestLink = (props: ContestLinkProps) => {
  return (
    <a
      className="contest-link"
      href={ATCODER_CONTEST_BASE_URL + props.contestId}
      target="_blank"
      rel="noopener"
    >
      {props.contestId.toUpperCase()}
    </a>
  )
}