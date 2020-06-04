import React, { useMemo } from "react";
import { 
  Table, TableBody, TableCell,
  TableContainer, TableHead, TablePagination, TableRow, Paper } from "@material-ui/core";

import { RankingEntry, RankingOrderBy } from "../../interfaces/interfaces"



type RankingTableProps = {
  userId: string,
  language: string,
  rankingEntries: Required<RankingEntry>[],
  acFilter: number,
  orderBy: RankingOrderBy,
}


type RankingRowProps = {
  rank: number,
  userId: string,
  score: number | string,
}


export const RankingTable: React.FC<RankingTableProps> = ({ userId, language, rankingEntries, acFilter, orderBy }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const title: string = orderBy.toString().split("_").join(" ");

  const sortedFilteredEntries = useMemo(() => {
    const filterdEntries = rankingEntries.filter((entry) => entry.ac_count >= acFilter);
    filterdEntries.sort((a, b) => {
      // Desc Sort
      if (a[orderBy] > b[orderBy]) return -1
      else return 1
    })
    return rankingEntries.filter((entry) => entry.ac_count >= acFilter);
  }, [rankingEntries, acFilter, orderBy])

  const orderedRanking = useMemo(() => {
    return sortedFilteredEntries.reduce((ranking, entry, index) => {
      const last = ranking.length === 0 ? undefined : ranking[ranking.length - 1];
      const nextEntry =
        last && last.score === entry[orderBy]
          ? {
              rank: last.rank,
              userId: entry.user_name,
              score: entry[orderBy]
            }
          : {
              rank: index + 1,
              userId: entry.user_name,
              score: entry[orderBy]
            };
      ranking.push(nextEntry);
      return ranking;
    }, [] as RankingRowProps[]);
  }, [rankingEntries, acFilter, orderBy])

    let yourIndex: number | string = orderedRanking.findIndex(entry => entry.userId === userId)
    const yourRank = yourIndex === -1 
      ? "No Entry" 
      : orderedRanking[yourIndex].rank

  return (
      <Paper className="ranking-table">
        <div className="ranking-title">Ranking {language} {title}</div>
        <div className="ranking-you">Your Rank is {yourRank} / {orderedRanking.length}</div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderedRanking.slice(page*rowsPerPage, (page+1)*rowsPerPage).map(({ rank, userId, score }, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{rank}</TableCell>
                    <TableCell>{userId}</TableCell>
                    <TableCell>{score}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={orderedRanking.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
  );
}

