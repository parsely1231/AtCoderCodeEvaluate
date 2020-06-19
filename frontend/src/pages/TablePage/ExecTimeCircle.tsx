import React from "react";
import { Tooltip } from "@material-ui/core";

interface ExecTimeCircleProps {
  medianBorder: number | undefined;
  showExecTime: boolean;
  execUserRank: number;
}

const DISPLAY = ["-", "E", "D", "C", "B", "A"];

export const ExecTimeCircle: React.FC<ExecTimeCircleProps> = ({
  medianBorder,
  showExecTime,
  execUserRank
}) => {
  if (showExecTime === false) {
    return null;
  }
  if (medianBorder === undefined) {
    return <span className="unavailable">?</span>;
  }

  const fill: number =
    medianBorder >= 2000 ? 100 : Math.floor((100 * medianBorder) / 2000);

  const styleOptions: object = {
    borderColor: "green",
    background: `conic-gradient(green 0%, green ${fill}%, white ${fill}%, white 100%)`
  };

  return (
    <div className="status-box">
      <Tooltip title={medianBorder}>
        <span className="exectime-circle" style={styleOptions} />
      </Tooltip>
      <span className={"status-" + execUserRank}>{DISPLAY[execUserRank]}</span>
    </div>
  );
};
