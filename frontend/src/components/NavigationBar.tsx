import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { MyLinksMenu } from "./MyLinksMenu";
import { InputBox } from "./InputBox";
import { PageLinks } from "./PageLinks";

interface Props {
  userName: string;
  language: string;
  setUserName: (userName: string) => void;
  setLanguage: (language: string) => void;
}

export const NavigationBar: React.FC<Props> = ({
  userName,
  language,
  setUserName,
  setLanguage
}) => {
  return (
    <div>
      <AppBar id="back-to-top-anchor">
        <Toolbar>
          <Typography variant="h6">AtCoder Code Evaluate</Typography>
          <MyLinksMenu />
        </Toolbar>
        <div className="top-menu">
          <InputBox
            userName={userName}
            language={language}
            setUserName={setUserName}
            setLanguage={setLanguage}
          />
          <PageLinks />
        </div>
      </AppBar>
    </div>
  );
};
