import React from "react"


interface ExecTimeCircleProps {
  medianBorder: number | undefined;
  showExecTime: boolean;
}

export const ExecTimeCircle: React.FC<ExecTimeCircleProps> = ({ medianBorder, showExecTime }) => {
  if (showExecTime == false) return null
  if (medianBorder === undefined) return <span className="unavailable">?</span>

  const fill: number = 
    medianBorder >= 2000 
      ? 100 
      : Math.floor(100 * medianBorder / 2000);
  
  const styleOptions: Object = {
    borderColor: "green",
    background: `conic-gradient(green 0%, green ${fill}%, white ${fill}%, white 100%)`
  }

  return (
    <span
      className="exectime-circle"
      style={styleOptions}
    />
  )
}