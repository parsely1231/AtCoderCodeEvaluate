import React from "react"

import { RankingTable, aggregatedToRanking } from "../../components/Ranking"
import { EntryData, AggregatedData, RankingEntry, RankingProps } from "../../interfaces/interfaces"


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

const samples = [sample1, sample2]

const aggregate = (userDatas: userData[], target: "total" | "average"): AggregatedData => {
  const aggregatedData = userDatas.map((userData) => {
      const score = target == 'total'
        ? userData.totalScore
        : userData.averageScore

      return {
        userId: userData.userId,
        score: score
      };
    })
  
    return {
      title: target,
      data: aggregatedData
    }

}

