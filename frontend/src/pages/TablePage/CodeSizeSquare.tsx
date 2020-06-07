import React from "react";

import { Tooltip } from "@material-ui/core"


interface CodeSizeSquareProps {
  medianBorder: number | undefined;
  showCodeSize: boolean;
  quantiles: number[];
  lengthUserRank: number;
}

const COLORS = [
  "#FF0000",  // red
  "#FF8000",  // orange
  "#C0C000",  // yellow
  "#0000FF",  // blue
  "#00C0C0",  // cyan
  "#008000",  // green
  "#804000",  // brown
  "#808080",  // grey
] 

function getQuantileIndex(codeSizeMedian: number, descSortedQuantiles: number[]): number {
  for (const [index, quantile] of descSortedQuantiles.entries()){
    if (codeSizeMedian >= quantile) return index
  }
  return 7
}


const DISPLAY = ["-", "E", "D", "C", "B", "A"]

export const CodeSizeSquare: React.FC<CodeSizeSquareProps> = ({ medianBorder, showCodeSize, quantiles, lengthUserRank }) => {
  if (showCodeSize == false) return null
  if (medianBorder === undefined) return <span className="unavailable">?</span>

  const quantileIndex = getQuantileIndex(medianBorder, quantiles)

  const color = COLORS[quantileIndex]
  const borderRange = quantileIndex === 0 
    ? 1
    : quantiles[quantileIndex-1] - quantiles[quantileIndex]
    
  const fill: number = 
    medianBorder >= quantiles[0]
      ? 0 
      : 100 - Math.floor((medianBorder - quantiles[quantileIndex]) / borderRange * 100);
  
  const styleOptions: Object = {
    borderColor: color,
    background: `linear-gradient(#ffffff ${fill}%, ${color} ${fill}%)`
  }
  
  

  return (
    <div className='status-box'>
      <Tooltip title={medianBorder}>
        <span
          className="length-square"
          style={styleOptions}
        />
      </Tooltip>
      <span className={"status-"+lengthUserRank}>
        {DISPLAY[lengthUserRank]}
      </span>
    </div>
  )
}