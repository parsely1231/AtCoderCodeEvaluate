import { Problem, ContestsData } from "src/interfaces/interfaces"


const PROBLEMS_URL = "/atcoder/resources/problems.json";


const fetchContest = (): Promise<ContestsData> => {
  return (
  fetch(PROBLEMS_URL)
    .then(res => res.json())
    .then((problems: Problem[]) => {
      const pushProblemToContestDict = (problem:Problem, contestDict:ContestsData) => {
        const contestId: string = problem.contest_id;
        if (contestDict.get(contestId) === undefined) contestDict.set(contestId, []);
        contestDict.get(contestId)?.push(problem);
      }
      const contestDict: ContestsData = new Map();
      problems.reverse()
      for (const problem of problems) {
        pushProblemToContestDict(problem, contestDict);
      }
      return contestDict;
      }
    )
  );
}

export { fetchContest }