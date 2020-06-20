import React, { useMemo, useState } from "react";
import { connect, PromiseState } from "react-refetch";
import { Paper, Tabs, Tab, LinearProgress } from "@material-ui/core";

import {
  cachedUserSubmissions,
  cachedExecBorder,
  cachedLengthBorder,
  cachedProblems
} from "../../utils/cachedApiClient";
import {
  Submission,
  BorderData,
  Problem,
} from "../../interfaces/interfaces";
import {
  toCodeStatusMap,
  calcProblemCountByRank,
  calcStatusCountByProblemRank
} from "../../utils/calculate";

import { PieChartBlock } from "./PieChartBlock";

interface OuterProps {
  userId: string;
  language: string;
}

type ProblemId = string;

type InnerProps = {
  problemsFetch: PromiseState<Problem[]>;
  submissionsFetch: PromiseState<Submission[]>;
  execBorderFetch: PromiseState<Map<ProblemId, BorderData>>;
  lengthBorderFetch: PromiseState<Map<ProblemId, BorderData>>;
} & OuterProps;

interface TabPanelProps {
  children?: React.ReactNode;
  myType: string;
  selectedType: string;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, selectedType, myType } = props;

  return (
    <div role="tabpanel" hidden={selectedType !== myType}>
      {selectedType === myType && <div>{children}</div>}
    </div>
  );
};

const InnerUserPage: React.FC<InnerProps> = ({
  userId,
  language,
  problemsFetch,
  submissionsFetch,
  execBorderFetch,
  lengthBorderFetch
}) => {
  const [statusType, setStatusType] = useState("Execution Time");
  const handleChangeStatusType = (
    event: React.ChangeEvent<{}>,
    newValue: string
  ) => {
    setStatusType(newValue);
  };

  const submissions = submissionsFetch.fulfilled
    ? submissionsFetch.value.filter(
        submission => submission.language === language
      )
    : [];

  const execBorderMap = execBorderFetch.fulfilled
    ? execBorderFetch.value
    : new Map<ProblemId, BorderData>();

  const lengthBorderMap = lengthBorderFetch.fulfilled
    ? lengthBorderFetch.value
    : new Map<ProblemId, BorderData>();

  const problems = problemsFetch.fulfilled ? problemsFetch.value : [];

  const execStatusMap = useMemo(
    () => toCodeStatusMap(submissions, "execution_time"),
    [submissions, language]
  );
  const lengthStatusMap = useMemo(
    () => toCodeStatusMap(submissions, "length"),
    [submissions, language]
  );

  const abcProblemCount = useMemo(
    () =>
      calcProblemCountByRank(
        problems.filter(problem => problem.id.slice(0, 3) === "abc")
      ),
    [problems]
  );
  const arcProblemCount = useMemo(
    () =>
      calcProblemCountByRank(
        problems.filter(problem => problem.id.slice(0, 3) === "arc")
      ),
    [problems]
  );
  const agcProblemCount = useMemo(
    () =>
      calcProblemCountByRank(
        problems.filter(problem => problem.id.slice(0, 3) === "agc")
      ),
    [problems]
  );

  if (
    submissionsFetch.pending ||
    execBorderFetch.pending ||
    lengthBorderFetch.pending
  ) {
    return <LinearProgress />;
  }

  return (
    <div>
      <h2>
        Hello {userId} language: {language}
      </h2>
      <Paper square>
        <Tabs
          value={statusType}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChangeStatusType}
        >
          <Tab label="Execution Time" value="Execution Time" />
          <Tab label="Code Length" value="Code Length" />
        </Tabs>
      </Paper>

      <TabPanel myType="Execution Time" selectedType={statusType}>
        <h1>Execution Time</h1>
        <PieChartBlock
          title="AtCoder Begginer Contest"
          statusCountByProblemRank={calcStatusCountByProblemRank(
            execStatusMap,
            execBorderMap,
            abcProblemCount,
            "ABC"
          )}
        />
        <PieChartBlock
          title="AtCoder Regular Contest"
          statusCountByProblemRank={calcStatusCountByProblemRank(
            execStatusMap,
            execBorderMap,
            arcProblemCount,
            "ARC"
          )}
        />
        <PieChartBlock
          title="AtCoder Grand Contest"
          statusCountByProblemRank={calcStatusCountByProblemRank(
            execStatusMap,
            execBorderMap,
            agcProblemCount,
            "AGC"
          )}
        />
      </TabPanel>

      <TabPanel myType="Code Length" selectedType={statusType}>
        <h1>Code Length</h1>
        <PieChartBlock
          title="AtCoder Begginer Contest"
          statusCountByProblemRank={calcStatusCountByProblemRank(
            lengthStatusMap,
            lengthBorderMap,
            abcProblemCount,
            "ABC"
          )}
        />
        <PieChartBlock
          title="AtCoder Regular Contest"
          statusCountByProblemRank={calcStatusCountByProblemRank(
            lengthStatusMap,
            lengthBorderMap,
            arcProblemCount,
            "ARC"
          )}
        />
        <PieChartBlock
          title="AtCoder Grand Contest"
          statusCountByProblemRank={calcStatusCountByProblemRank(
            lengthStatusMap,
            lengthBorderMap,
            agcProblemCount,
            "AGC"
          )}
        />
      </TabPanel>
    </div>
  );
};

export const UserPage = connect<OuterProps, InnerProps>(
  ({ userId, language }) => ({
    problemsFetch: {
      comparison: null,
      value: (): Promise<Problem[]> => cachedProblems()
    },
    submissionsFetch: {
      comparison: [userId],
      value: (): Promise<Submission[]> => cachedUserSubmissions(userId)
    },
    lengthBorderFetch: {
      comparison: [language],
      value: (): Promise<Map<ProblemId, BorderData>> =>
        cachedLengthBorder(language)
    },
    execBorderFetch: {
      comparison: [language],
      value: (): Promise<Map<ProblemId, BorderData>> =>
        cachedExecBorder(language)
    }
  })
)(InnerUserPage);
