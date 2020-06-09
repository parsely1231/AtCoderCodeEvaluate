import React from 'react';
import { connect, PromiseState } from "react-refetch"

import { Paper, Tabs, Tab, TextField, LinearProgress, MenuItem} from '@material-ui/core';

import { cachedRankings } from "../../utils/cachedApiClient"
import { RankingEntry, RankingOrderBy } from "../../interfaces/interfaces"




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
    <div>

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
