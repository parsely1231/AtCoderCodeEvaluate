import React from "react"




interface userData {
  userId: string;
  totalScore: number;
  averageScore: number;
}

const sample1: userData = {
  userId: 'aaa',
  totalScore: 30,
  averageScore: 3,
}

const sample2: userData = {
  userId: "bbb",
  totalScore: 20,
  averageScore: 4,
}

const sample3: userData = {
  userId: "ccc",
  totalScore: 20,
  averageScore: 4,
}


// const samples = [sample1, sample2, sample3]

// const aggregate = (userDatas: userData[], target: "total" | "average"): AggregatedData => {
//   const aggregatedData = userDatas.map((userData) => {
//       const score = target == 'total'
//         ? userData.totalScore
//         : userData.averageScore

//       return {
//         userId: userData.userId,
//         score: score
//       };
//     })
  
//     return {
//       title: target,
//       data: aggregatedData
//     }

// }



