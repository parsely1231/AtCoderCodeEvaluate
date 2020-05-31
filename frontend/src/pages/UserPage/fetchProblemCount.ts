
interface Problem {
  problem_id: string;
  title: string;
  contest_id: string;
  contest_type: string;
}

type ProblemRank = string
type ProblemCount = Map<ProblemRank, number>


function toProblemCount(problems: Problem[]) {
  const abcProblemCount: ProblemCount = new Map();
  const arcProblemCount: ProblemCount = new Map();
  const agcProblemCount: ProblemCount = new Map();

  function countUp(count: ProblemCount, problemRank: ProblemRank | string) {
    const preCount = count.get(problemRank) || 0
    count.set(problemRank, preCount + 1)
  }

  for (const problem of problems) {
    const problemId = problem.problem_id
    const contestType = problemId.slice(0, 3);
    let problemRank = problemId.slice(-1);

    // AGCにひとつだけF2というRankがあるのでその対応
    if (contestType === 'agc' && problemRank === '2') problemRank = 'f';

    // 初期ABCとARCがabc001_1のようにproblemIdの末尾が数字になっているのでその対応
    if (problemRank === '1') problemRank = 'a';
    else if (problemRank === '2') problemRank = 'b';
    else if (problemRank === '3') problemRank = 'c';
    else if (problemRank === '4') problemRank = 'd';

    

    switch (contestType) {
      case 'abc': countUp(abcProblemCount, problemRank);
        break;
      case 'arc': countUp(arcProblemCount, problemRank);
        break;
      case 'agc': countUp(agcProblemCount, problemRank);
        break;
    }
  }
  return [abcProblemCount, arcProblemCount, agcProblemCount];
}

export function fetchProblemCount() {
  const url = "/api/problems";
  return (
    fetch(url)
      .then(res => res.json())
      .then((problems: Problem[]) => toProblemCount(problems))
  );
}