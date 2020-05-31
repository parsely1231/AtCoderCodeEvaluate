import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';


import { useLocalStorage } from "../utils/useLocalStrage"



export const InputBox: React.FC = () => {
  const [userName, setUserName] = useLocalStorage("userName", "");
  const [language, setLanguage] = useLocalStorage('language', "");
  const languages = ["a", "b"];

  const handleChangeUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleChangeLanguage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.target.value);
  };

  return (
    <div className="input-box">
      <form noValidate autoComplete="off">
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
          helperText="Please select your language"
        >
          {languages.map((language) => (
            <MenuItem key={language} value={language}>
              {language}
            </MenuItem>
          ))}
        </TextField>
      </form>
    </div>
  );
}

