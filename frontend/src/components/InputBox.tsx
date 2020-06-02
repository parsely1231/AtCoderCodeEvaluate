import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {Zoom, CssBaseline} from '@material-ui/core'


import { useLocalStorage } from "../utils/useLocalStrage"
import { languageList } from "../utils/languageList"



export const InputBox: React.FC = () => {
  const [userName, setUserName] = useLocalStorage("userName", "");
  const [language, setLanguage] = useLocalStorage('language', "C++14 (GCC 5.4.1)");
  const languages = languageList;

  const handleChangeUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleChangeLanguage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.target.value);
  };

  return (
        <>
          <TextField
            id="user-input" 
            label="UserName" 
            onChange={handleChangeUserName}
            defaultValue={userName}
          />
          <TextField
            id="language-input"
            select
            label="Language"
            value={language}
            onChange={handleChangeLanguage}
          >
            {languages.map((language) => (
              <MenuItem key={language} value={language}>
                {language}
              </MenuItem>
            ))}
          </TextField>
        </>
  );
}

