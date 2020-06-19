import React from "react";


import { StatusPieChart } from "./StatusPieChart";
import { StatusCount } from "../../interfaces/interfaces";

type StatusCountByProblemRank = Map<ProblemRank, StatusCount>;
type ProblemRank = "a" | "b" | "c" | "d" | "e" | "f";

interface Props {
  title: string;
  statusCountByProblemRank: StatusCountByProblemRank;
}

export const PieChartBlock: React.FC<Props> = ({
  title,
  statusCountByProblemRank
}) => {
  return (
    <>
      <h2>{title}</h2>
      <div className="piecharts-line">
        {Array.from(statusCountByProblemRank).map(
          ([problemRank, CountingByStatus]) => {
            return (
              <div className="piechart-box">
                <StatusPieChart statusCount={CountingByStatus} />
                <h3>Problem {problemRank.toUpperCase()}</h3>
              </div>
            );
          }
        )}
      </div>
    </>
  );
};
