import React from "react"


interface ExecTimeCircleProps {
  execTimeAve: number
}

export const ExecTimeCircle: React.FC<ExecTimeCircleProps> = ({execTimeAve}) => {
  const fill: number = 
    execTimeAve >= 2000 
      ? 100 
      : Math.floor(100 * execTimeAve / 2000);
  
  const redidue: number = 100 - fill;

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