
const PROBLEMS_URL = "/atcoder/resources/problems.json";

interface ProblemJSON {
  id: string;
  contest_id: string;
  title: string;
}



const fetchContest = () => {
  return (
  fetch(PROBLEMS_URL)
    .then(res => res.json())
    .then((problems: ProblemJSON[]) => {
      console.log('#######fetch API#########')
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