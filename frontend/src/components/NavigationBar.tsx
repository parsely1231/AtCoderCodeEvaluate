import React, { Children } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {Link, Zoom, CssBaseline, useScrollTrigger} from '@material-ui/core'

import { MyLinksMenu } from "./MyLinksMenu"
import { RankingsMenu } from "./RankingsMenu"
import { InputBox } from "./InputBox"
import { PageLinks } from "./PageLinks"


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }),
);

interface ScrollTopProps {
  window: () => Window;
}

const ScrollTop: React.FC<ScrollTopProps> = ({window}) => {
  const classes = useStyles();
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = ((event.target as HTMLDivElement).ownerDocument || document).querySelector(
      '#back-to-top-anchor',
    );

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.root}>
      </div>
    </Zoom>
  );
}

export const NavigationBar: React.FC = () => {
  const win = window
  return (
    <div>
      <AppBar id="back-to-top-anchor">
        <Toolbar>
          <Typography variant="h6">AtCoder Code Evaluate</Typography>
          <RankingsMenu/>
          <MyLinksMenu/>
        </Toolbar>
        <div className="top-menu">
          <InputBox/>
          <PageLinks/>
        </div>
      </AppBar>
    </div>
  );
}
