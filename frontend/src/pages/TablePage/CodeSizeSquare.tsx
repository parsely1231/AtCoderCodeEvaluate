import React from "react";


interface CodeSizeSquareProps {
  medianBorder: number;
  showCodeSize: boolean;
  mod: number;
  quantiles: number[];
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
const getColor = (codeSizeMedian: number, descSortedQuantiles: number[]): string => {
  descSortedQuantiles.forEach((quantile, index) => {
    if (codeSizeMedian >= quantile) return COLORS[index]
  })
  return "#808080"  // grey
}
  

export const CodeSizeSquare: React.FC<CodeSizeSquareProps> = ({ medianBorder, showCodeSize, mod, quantiles }) => {
  if (showCodeSize == false) return null

  const color = getColor(medianBorder, quantiles);
  const fill: number = 
    medianBorder >= quantiles[0] + mod
      ? 100 
      : Math.floor((medianBorder % mod) / mod * 100);
  
  const residue: number = 100 - fill;

  const styleOptions: Object = {
    borderColor: color,
    background: `linear-gradient(#ffffff ${residue}%, ${color} ${fill}%)`
  }

  return (
    <span
      className="length-square"
      style={styleOptions}
    />
  )
}