import { pushProblemToContestDict, problemsJsonToContestDict } from "../utils/cachedApiClient"
import { Problem, ContestsWithProblems } from "../interfaces/interfaces"
import { testProblemJson} from "./testProblem"


describe("pushProblemToContestDict", (): void => {
  test("When dict has not the contest key", () => {
    const dict = new Map<string, Problem[]>()
    const problem: Problem = {
      contest_id: "testContest",
      id: "testId",
      title: "testTitle",
    }
    pushProblemToContestDict(dict, problem)
    expect(dict.get("testContest")).toStrictEqual([problem]);
  });
  test("When dict has the contest key", () => {
    const problem1: Problem = {
      contest_id: "testContest",
      id: "testId",
      title: "testTitle",
    }
    const dict = new Map<string, Problem[]>(
      [
        ["testContest", [problem1]]
      ]
    )
    const problem2: Problem = {
      contest_id: "testContest",
      id: "testId2",
      title: "testTitle2",
    }
    pushProblemToContestDict(dict, problem2)
    expect(dict.get("testContest")).toStrictEqual([
      problem1, problem2
    ]);
  });
});

describe("problemsJsonToContestDict", () => {
  test("testProblemJson read", () => {
    const problemsJson = testProblemJson
    const contestDict: ContestsWithProblems = problemsJsonToContestDict(problemsJson)
    expect(contestDict).toStrictEqual(new Map (
         [
           ["abc001", [
           {
             "contest_id": "abc001",
             "id": "abc001_1",
             "title": "A. 積雪深差",
           },
           {
             "contest_id": "abc001",
             "id": "abc001_2",
             "title": "B. 視程の通報",
           },
           {
             "contest_id": "abc001",
             "id": "abc001_3",
             "title": "C. 風力観測",
           },
           {
             "contest_id": "abc001",
             "id": "abc001_4",
             "title": "D. 感雨時刻の整理",
           },
         ]],
           ["abc002", [
           {
             "contest_id": "abc002",
             "id": "abc002_1",
             "title": "A. 正直者",
           },
           {
             "contest_id": "abc002",
             "id": "abc002_2",
             "title": "B. 罠",
           },
           {
             "contest_id": "abc002",
             "id": "abc002_3",
             "title": "C. 直訴",
           },
           {
             "contest_id": "abc002",
             "id": "abc002_4",
             "title": "D. 派閥",
           },
         ]],
           ["abc003", [
           {
             "contest_id": "abc003",
             "id": "abc003_1",
             "title": "A. AtCoder社の給料",
           },
           {
             "contest_id": "abc003",
             "id": "abc003_2",
             "title": "B. AtCoderトランプ",
           },
         ]]
        ])
  );
  });
})