import React from "react";
import { Link } from "react-router-dom"
import { Button, Menu, MenuItem } from "@material-ui/core";


interface LinkedMenuItemProps {
  to: string;
  text: string;
}

const ToLinkMenuItem: React.FC<LinkedMenuItemProps> = ({ to, text }) => {
  return (
    <Link to={to}>
      <MenuItem>{text}</MenuItem>
    </Link>
  )
}

export const Rankings: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button className="nav-button" aria-controls="ranking-menu" aria-haspopup="true" onClick={handleClick}>
        Rankings
      </Button>
      <Menu
        id="ranking-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <ToLinkMenuItem to={"/ranking/codesize"} text={"Code Size"}/>
        <ToLinkMenuItem to={"/ranking/exectime"} text={"Exec Time"}/>

      </Menu>
    </>
  )
}
