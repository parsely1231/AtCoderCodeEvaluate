import { Problem, ContestsWithProblems } from "../../interfaces/interfaces"


const PROBLEMS_URL = "/atcoder/resources/problems.json";


const fetchContest = (): Promise<ContestsWithProblems> => {
  console.log('API fetch');
  return (
  fetch(PROBLEMS_URL)
    .then(res => res.json())
    .then((problems: Problem[]) => {
      const pushProblemToContestDict = (problem:Problem, contestDict:ContestsWithProblems) => {
        const contestId: string = problem.contest_id;
        if (contestDict.get(contestId) === undefined) contestDict.set(contestId, []);
        contestDict.get(contestId)?.push(problem);
      }
      const contestDict: ContestsWithProblems = new Map();
      for (const problem of problems) {
        pushProblemToContestDict(problem, contestDict);
      }
      return contestDict;
      }
    )
  );
}

export { fetchContest }