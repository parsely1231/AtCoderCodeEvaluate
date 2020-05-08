import React, { Children } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';

import Zoom from '@material-ui/core/Zoom';

import { MyLinksMenu } from "./MyLinksMenu"
import { RankingsMenu } from "./RankingsMenu"

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: React.ReactElement[];
}

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
  return (
    <div>
      <CssBaseline />
      <AppBar id="back-to-top-anchor">
        <Toolbar>
          <Typography variant="h6">AtCoder Code Evaluate</Typography>
          <RankingsMenu/>
          <MyLinksMenu/>
        </Toolbar>
      </AppBar>
    </div>
  );
}
