import React from 'react';
import { connect, PromiseState } from "react-refetch"

import { Paper, Tabs, Tab, TextField, LinearProgress, MenuItem} from '@material-ui/core';

import { cachedRankings } from "../../utils/cachedApiClient"
import { RankingEntry, RankingOrderBy } from "../../interfaces/interfaces"

import { RankingTable } from './RankingTable';



type OuterProps = {
  userId: string
  language: string
}

interface InnerProps extends OuterProps {
  rankingFetch: PromiseState<Required<RankingEntry>[]>
}


const InnerRankingPage: React.FC<InnerProps> = ({ rankingFetch, userId, language }) => {
  const [orderBy, setOrderBy]: [RankingOrderBy, Function] = React.useState("exec_time_points");
  const [filterCount, setFilterCount] = React.useState(0)

  if (rankingFetch.pending) {
    return <LinearProgress/>
  }

  const rankingEntries = rankingFetch.fulfilled
    ? rankingFetch.value
    : []

  const handleChangeOrderBy = (event: React.ChangeEvent<{}>, newValue: string) => {
    setOrderBy(newValue);
  };

  const handleChangeFilterCount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCount(parseInt(event.target.value));
  };

  return (
    <div className="ranking-page">
      <Paper square>
        <Tabs
          value={orderBy}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChangeOrderBy}
          aria-label="disabled tabs example"
        >
          <Tab label="Execution Time Total" value="exec_time_points"/>
          <Tab label="Execution Time Average" value="exec_time_average"/>
          <Tab label="Code Length Total" value="code_size_points"/>
          <Tab label="Code Length Average" value="code_size_average"/>
        </Tabs>
        <div>

        </div>
        <TextField
            id="filter-ac"
            select
            label="Filter AC Count"
            value={filterCount}
            onChange={handleChangeFilterCount}
            helperText="Exclude under this count"
          >
            {[0, 50, 100, 200, 500].map((count) => (
              <MenuItem key={count} value={count}>
                {count}
              </MenuItem>
            ))}
          </TextField>
      </Paper>
      <RankingTable
        userId={userId}
        language={language}
        rankingEntries={rankingEntries}
        acFilter={filterCount}
        orderBy={orderBy}
      />
    </div>
  );
}

export const RankingPage = connect<OuterProps, InnerProps>(({userId, language}) => ({
  rankingFetch: {
    comparison: [userId, language],
    value: (): Promise<Required<RankingEntry>[]> =>
      cachedRankings(language)
  }
}))(InnerRankingPage);
