import React from "react";


const CONTEST_URL = "/atcoder/resources/contest-problem.json";

const fetchContest = () => {
  return (
    fetch(CONTEST_URL)
      .then(res => res.json())
      .then((array: any[]) => {
        for (const contest of array) {
          if (contest.contest_id.slice(0,3) === 'abc') {
            console.log(contest.contest_id);
          }
        }
      })

  );
}

export { fetchContest }