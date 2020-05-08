import React from "react";
import { Table, TableBody, TableCell,
         TableContainer, TableHead, TablePagination, TableRow,
         Paper } from "@material-ui/core";

import { EntryData, AggregatedData, RankingEntry, RankingProps } from "../interfaces/interfaces"



export const aggregatedToRanking = (aggregated: AggregatedData) => {
  return aggregated.data
     .sort((a, b) => b.score - a.score)
     .reduce((ranking, entry, index) => {
       const last = ranking.length === 0 ? undefined : ranking[ranking.length - 1];
       const nextEntry =
         last && last.score === entry.score
           ? {
               rank: last.rank,
               userId: entry.userId,
               score: entry.score
             }
           : {
               rank: index + 1,
               userId: entry.userId,
               score: entry.score
             };
       ranking.push(nextEntry);
       return ranking;
     }, [] as RankingEntry[]);
}


export const RankingTable: React.FC<RankingProps> = ({ title, ranking }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const language = 'Python'
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
      <Paper className={`ranking-${title}`}>
        <div className={"ranking-title"}>Ranking {language} {title}</div>
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
              {ranking.map(({rank, userId, score}, index) => {
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
          count={ranking.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
  );
}

