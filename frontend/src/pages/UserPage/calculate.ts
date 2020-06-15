import { Submission, BorderData, Problem, StatusCount, ContestType } from "../../interfaces/interfaces"



type ProblemRank = "a" | "b" | "c" | "d" | "e" | "f"
type ProblemCountByRank = Map<ProblemRank, number>


function calcProblemCountByRank(problems: Problem[]) {
  const countByRank: ProblemCountByRank = new Map();


  function countUp(count: ProblemCountByRank, problemRank: ProblemRank) {
    const preCount = count.get(problemRank) || 0
    count.set(problemRank, preCount + 1)
  }

  for (const problem of problems) {
    const contestType = problem.id.slice(0, 3);
    let preProblemRank = problem.id.slice(-1);

    // 初期ABCとARCがabc001_1のようにproblemIdの末尾が数字になっているのでその対応
    if (preProblemRank === '1') preProblemRank = 'a';
    else if (preProblemRank === '2') preProblemRank = 'b';
    else if (preProblemRank === '3') preProblemRank = 'c';
    else if (preProblemRank === '4') preProblemRank = 'd';

    // AGCにひとつだけF2というRankがあるのでその対応
    if (contestType === 'agc' && preProblemRank === '2') preProblemRank = 'f';

    const problemRank: ProblemRank = preProblemRank as ProblemRank

    countUp(countByRank, problemRank)
  }
  return countByRank;
}



function calculateRank(status: number | undefined, border: BorderData | undefined): keyof StatusCount {
  if (status === undefined) return "unsolved";
  if (border === undefined) return "A";
  if (status <= border.rank_a) return "A";
  if (status <= border.rank_b) return "B";
  if (status <= border.rank_c) return "C";
  if (status <= border.rank_d) return "D";
  return "E";
}

type StatusCountByProblemRank = Map<ProblemRank, StatusCount>


function calcStatusCountByProblemRank(
  codeStatus: CodeStatusMap,
  borderMap: Map<ProblemId, BorderData>,
  problemCountByRank: ProblemCountByRank,
  contestType: ContestType
) {
  const selected = contestType.toLowerCase();
  const statusCountByProblemRank: StatusCountByProblemRank = new Map();
  
  problemCountByRank.forEach((count, problemRank) => {
    const statusCount: StatusCount = {A: 0, B: 0, C: 0, D: 0, E: 0, unsolved: count}
    statusCountByProblemRank.set(problemRank, statusCount)
  })

  codeStatus.forEach((status, problemId) => {
    const contestType = problemId.slice(0, 3);
    if (contestType !== selected) return;

    const border = borderMap.get(problemId);
    const solvedRank = calculateRank(status, border);
    let preProblemRank = problemId.slice(-1);

    // 初期ABCとARCがabc001_1のようにproblemIdの末尾が数字になっているのでその対応
    if (preProblemRank === '1') preProblemRank = 'a';
    else if (preProblemRank === '2') preProblemRank = 'b';
    else if (preProblemRank === '3') preProblemRank = 'c';
    else if (preProblemRank === '4') preProblemRank = 'd';

    // AGCにひとつだけF2というRankがあるのでその対応
    if (contestType === 'agc' && preProblemRank === '2') preProblemRank = 'f';

    const problemRank: ProblemRank = preProblemRank as ProblemRank
    
    const obj = statusCountByProblemRank.get(problemRank)
    if (obj === undefined) return
    else {
      obj[solvedRank] ++;
      obj.unsolved --;
    }
    statusCountByProblemRank.set(problemRank, obj)
  })

  return statusCountByProblemRank;
}