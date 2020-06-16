import { Submission, BorderData, Problem, StatusCount, ContestType, CodeStatusMap, ProblemId } from "../interfaces/interfaces"


type ProblemRank = "a" | "b" | "c" | "d" | "e" | "f"
type ProblemCountByRank = Map<ProblemRank, number>
type StatusType = "execution_time" | "length"


export function toCodeStatusMap(submissions: Submission[], statusType: StatusType): CodeStatusMap {
  const statusMap: CodeStatusMap = new Map();

  submissions.forEach((submission) => {
    const problem = submission.problem_id;
    const newValue = submission[statusType];
    const prevValue = statusMap.get(problem);

    if (prevValue == undefined || newValue < prevValue) {
      statusMap.set(problem, newValue);
    }
  })
  return statusMap
}

function countUp(countByRank: ProblemCountByRank, problemRank: ProblemRank) {
  const preCount = countByRank.get(problemRank) || 0
  countByRank.set(problemRank, preCount + 1)
}

export function calcProblemCountByRank(problems: Problem[]) {
  const countByRank: ProblemCountByRank = new Map();

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

export function calculateRank(status: number | undefined, border: BorderData | undefined): keyof StatusCount {
  if (status === undefined) return "unsolved";
  if (border === undefined) return "A";
  if (status <= border.rank_a) return "A";
  if (status <= border.rank_b) return "B";
  if (status <= border.rank_c) return "C";
  if (status <= border.rank_d) return "D";
  return "E";
}

type StatusCountByProblemRank = Map<ProblemRank, StatusCount>

export function calcStatusCountByProblemRank(
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

function quantile(sortedArray: number[], percentile: number) {
  const index = percentile/100 * (sortedArray.length-1);
  if (Math.floor(index) == index) return sortedArray[index];

  const i = Math.floor(index)
  const fraction = index - i;
  const result = sortedArray[i] + (sortedArray[i+1] - sortedArray[i]) * fraction;
  return result;
}

export function quantiles(sortedArray: number[], percentiles: number[]) {
  return percentiles.map((percentile) => quantile(sortedArray, percentile))
}
