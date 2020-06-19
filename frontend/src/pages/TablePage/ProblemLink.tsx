import React from "react";

import { Problem } from "../../interfaces/interfaces";

interface ProblemLinkProps {
  problem: Problem;
}

// const getColorClass = (lengthAve: number): string => {
//   if (lengthAve < 400) {
//     return "difficulty-grey";
//   } else if (lengthAve < 800) {
//     return "difficulty-brown";
//   } else if (lengthAve < 1200) {
//     return "difficulty-green";
//   } else if (lengthAve < 1600) {
//     return "difficulty-cyan";
//   } else if (lengthAve < 2000) {
//     return "difficulty-blue";
//   } else if (lengthAve < 2400) {
//     return "difficulty-yellow";
//   } else if (lengthAve < 2800) {
//     return "difficulty-orange";
//   } else {
//     return "difficulty-red";
//   }
// }

const ATCODER_CONTEST_BASE_URL: string = "https://atcoder.jp/contests/";

export const ProblemLink = React.memo<ProblemLinkProps>(({ problem }) => {
  const contestId: string = problem.contest_id;
  const problemId: string = problem.id;
  const url: string = `${ATCODER_CONTEST_BASE_URL +
    contestId}/tasks/${problemId}`;
  // const colorClass: string = getColorClass(props.lengthAve);
  return (
    <a href={url} target="_blank" rel="noopener">
      {problem.title}
    </a>
  );
});
