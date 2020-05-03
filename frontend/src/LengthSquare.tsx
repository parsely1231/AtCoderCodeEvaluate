import React from "react";


interface LengthCircleProps {
  lengthAve: number
}

const getColor = (lengthAve: number): string => {
  if (lengthAve < 400) {
    return "#808080";  // grey
  } 
  else if (lengthAve < 800) {
    return "#804000";  // brown
  } 
  else if (lengthAve < 1200) {
    return "#008000";  // green
  } 
  else if (lengthAve < 1600) {
    return "#00C0C0";  // cyan
  } 
  else if (lengthAve < 2000) {
    return "#0000FF";  // blue
  } 
  else if (lengthAve < 2400) {
    return "#C0C000";  // yellow
  } 
  else if (lengthAve < 2800) {
    return "#FF8000";  // orange
  } 
  else if (lengthAve < 3200) {
    return "#FF0000";  // red
  } 
  else if (lengthAve < 3600) {
    return "#965C2C";  // bronze
  } 
  else if (lengthAve < 4000) {
    return "#808080";  // silver
  } 
  else {
    return "#ffd700";  // gold
  } 
}
  


export const LengthSquare: React.FC<LengthCircleProps> = (props) => {
  const color = getColor(props.lengthAve);
  const fill: number = 
    props.lengthAve >= 3200 
      ? 100 
      : Math.floor((props.lengthAve % 400) / 4);
  
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