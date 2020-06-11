import React from 'react';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import { languageList } from "../utils/languageList"


type InputProps = {
  userName: string,
  language: string,
  setUserName: (userName :string) => void,
  setLanguage: (language :string) => void,
}


export const InputBox: React.FC<InputProps> = ({userName, language, setUserName, setLanguage}) => {
  
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

