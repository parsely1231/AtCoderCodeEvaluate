
const PROBLEMS_URL = "/atcoder/resources/problems.json";

interface ProblemJSON {
  id: string;
  contest_id: string;
  title: string;
}

/**
 * fetch AtCoder Problems API and get problems.json
 * @return {contestId : problem[]}
 * ex. {abc120: [A.xxyyzz, B.iijjkk, C.aabbcc], agc24: [A.------, ....]}
 */
const fetchContest = (): Promise<Map<string, string[]>> => {
  return (
  fetch(PROBLEMS_URL)
    .then(res => res.json())
    .then((problems: ProblemJSON[]) => {
      const pushProblemToContestDict = (problem:ProblemJSON, contestDict:Map<string, string[]>) => {
        const contestId: string = problem.contest_id;
        if (contestDict.get(contestId) === undefined) contestDict.set(contestId, []);
        contestDict.get(contestId)?.push(problem.title);
      }
      
      const contestDict = new Map<string, string[]>();
      for (const problem of problems) {
        pushProblemToContestDict(problem, contestDict);
      }
      return contestDict;
      }
    )
  );
}

export { fetchContest }