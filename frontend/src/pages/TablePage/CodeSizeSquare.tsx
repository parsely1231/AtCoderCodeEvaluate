import React from "react";


interface CodeSizeSquareProps {
  codeSizeAve: number
  showCodeSize: boolean
}

const getColor = (codeSizeAve: number): string => {
  if (codeSizeAve < 400) {
    return "#808080";  // grey
  } 
  else if (codeSizeAve < 800) {
    return "#804000";  // brown
  } 
  else if (codeSizeAve < 1200) {
    return "#008000";  // green
  } 
  else if (codeSizeAve < 1600) {
    return "#00C0C0";  // cyan
  } 
  else if (codeSizeAve < 2000) {
    return "#0000FF";  // blue
  } 
  else if (codeSizeAve < 2400) {
    return "#C0C000";  // yellow
  } 
  else if (codeSizeAve < 2800) {
    return "#FF8000";  // orange
  } 
  else if (codeSizeAve < 3200) {
    return "#FF0000";  // red
  } 
  else if (codeSizeAve < 3600) {
    return "#965C2C";  // bronze
  } 
  else if (codeSizeAve < 4000) {
    return "#808080";  // silver
  } 
  else {
    return "#ffd700";  // gold
  } 
}
  

export const CodeSizeSquare: React.FC<CodeSizeSquareProps> = ({ codeSizeAve, showCodeSize }) => {
  if (showCodeSize == false) return null

  const color = getColor(codeSizeAve);
  const fill: number = 
    codeSizeAve >= 3200 
      ? 100 
      : Math.floor((codeSizeAve % 400) / 4);
  
  const redidue: number = 100 - fill;

  const styleOptions: Object = {
    borderColor: color,
    background: `linear-gradient(#ffffff ${redidue}%, ${color} ${fill}%)`
  }

  return (
    <span
      className="length-square"
      style={styleOptions}
    />
  )
}