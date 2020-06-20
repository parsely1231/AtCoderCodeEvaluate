import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TablePagination
} from "@material-ui/core";

import {
  Contest,
  BorderData,
  ContestType,
  Submission
} from "../../interfaces/interfaces";
import { toCodeStatusMap, quantiles } from "../../utils/calculate";

import { ContestLine } from "./ContestLine";
import { ContestTableHeader } from "./ContestTableHeader";

interface TableProps {
  contestType: ContestType;
  contests: Contest[];
  execBorderMap: Map<string, BorderData>;
  lengthBorderMap: Map<string, BorderData>;
  submissions: Submission[];
  showExecTime: boolean;
  showCodeSize: boolean;
}

function getTitle(contestType: ContestType): string {
  switch (contestType) {
    case "ABC":
      return "AtCoder Begginer Contest";
    case "ARC":
      return "AtCoder Regular Contest";
    case "AGC":
      return "AtCoder Grand Contest";
  }
}

export const ContestTable: React.FC<TableProps> = ({
  contestType,
  contests,
  execBorderMap,
  lengthBorderMap,
  submissions,
  showCodeSize,
  showExecTime
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const title = getTitle(contestType);
  const baseProblemCount: number =
    contestType === "ABC" ? 6 : contestType === "ARC" ? 4 : 7;

  const lengthBorderMedianList = useMemo(
    () =>
      [...lengthBorderMap.values()]
        .map(border => border.rank_c)
        .sort((a, b) => b - a),
    [lengthBorderMap]
  );
  const lengthBorderQuantiles = useMemo(
    () => quantiles(lengthBorderMedianList, [0.3, 1, 3, 7, 15, 30, 50, 100]),
    [lengthBorderMap]
  );

  const lowerContestType = contestType.toLowerCase();
  const filterdContests = useMemo(
    () =>
      contests.filter(
        contest => contest.contestId.slice(0, 3) === lowerContestType
      ),
    [contestType, contests]
  );

  const execStatusMap = useMemo(
    () => toCodeStatusMap(submissions, "execution_time"),
    [submissions]
  );
  const lengthStatusMap = useMemo(
    () => toCodeStatusMap(submissions, "length"),
    [submissions]
  );
  
  return (
    <div className="contest-table">
      <h2>{title}</h2>
      <TablePagination
        rowsPerPageOptions={[50, 100, 200]}
        component="div"
        count={filterdContests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <TableContainer>
        <Table>
          <ContestTableHeader contestType={contestType} />

          <TableBody>
            {filterdContests
              .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
              .map(contest => {
                return (
                  <ContestLine
                    key={contest.contestId}
                    contestId={contest.contestId}
                    problems={contest.problems}
                    baseProblemCount={baseProblemCount}
                    execBorderMap={execBorderMap}
                    execStatusMap={execStatusMap}
                    lengthBorderMap={lengthBorderMap}
                    lengthStatusMap={lengthStatusMap}
                    lengthBorderQuantiles={lengthBorderQuantiles}
                    showCodeSize={showCodeSize}
                    showExecTime={showExecTime}
                  />
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[50, 100, 200]}
        component="div"
        count={filterdContests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
};
