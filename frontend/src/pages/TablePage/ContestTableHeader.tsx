import React from "react";
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const getHeaderElems = (contestType: string): string[] => {
  switch (contestType) {
    case "ABC":
      return ['Contest', 'A', 'B', 'C', 'D', 'E', 'F']
    
    case "ARC":
      return ['Contest', 'C', 'D', 'E', 'F']
    
    case "AGC":
      return ['Contest', 'A', 'B', 'C', 'D', 'E', 'F', 'F2']
    
    default:
      return ['Contest', 'A', 'B', 'C', 'D', 'E', 'F']
  }
}

interface ContestTableHeaderProps {
  contestType: string
}

export const ContestTableHeader: React.FC<ContestTableHeaderProps> = ({ contestType }) => {
  const headerElems: string[] = getHeaderElems(contestType);
  return (
    <TableHead>
      <TableRow>
        {headerElems.map((elem) => {
          return (
          <TableCell>{elem}</TableCell>
          )
        })}
      </TableRow>
    </TableHead>
  )
}
