import { Problem, ContestsData } from "../../interfaces/interfaces"


const PROBLEMS_URL = "/atcoder/resources/problems.json";


const fetchContest = (): Promise<ContestsData> => {
  console.log('API fetch');
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
      for (const problem of problems) {
        pushProblemToContestDict(problem, contestDict);
      }
      return contestDict;
      }
    )
  );
}

export { fetchContest }