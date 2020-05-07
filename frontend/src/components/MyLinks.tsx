import React from "react";
import { Button, Menu, MenuItem, Link } from "@material-ui/core";


interface LinkedMenuItemProps {
  href: string;
  text: string;
}

const LinkedMenuItem: React.FC<LinkedMenuItemProps> = ({ href, text }) => {
  return (
    <Link href={href} target={"_blank"} rel={"noopener"}>
      <MenuItem>{text}</MenuItem>
    </Link>
  )
}

export const MyLinks: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button className="nav-button" aria-controls="link-menu" aria-haspopup="true" onClick={handleClick}>
        Links
      </Button>
      <Menu
        id="link-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <LinkedMenuItem href={"https://atcoder.jp/"} text={"AtCoder"}/>
        <LinkedMenuItem href={"https://kenkoooo.com/atcoder"} text={"AtCoder Problems"}/>
        <LinkedMenuItem href={"http://aoj-icpc.ichyo.jp"} text={"AOJ-ICPC"}/>
        <LinkedMenuItem href={"https://github.com/parsely1231/AtCoderCodeEvaluate"} text={"GitHub"}/>
        <LinkedMenuItem href={"https://twitter.com/it_parsely"} text={"Admin twitter"}/>

      </Menu>
    </>
  )
}
