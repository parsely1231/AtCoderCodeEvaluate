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